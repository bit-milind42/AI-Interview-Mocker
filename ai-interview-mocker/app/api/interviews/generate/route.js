import { db } from "@/utils/db";
import { MockInterview, QuestionBank } from "@/utils/schema";
import { NextResponse } from "next/server";
import { chatSession } from "@/utils/GeminiAIModel";
import { v4 as uuidv4 } from 'uuid';
import { eq, and, desc } from "drizzle-orm";

export async function POST(request) {
    try {
        const { category, difficulty, jobRole, company, technology, userId, userEmail } = await request.json();

        // Validate required fields
        if (!userId || !userEmail) {
            return NextResponse.json(
                { error: 'User ID and email are required' },
                { status: 400 }
            );
        }

        const questionCount = process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT || 5;
        let questionsArray = [];

        // First, try to get real questions from the database
        const realQuestions = await fetchRealQuestions(category, difficulty, jobRole, company, technology, questionCount);
        
        if (realQuestions.length > 0) {
            questionsArray = realQuestions.map(q => ({
                question: q.question,
                answer: q.answer,
                isRealQuestion: true,
                questionSource: q.questionSource,
                company: q.company,
                interviewYear: q.interviewYear,
                interviewRound: q.interviewRound
            }));
        }

        // If we need more questions, generate AI questions based on real interview patterns
        const remainingCount = questionCount - questionsArray.length;
        if (remainingCount > 0) {
            const aiQuestions = await generateRealisticQuestions(
                category, difficulty, jobRole, company, technology, remainingCount
            );
            questionsArray = [...questionsArray, ...aiQuestions];
        }
        
        // Build job position string
        let jobPosition = jobRole || 'General Position';
        if (technology) {
            jobPosition = `${jobPosition} - ${technology}`;
        }
        if (company) {
            jobPosition = `${jobPosition} at ${company}`;
        }

        // Build job description
        const jobDescription = buildJobDescription(category, difficulty, jobRole, company, technology);

        // Create mock interview record
        const mockId = uuidv4();
        
        const interviewRecord = await db.insert(MockInterview)
            .values({
                mockId: mockId,
                jsonMockResp: JSON.stringify(questionsArray),
                jobPosition: jobPosition,
                jobDesc: jobDescription,
                jobExperience: difficulty,
                createdBy: userEmail,
                createdAt: new Date().toISOString(),
            })
            .returning({ mockId: MockInterview.mockId });

        if (!interviewRecord || interviewRecord.length === 0) {
            return NextResponse.json(
                { error: 'Failed to create interview session' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            mockId: interviewRecord[0].mockId,
            questionsCount: questionsArray.length,
            jobPosition: jobPosition,
            category: category,
            difficulty: difficulty,
            realQuestionsCount: questionsArray.filter(q => q.isRealQuestion).length,
            aiQuestionsCount: questionsArray.filter(q => !q.isRealQuestion).length
        });

    } catch (error) {
        console.error('Error generating interview:', error);
        return NextResponse.json(
            { error: 'Internal server error. Please try again.' },
            { status: 500 }
        );
    }
}

// Helper function to fetch real questions from database
async function fetchRealQuestions(category, difficulty, jobRole, company, technology, limit) {
    try {
        const conditions = [eq(QuestionBank.isRealQuestion, true)];
        
        if (category && category !== 'mixed') {
            conditions.push(eq(QuestionBank.category, category));
        }
        if (difficulty) {
            conditions.push(eq(QuestionBank.difficulty, difficulty));
        }
        if (jobRole) {
            conditions.push(eq(QuestionBank.jobRole, jobRole));
        }
        if (company) {
            conditions.push(eq(QuestionBank.company, company));
        }
        if (technology) {
            conditions.push(eq(QuestionBank.technology, technology));
        }

        const questions = await db.select()
            .from(QuestionBank)
            .where(and(...conditions))
            .orderBy(desc(QuestionBank.verificationStatus), desc(QuestionBank.viewCount))
            .limit(limit);

        return questions;
    } catch (error) {
        console.error('Error fetching real questions:', error);
        return [];
    }
}

// Helper function to generate realistic AI questions
async function generateRealisticQuestions(category, difficulty, jobRole, company, technology, count) {
    let prompt = "";
    
    if (category === 'hr') {
        prompt = `Generate ${count} realistic HR/Behavioral interview questions that are commonly asked at ${company || 'top tech companies'} for ${jobRole || 'software developer'} positions.
        
        Base these questions on ACTUAL interview patterns and questions that companies like ${company || 'Google, Microsoft, Amazon, Meta'} typically ask.
        Difficulty level: ${difficulty}
        
        Focus on:
        - Real behavioral scenarios commonly encountered in interviews
        - Questions that assess cultural fit for ${company || 'tech companies'}
        - Leadership and teamwork situations
        - Problem-solving and conflict resolution
        - Career motivation and growth mindset
        
        Make these questions realistic and specific, not generic. Include questions that would realistically be asked in ${difficulty} difficulty interviews.`;
        
    } else if (category === 'technical') {
        prompt = `Generate ${count} realistic technical interview questions commonly asked at ${company || 'top tech companies'} for ${jobRole || 'software developer'} positions.
        
        Base these on ACTUAL technical interview patterns from companies like ${company || 'Google, Microsoft, Amazon, Meta, Apple'}.
        Technology focus: ${technology || 'general software development'}
        Difficulty level: ${difficulty}
        
        Include:
        - Coding problems that are actually asked in interviews
        - System design questions appropriate for the role level
        - Technology-specific questions for ${technology || 'common technologies'}
        - Algorithm and data structure problems
        - Real scenarios and constraints that interviewers use
        
        Make these questions challenging and realistic, matching the ${difficulty} difficulty level of actual company interviews.`;
        
    } else if (category === 'company-specific') {
        prompt = `Generate ${count} company-specific interview questions that ${company || 'top tech companies'} actually ask candidates for ${jobRole || 'software developer'} positions.
        
        Base these on REAL questions that ${company || 'major companies'} are known to ask in interviews.
        Difficulty level: ${difficulty}
        
        Include:
        - Questions about ${company || 'the company'}'s products, services, and mission
        - Cultural fit questions specific to ${company || 'the company'}'s values
        - Role-specific challenges and scenarios
        - Questions about why candidates want to work at ${company || 'the company'}
        - Industry-specific knowledge relevant to ${company || 'the company'}'s domain
        
        Research and base these on documented interview experiences and actual questions reported by candidates.`;
        
    } else {
        prompt = `Generate ${count} mixed interview questions (combination of behavioral, technical, and company-specific) that are commonly asked at ${company || 'top tech companies'} for ${jobRole || 'software developer'} positions.
        
        Base these on ACTUAL interview patterns and real questions from companies like ${company || 'Google, Microsoft, Amazon, Meta'}.
        Technology focus: ${technology || 'general software development'}
        Difficulty level: ${difficulty}
        
        Include a balanced mix of:
        - Real behavioral questions (40%)
        - Technical questions (40%) 
        - Company/role-specific questions (20%)
        
        Make these realistic and based on documented interview experiences.`;
    }

    prompt += `
    
    IMPORTANT: Base these questions on REAL interview experiences, not generic templates.
    
    Return ONLY a valid JSON array with objects containing:
    - question: the realistic interview question (string)
    - answer: a detailed answer guide with specific examples and strategies (string)
    - isRealQuestion: false (since these are AI-generated based on real patterns)
    - questionSource: "AI-Generated (Based on Real Patterns)"
    
    Example format:
    [
        {
            "question": "Tell me about a time when you had to deal with a difficult team member and how you handled it.",
            "answer": "Use the STAR method. Look for specific examples showing conflict resolution, empathy, and professional communication. Good answers demonstrate the ability to find common ground, escalate appropriately when needed, and maintain team productivity. Example: 'In my previous role, I had a team member who consistently missed deadlines...'",
            "isRealQuestion": false,
            "questionSource": "AI-Generated (Based on Real Patterns)"
        }
    ]`;

    try {
        console.log("Generating realistic questions with prompt:", prompt);
        
        const result = await chatSession.sendMessage(prompt);
        const responseText = await result.response.text();
        
        // Clean the response to get valid JSON
        const cleanedResponse = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        let aiQuestionsArray;
        try {
            aiQuestionsArray = JSON.parse(cleanedResponse);
        } catch (parseError) {
            console.error('Failed to parse AI response:', parseError);
            console.error('Response was:', cleanedResponse);
            // Return fallback questions
            return [{
                question: `Sample realistic ${category} question for ${jobRole || 'this role'} (${difficulty} level)`,
                answer: `This is a sample answer based on real interview patterns.`,
                isRealQuestion: false,
                questionSource: "AI-Generated (Fallback)"
            }];
        }

        if (!Array.isArray(aiQuestionsArray) || aiQuestionsArray.length === 0) {
            return [{
                question: `Sample realistic ${category} question for ${jobRole || 'this role'} (${difficulty} level)`,
                answer: `This is a sample answer based on real interview patterns.`,
                isRealQuestion: false,
                questionSource: "AI-Generated (Fallback)"
            }];
        }

        return aiQuestionsArray.map(q => ({
            question: q.question,
            answer: q.answer,
            isRealQuestion: false,
            questionSource: q.questionSource || "AI-Generated (Based on Real Patterns)"
        }));

    } catch (error) {
        console.error('Error generating AI questions:', error);
        return [{
            question: `Sample ${category} question for ${jobRole || 'this role'} (${difficulty} level)`,
            answer: `This is a sample answer.`,
            isRealQuestion: false,
            questionSource: "AI-Generated (Error Fallback)"
        }];
    }
}

// Helper function to build job description
function buildJobDescription(category, difficulty, jobRole, company, technology) {
    let jobDescription = "";
    
    if (category === 'hr') {
        jobDescription = `HR and Behavioral interview focusing on real scenarios commonly asked at ${company || 'top companies'}. `;
        if (company) {
            jobDescription += `Interview tailored for ${company} company culture and values. `;
        }
        jobDescription += `Questions assess communication skills, conflict resolution, adaptability, and career motivation based on actual interview patterns.`;
        
    } else if (category === 'technical') {
        jobDescription = `Technical interview based on real questions asked at ${company || 'leading tech companies'}. `;
        if (technology) {
            jobDescription += `Focus on ${technology} technology stack and related concepts. `;
        }
        if (company) {
            jobDescription += `Interview pattern tailored for ${company}'s technical requirements. `;
        }
        jobDescription += `Questions assess coding skills, problem-solving, architecture design, and technical expertise using actual interview formats.`;
        
    } else if (category === 'company-specific') {
        jobDescription = `Company-specific interview for ${company || 'target company'} based on real questions asked by their interviewers. `;
        jobDescription += `Questions assess knowledge about the company, alignment with company values, and specific skills required for the role using documented interview experiences.`;
        
    } else {
        jobDescription = `Comprehensive interview combining real questions from various categories commonly asked at ${company || 'top companies'}. `;
        if (company) {
            jobDescription += `Interview pattern for ${company}. `;
        }
        if (technology) {
            jobDescription += `With focus on ${technology} technology. `;
        }
        jobDescription += `Questions provide a well-rounded assessment based on actual interview experiences.`;
    }
    
    return jobDescription;
}
