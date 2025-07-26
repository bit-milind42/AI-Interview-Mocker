import { db } from "@/utils/db";
import { QuestionBank } from "@/utils/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function POST(request) {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { 
            question, 
            answer, 
            category, 
            difficulty, 
            jobRole, 
            technology, 
            company,
            interviewYear,
            interviewRound,
            tags,
            estimatedTime
        } = await request.json();

        // Validate required fields
        if (!question || !category || !difficulty || !company) {
            return NextResponse.json(
                { error: "Question, category, difficulty, and company are required" },
                { status: 400 }
            );
        }

        // Insert the real question into the database
        const result = await db.insert(QuestionBank).values({
            question,
            answer: answer || "Answer guide will be added after verification.",
            category,
            difficulty,
            jobRole,
            technology,
            company,
            tags: JSON.stringify(tags || []),
            estimatedTime: estimatedTime || "5 minutes",
            isRealQuestion: true,
            questionSource: "User-Reported",
            interviewYear: interviewYear || new Date().getFullYear().toString(),
            interviewRound: interviewRound || "Not specified",
            verificationStatus: "unverified", // Will be verified by admin
            reportedBy: userId,
            createdBy: userId
        }).returning();

        return NextResponse.json({
            success: true,
            question: {
                ...result[0],
                tags: JSON.parse(result[0].tags)
            },
            message: "Thank you for submitting this real interview question! It will be verified and added to our database."
        });

    } catch (error) {
        console.error('Error submitting real question:', error);
        return NextResponse.json(
            { error: "Failed to submit question: " + error.message }, 
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'all';
        const limit = parseInt(searchParams.get('limit')) || 20;

        let query = db.select().from(QuestionBank).where(eq(QuestionBank.isRealQuestion, true));

        if (status !== 'all') {
            query = query.where(eq(QuestionBank.verificationStatus, status));
        }

        const questions = await query
            .orderBy(desc(QuestionBank.createdAt))
            .limit(limit);

        const questionsWithTags = questions.map(q => ({
            ...q,
            tags: q.tags ? JSON.parse(q.tags) : []
        }));

        return NextResponse.json({
            questions: questionsWithTags,
            total: questions.length
        });

    } catch (error) {
        console.error('Error fetching real questions:', error);
        return NextResponse.json(
            { error: "Failed to fetch questions" }, 
            { status: 500 }
        );
    }
}
