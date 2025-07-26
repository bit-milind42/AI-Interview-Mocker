import { db } from "@/utils/db";
import { UserQuestionActivity } from "@/utils/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function POST(request) {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { questionId, action, timeTaken, userRating } = await request.json();

        // Check if activity already exists
        const existingActivity = await db.select()
            .from(UserQuestionActivity)
            .where(and(
                eq(UserQuestionActivity.userId, userId),
                eq(UserQuestionActivity.questionId, questionId)
            ))
            .limit(1);

        if (existingActivity.length > 0) {
            // Update existing activity
            const updateData = {};
            
            if (action === 'bookmark') {
                updateData.isBookmarked = true;
            } else if (action === 'unbookmark') {
                updateData.isBookmarked = false;
            } else if (action === 'practice') {
                updateData.isPracticed = true;
                updateData.practiceDate = new Date();
                if (timeTaken) updateData.timeTaken = timeTaken;
                if (userRating) updateData.userRating = userRating;
            }

            await db.update(UserQuestionActivity)
                .set(updateData)
                .where(eq(UserQuestionActivity.id, existingActivity[0].id));

        } else {
            // Create new activity
            const newActivity = {
                userId,
                questionId,
                isBookmarked: action === 'bookmark',
                isPracticed: action === 'practice',
                timeTaken: timeTaken || null,
                userRating: userRating || null
            };

            await db.insert(UserQuestionActivity).values(newActivity);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error updating user activity:', error);
        return NextResponse.json(
            { error: "Failed to update activity" }, 
            { status: 500 }
        );
    }
}
