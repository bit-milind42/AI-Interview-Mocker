import { db } from "@/utils/db";
import { QuestionBank } from "@/utils/schema";
import { NextResponse } from "next/server";
import { chatSession } from "@/utils/GeminiAIModel";

export async function POST(request) {
    try {
        const { category, difficulty, jobRole, company, technology, count = 5 } = await request.json();

        let prompt = "";
        
        if (category === 'hr') {
            prompt = `Generate ${count} HR/Behavioral interview questions for ${jobRole || 'any job role'} position with ${difficulty} difficulty level. 
            Focus on behavioral situations, cultural fit, motivation, and soft skills.
            Each question should be relevant and realistic.
            
            Return ONLY a valid JSON array with objects containing:
            - question: the interview question (string)
            - answer: a detailed answer guide (string) 
            - tags: array of relevant tags (array of strings)
            - estimatedTime: estimated time to answer (string like "3-4 minutes")
            
            Example format:
            [
                {
                    "question": "Tell me about a time when you had to work under pressure.",
                    "answer": "Use the STAR method to describe a specific situation...",
                    "tags": ["pressure", "stress-management", "problem-solving"],
                    "estimatedTime": "4-5 minutes"
                }
            ]`;
        } 
        else if (category === 'technical') {
            prompt = `Generate ${count} technical interview questions for ${jobRole || 'software developer'} position with ${difficulty} difficulty level.
            ${technology ? `Focus specifically on ${technology} technology.` : 'Cover general software development concepts.'}
            Include coding problems, system design, algorithms, and technical concepts appropriate for the difficulty level.
            
            Return ONLY a valid JSON array with objects containing:
            - question: the interview question (string)
            - answer: a detailed technical answer with explanations (string)
            - tags: array of relevant technical tags (array of strings)
            - estimatedTime: estimated time to answer (string like "5-8 minutes")
            
            Example format:
            [
                {
                    "question": "Explain the difference between let, const, and var in JavaScript.",
                    "answer": "Let and const are block-scoped while var is function-scoped...",
                    "tags": ["javascript", "variables", "scope"],
                    "estimatedTime": "3-4 minutes"
                }
            ]`;
        }
        else if (category === 'company-specific') {
            prompt = `Generate ${count} company-specific interview questions commonly asked at ${company || 'top tech companies'} for ${jobRole || 'software developer'} position with ${difficulty} difficulty level.
            Include questions about company culture, values, products, leadership principles, and specific challenges they face.
            Make questions realistic and based on what ${company || 'major companies'} actually ask in interviews.
            
            Return ONLY a valid JSON array with objects containing:
            - question: the company-specific interview question (string)
            - answer: a comprehensive answer guide mentioning company specifics (string)
            - tags: array of relevant tags including company name (array of strings)
            - estimatedTime: estimated time to answer (string like "4-6 minutes")
            
            Example format:
            [
                {
                    "question": "Why do you want to work at ${company || 'this company'} specifically?",
                    "answer": "Research the company's mission, recent achievements, and connect your goals...",
                    "tags": ["${company || 'company'}", "motivation", "culture-fit"],
                    "estimatedTime": "3-4 minutes"
                }
            ]`;
        }

        console.log('Sending prompt to Gemini:', prompt);
        
        const result = await chatSession.sendMessage(prompt);
        const response = result.response.text();
        
        console.log('Gemini response:', response);
        
        // Parse the JSON response
        let generatedQuestions;
        try {
            // Clean the response - remove markdown code blocks and any extra text
            let cleanResponse = response.trim();
            
            // Find JSON array in the response
            const jsonMatch = cleanResponse.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                cleanResponse = jsonMatch[0];
            } else {
                // If no array found, try to extract from code blocks
                cleanResponse = cleanResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
            }
            
            generatedQuestions = JSON.parse(cleanResponse);
            
            // Validate that it's an array
            if (!Array.isArray(generatedQuestions)) {
                throw new Error('Response is not an array');
            }
            
            // Validate each question has required fields
            generatedQuestions = generatedQuestions.map(q => ({
                question: q.question || 'Generated question',
                answer: q.answer || 'Generated answer',
                tags: Array.isArray(q.tags) ? q.tags : [],
                estimatedTime: q.estimatedTime || '5 minutes'
            }));
            
        } catch (parseError) {
            console.error('Failed to parse AI response:', parseError);
            console.error('Raw response:', response);
            
            // Fallback questions if parsing fails
            generatedQuestions = [{
                question: `Sample ${category} question for ${jobRole || 'this role'} (${difficulty} level)`,
                answer: `This is a sample answer. The AI response could not be parsed properly.`,
                tags: [category, difficulty],
                estimatedTime: '5 minutes'
            }];
        }

        // Store questions in database
        const questionsToInsert = generatedQuestions.map(q => ({
            question: q.question,
            answer: q.answer,
            category,
            difficulty,
            jobRole: jobRole || null,
            technology: technology || null,
            company: company || null,
            tags: JSON.stringify(q.tags || []),
            estimatedTime: q.estimatedTime || '5 minutes'
        }));

        const insertedQuestions = await db.insert(QuestionBank)
            .values(questionsToInsert)
            .returning();

        return NextResponse.json({
            success: true,
            questions: insertedQuestions.map(q => ({
                ...q,
                tags: JSON.parse(q.tags)
            }))
        });

    } catch (error) {
        console.error('Error generating questions:', error);
        return NextResponse.json(
            { error: "Failed to generate questions: " + error.message }, 
            { status: 500 }
        );
    }
}
