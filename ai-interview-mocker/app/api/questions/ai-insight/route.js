import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    try {
        const { question } = await req.json();

        if (!question) {
            return NextResponse.json(
                { error: 'Question is required' },
                { status: 400 }
            );
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        As an experienced technical interviewer and career coach, analyze this interview question and provide detailed insights:

        Question: "${question}"

        Please provide:
        1. Key points the candidate should cover
        2. Common mistakes to avoid
        3. Follow-up questions the interviewer might ask
        4. Similar companies that ask this type of question
        5. Difficulty assessment and tips

        Format your response as a structured analysis that will help the candidate prepare effectively.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const analysis = response.text();

        return NextResponse.json({
            analysis,
            keyPoints: [
                "Focus on problem-solving approach",
                "Explain your thought process clearly", 
                "Consider edge cases and optimization",
                "Ask clarifying questions if needed"
            ],
            commonMistakes: [
                "Jumping to solution without understanding",
                "Not considering edge cases",
                "Poor time complexity analysis"
            ],
            similarCompanies: ["Google", "Meta", "Amazon", "Microsoft"],
            difficulty: "Medium",
            tips: "Practice similar problems and explain your approach step by step"
        });

    } catch (error) {
        console.error('Error generating AI insight:', error);
        return NextResponse.json(
            { error: 'Failed to generate AI insight' },
            { status: 500 }
        );
    }
}
