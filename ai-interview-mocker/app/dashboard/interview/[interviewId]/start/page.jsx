"use client";
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect } from 'react'
import Webcam from "react-webcam";
import { useState } from 'react';
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function StartInterview({params}) {
    const unwrappedParams = React.use(params);
    const [interviewData, setInterviewData] = React.useState();
    const [mockInterviewQuestion, setMockInterviewQuestion] = React.useState([]);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    useEffect(() => {
        GetInterviewDetails();
    }, []);

    const GetInterviewDetails=async()=>{
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, unwrappedParams.interviewId));
        console.log(result)
        const jsonMockResp=JSON.parse(result[0].jsonMockResp)
        console.log(jsonMockResp);
        setMockInterviewQuestion(jsonMockResp);
        setInterviewData(result[0]);
        
    }

    return(
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
{/* questions */}
<QuestionsSection mockInterviewQuestions={mockInterviewQuestion}
activeQuestionIndex={activeQuestionIndex}
/>


{/* Video/ Audio Recording */}
<RecordAnswerSection
mockInterviewQuestions={mockInterviewQuestion}
activeQuestionIndex={activeQuestionIndex}
interviewData={interviewData}
/>
            </div>
            <div className='flex justify-end gap-6'>
                {activeQuestionIndex >0 && <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}
                {activeQuestionIndex!= mockInterviewQuestion?.length-1 && <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>}
                {activeQuestionIndex == mockInterviewQuestion?.length-1 && <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}><Button>End Question</Button></Link>}
            </div>
        </div>
    )
}

export default StartInterview