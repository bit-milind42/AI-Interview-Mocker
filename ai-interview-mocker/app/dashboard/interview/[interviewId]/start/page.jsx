"use client";
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect } from 'react'
import Webcam from "react-webcam";
import { useState } from 'react';
import QuestionsSection from './_components/QuestionsSection';

function StartInterview({params}) {
    const [interviewData, setInterviewData] = React.useState();
    const [mockInterviewQuestion, setMockInterviewQuestion] = React.useState([]);
    useEffect(() => {
        GetInterviewDetails();
    }, []);

    const GetInterviewDetails=async()=>{
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId));
        console.log(result)
        const jsonMockResp=JSON.parse(result[0].jsonMockResp)
        console.log(jsonMockResp);
        setMockInterviewQuestion(jsonMockResp);
        setInterviewData(result[0]);
        
    }

    return(
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2'>
{/* questions */}
<QuestionsSection/>


{/* Video/ Audio Recording */}
            </div>
            
        </div>
    )
}

export default StartInterview