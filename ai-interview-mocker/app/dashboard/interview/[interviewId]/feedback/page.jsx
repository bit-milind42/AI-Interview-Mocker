"use client";
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { ChevronsUpDown, User } from 'lucide-react';
import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';


function Feedback({params}) {

    const [feedbackList, setFeedbackList] = React.useState([]);
    const router= useRouter();
    useEffect(() => {
        GetFeedback();
    },[])

    const GetFeedback=async()=>{
        const result = await db.select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, params.interviewId))
        .orderBy(UserAnswer.id);

        console.log(result);
        setFeedbackList(result);
    }

    // Calculate overall rating
    const calculateOverallRating = () => {
        if (!feedbackList || feedbackList.length === 0) return 0;
        
        const totalRating = feedbackList.reduce((sum, item) => {
            const rating = parseInt(item.rating) || 0;
            return sum + rating;
        }, 0);
        
        const averageRating = totalRating / feedbackList.length;
        return Math.round(averageRating * 10) / 10; // Round to 1 decimal place
    }
    return(
        <div className='p-10'>
            <h2 className='font-bold text-3xl text-green-500'>Congratulations</h2>
            <h2 className='font-bold text-2xl text-gray-700'>Here is your interview feedback</h2>
            <h2 className='text-primary text-lg my-3'>Your overall interview rating: <strong>{calculateOverallRating()}/5</strong></h2>

            <h2 className='text-sm text-gray-500'>Find below interview question with correct answer, Your answer and feedback for improvement</h2>

            {feedbackList && feedbackList.map((item,index)=>(
                <Collapsible key={index} className='mt-7'>
                    <CollapsibleTrigger className="p-2 bg-secondary rounded-lg flex justify-between my-2 text-left gap-7 w-full">
                    {item.question} <ChevronsUpDown className='h-5 w-5'/>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className='flex flex-col gap-2'>
                            <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating: </strong>{item.rating}</h2>
                            <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer: </strong>{item.userAns}</h2>
                            <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer: </strong>{item.correctAns}</h2>
                            <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-blue-900'><strong>Feedback: </strong>{item.feedback}</h2>

                        </div>
                    </CollapsibleContent>
                </Collapsible>

            ))}
            <Button onClick={()=>router.replace('/dashboard')}>Go Home</Button>

        </div>
    )
}

export default Feedback;