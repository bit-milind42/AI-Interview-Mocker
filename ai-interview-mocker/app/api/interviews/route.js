import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import moment from "moment";

export async function POST(request) {
  try {
    const { mockJsonResponse, jobPosition, jobDesc, jobExperience, createdBy } = await request.json();

    const mockId = uuidv4();
    
    const result = await db.insert(MockInterview).values({
      mockId: mockId,
      jsonMockResp: mockJsonResponse,
      jobPosition: jobPosition,
      jobDesc: jobDesc,
      jobExperience: jobExperience,
      createdBy: createdBy,
      createdAt: moment().format('DD-MM-YYYY HH:mm:ss'),
    }).returning({ mockId: MockInterview.mockId });

    console.log("Interview saved successfully:");
    console.log("Mock ID:", mockId);
    console.log("Questions/Answers:", mockJsonResponse);
    console.log("Inserted at:", moment().format('DD-MM-YYYY HH:mm:ss'));

    return NextResponse.json({ 
      success: true, 
      mockId: mockId
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}