import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { NextResponse } from 'next/server';
import { eq } from "drizzle-orm";

export async function GET(request, { params }) {
  try {
    const { interviewId } = params;
    
    const result = await db.select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));

    if (result.length === 0) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error fetching interview:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { interviewId } = params;
    
    // First delete all related user answers
    await db.delete(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, interviewId));
    
    // Then delete the interview itself
    const result = await db.delete(MockInterview)
      .where(eq(MockInterview.mockId, interviewId))
      .returning({ mockId: MockInterview.mockId });

    if (result.length === 0) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Interview deleted successfully',
      mockId: result[0].mockId 
    });
  } catch (error) {
    console.error('Error deleting interview:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}