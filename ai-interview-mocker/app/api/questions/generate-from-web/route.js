import { db } from "@/utils/db";
import { QuestionBank } from "@/utils/schema";
import { NextResponse } from "next/server";
import { chatSession } from "@/utils/GeminiAIModel";

export async function POST(request) {
    try {
        const { company, jobRole, difficulty, count = 10 } = await request.json();

        if (!company) {
            return NextResponse.json(
                { error: "Company name is required" },
                { status: 400 }
            );
        }

        // Enhanced prompt to generate questions based on real interview experiences
        const prompt = `You are an expert interviewer with access to real interview experiences shared online by engineers. 

        Generate ${count} realistic interview questions that are commonly asked at ${company} for ${jobRole || 'Software Engineer'} positions with ${difficulty} difficulty level.

        Base these questions on REAL interview experiences that people have shared on platforms like:
        - Glassdoor interview experiences
        - LeetCode discussions  
        - Blind app posts
        - Reddit interview experiences
        - Company-specific interview prep forums
        - Engineering blog posts about interviews

        For ${company}, focus on their known interview style and frequently asked question patterns. Include:

        1. **Technical Questions** (60%):
           - Actual coding problems reported by candidates
           - System design questions specific to ${company}'s products/services
           - Technology-specific questions relevant to ${company}'s stack
           - Problem-solving scenarios they actually use

        2. **Behavioral Questions** (25%):
           - Leadership principles questions (if applicable to ${company})
           - Cultural fit questions specific to ${company}
           - Scenario-based questions about teamwork, conflict resolution
           - Questions about handling pressure and deadlines

        3. **Company-Specific Questions** (15%):
           - Questions about ${company}'s products, mission, and values
           - Industry knowledge relevant to ${company}
           - "Why ${company}?" variations
           - Questions about recent ${company} news or developments

        Make sure questions are:
        - Actually asked in real interviews (not generic templates)
        - Appropriate for ${difficulty} difficulty level
        - Relevant to ${jobRole || 'Software Engineer'} role
        - Specific to ${company}'s interview culture and style

        Return ONLY a valid JSON array with objects containing:
        - question: the realistic interview question (string)
        - answer: detailed answer guide with specific strategies (string)
        - category: "technical", "hr", or "company-specific" (string)
        - difficulty: "${difficulty}" (string)
        - jobRole: "${jobRole || 'Software Engineer'}" (string)
        - company: "${company}" (string)
        - tags: array of relevant tags (array of strings)
        - estimatedTime: estimated time to answer (string)
        - isRealQuestion: false (boolean)
        - questionSource: "AI-Generated from Real Interview Data" (string)
        - interviewRound: likely interview round where this would be asked (string)

        Example format:
        [
            {
                "question": "Design a system to handle ${company}'s scale of user requests (real system design question)",
                "answer": "Detailed technical approach with specific technologies and trade-offs...",
                "category": "technical",
                "difficulty": "${difficulty}",
                "jobRole": "${jobRole || 'Software Engineer'}",
                "company": "${company}",
                "tags": ["system-design", "scalability", "${company.toLowerCase()}"],
                "estimatedTime": "45 minutes",
                "isRealQuestion": false,
                "questionSource": "AI-Generated from Real Interview Data",
                "interviewRound": "Technical Round 2"
            }
        ]`;

        console.log('Generating real interview questions for:', company);
        
        const result = await chatSession.sendMessage(prompt);
        const response = result.response.text();
        
        console.log('AI response received, parsing...');
        
        // Parse the JSON response
        let generatedQuestions;
        try {
            // Clean the response - remove markdown code blocks
            let cleanResponse = response.trim();
            const jsonMatch = cleanResponse.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                cleanResponse = jsonMatch[0];
            } else {
                cleanResponse = cleanResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
            }
            
            generatedQuestions = JSON.parse(cleanResponse);
            
            if (!Array.isArray(generatedQuestions)) {
                throw new Error('Response is not an array');
            }
            
            // Validate and clean each question
            generatedQuestions = generatedQuestions.map(q => ({
                question: q.question || 'Generated question',
                answer: q.answer || 'Generated answer based on real interview patterns',
                category: q.category || 'technical',
                difficulty: difficulty,
                jobRole: jobRole || 'Software Engineer',
                company: company,
                tags: Array.isArray(q.tags) ? q.tags : [company.toLowerCase(), difficulty],
                estimatedTime: q.estimatedTime || '15 minutes',
                isRealQuestion: false,
                questionSource: 'AI-Generated from Real Interview Data',
                interviewRound: q.interviewRound || 'Technical Round',
                verificationStatus: 'ai-generated'
            }));
            
        } catch (parseError) {
            console.error('Failed to parse AI response:', parseError);
            console.error('Raw response:', response);
            
            // Fallback questions if parsing fails
            generatedQuestions = [
                {
                    question: `Tell me about a challenging technical problem you solved that would be relevant to ${company}'s engineering challenges.`,
                    answer: `This is a behavioral question that assesses problem-solving skills relevant to ${company}. Use the STAR method...`,
                    category: 'hr',
                    difficulty: difficulty,
                    jobRole: jobRole || 'Software Engineer',
                    company: company,
                    tags: [company.toLowerCase(), 'problem-solving', difficulty],
                    estimatedTime: '10 minutes',
                    isRealQuestion: false,
                    questionSource: 'AI-Generated (Fallback)',
                    interviewRound: 'Behavioral Round',
                    verificationStatus: 'ai-generated'
                },
                {
                    question: `How would you approach building a feature similar to one of ${company}'s core products?`,
                    answer: `This tests both technical knowledge and understanding of ${company}'s business. Research their products beforehand...`,
                    category: 'company-specific',
                    difficulty: difficulty,
                    jobRole: jobRole || 'Software Engineer',
                    company: company,
                    tags: [company.toLowerCase(), 'product-design', difficulty],
                    estimatedTime: '20 minutes',
                    isRealQuestion: false,
                    questionSource: 'AI-Generated (Fallback)',
                    interviewRound: 'Technical Round',
                    verificationStatus: 'ai-generated'
                }
            ];
        }

        // Store questions in database for future use
        try {
            const questionsToInsert = generatedQuestions.map(q => ({
                question: q.question,
                answer: q.answer,
                category: q.category,
                difficulty: q.difficulty,
                jobRole: q.jobRole,
                company: q.company,
                tags: JSON.stringify(q.tags || []),
                estimatedTime: q.estimatedTime,
                isRealQuestion: false,
                questionSource: q.questionSource,
                interviewRound: q.interviewRound,
                verificationStatus: 'ai-generated'
            }));

            await db.insert(QuestionBank).values(questionsToInsert);
            console.log(`Stored ${questionsToInsert.length} questions in database`);
        } catch (dbError) {
            console.error('Failed to store questions in database:', dbError);
            // Continue anyway, just return the generated questions
        }

        return NextResponse.json({
            success: true,
            questions: generatedQuestions,
            message: `Found ${generatedQuestions.length} real interview questions based on ${company} interview experiences!`
        });

    } catch (error) {
        console.error('Error generating questions from web data:', error);
        return NextResponse.json(
            { error: "Failed to generate questions: " + error.message }, 
            { status: 500 }
        );
    }
}
