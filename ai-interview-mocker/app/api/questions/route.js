import { db } from "@/utils/db";
import { QuestionBank, Companies, UserQuestionActivity } from "@/utils/schema";
import { eq, and, desc, sql, ilike, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const difficulty = searchParams.get('difficulty');
        const company = searchParams.get('company');
        const jobRole = searchParams.get('jobRole');
        const technology = searchParams.get('technology');
        const search = searchParams.get('search');
        const limit = parseInt(searchParams.get('limit')) || 50;
        const offset = parseInt(searchParams.get('offset')) || 0;
        const userId = searchParams.get('userId');

        let query = db.select({
            id: QuestionBank.id,
            question: QuestionBank.question,
            answer: QuestionBank.answer,
            category: QuestionBank.category,
            difficulty: QuestionBank.difficulty,
            jobRole: QuestionBank.jobRole,
            technology: QuestionBank.technology,
            company: QuestionBank.company,
            isPopular: QuestionBank.isPopular,
            viewCount: QuestionBank.viewCount,
            practiceCount: QuestionBank.practiceCount,
            successRate: QuestionBank.successRate,
            tags: QuestionBank.tags,
            estimatedTime: QuestionBank.estimatedTime,
            createdAt: QuestionBank.createdAt,
        }).from(QuestionBank);

        // Apply filters
        const conditions = [];
        
        if (category && category !== 'all') {
            conditions.push(eq(QuestionBank.category, category));
        }
        
        if (difficulty && difficulty !== 'all') {
            conditions.push(eq(QuestionBank.difficulty, difficulty));
        }
        
        if (company) {
            conditions.push(eq(QuestionBank.company, company));
        }
        
        if (jobRole) {
            conditions.push(eq(QuestionBank.jobRole, jobRole));
        }
        
        if (technology) {
            conditions.push(eq(QuestionBank.technology, technology));
        }
        
        if (search) {
            conditions.push(
                or(
                    ilike(QuestionBank.question, `%${search}%`),
                    ilike(QuestionBank.tags, `%${search}%`),
                    ilike(QuestionBank.jobRole, `%${search}%`),
                    ilike(QuestionBank.technology, `%${search}%`)
                )
            );
        }

        if (conditions.length > 0) {
            query = query.where(and(...conditions));
        }

        const questions = await query
            .orderBy(desc(QuestionBank.isPopular), desc(QuestionBank.viewCount))
            .limit(limit)
            .offset(offset);

        // If userId is provided, get user's activity for these questions
        let userActivity = {};
        if (userId && questions.length > 0) {
            const questionIds = questions.map(q => q.id);
            const activities = await db.select()
                .from(UserQuestionActivity)
                .where(and(
                    eq(UserQuestionActivity.userId, userId),
                    sql`${UserQuestionActivity.questionId} = ANY(${questionIds})`
                ));
            
            userActivity = activities.reduce((acc, activity) => {
                acc[activity.questionId] = activity;
                return acc;
            }, {});
        }

        // Add user activity data to questions
        const questionsWithActivity = questions.map(question => ({
            ...question,
            tags: question.tags ? JSON.parse(question.tags) : [],
            userActivity: userActivity[question.id] || null
        }));

        return NextResponse.json({
            questions: questionsWithActivity,
            hasMore: questions.length === limit
        });

    } catch (error) {
        console.error('Error fetching questions:', error);
        return NextResponse.json(
            { error: "Failed to fetch questions" }, 
            { status: 500 }
        );
    }
}

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
            tags, 
            estimatedTime 
        } = await request.json();

        const result = await db.insert(QuestionBank).values({
            question,
            answer,
            category,
            difficulty,
            jobRole,
            technology,
            company,
            tags: JSON.stringify(tags || []),
            estimatedTime,
            createdBy: userId
        }).returning();

        return NextResponse.json(result[0]);

    } catch (error) {
        console.error('Error creating question:', error);
        return NextResponse.json(
            { error: "Failed to create question" }, 
            { status: 500 }
        );
    }
}
