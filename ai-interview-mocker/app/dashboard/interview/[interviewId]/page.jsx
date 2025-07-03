"use client";
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { useEffect } from 'react';
import React, { use } from 'react';
import { db } from '@/utils/db';
import Webcam from "react-webcam";
import { useState } from 'react';
import { WebcamIcon, Lightbulb, Camera, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function Interview({params}){
    const [interviewData, setInterviewData] = useState();
    const [webcamEnabled, setWebcamEnabled] = useState(false);
    
    useEffect(() => {
        console.log(params.interviewId);
        GetInterviewDetails();
    }, []);
    // Used to get interview details by mockId/interviewId
    const GetInterviewDetails=async()=>{
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId));
        console.log(result)
        setInterviewData(result[0]);
    }
    return (
        <div className='my-10'>
            <h2 className='font-bold text-2xl text-center mb-10'>Let's Get Started</h2>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto px-6'>
                {/* Left Side - Interview Details */}
                <div className='space-y-6'>
                    <div className='bg-white border rounded-lg p-6 shadow-sm'>
                        <h3 className='text-lg font-semibold mb-4 text-primary'>Interview Details</h3>
                        
                        {interviewData && (
                            <div className='space-y-4'>
                                <div>
                                    <label className='text-sm font-medium text-gray-600 block mb-1'>
                                        Job Position
                                    </label>
                                    <div className='p-3 bg-gray-50 rounded border'>
                                        {interviewData.jobPosition}
                                    </div>
                                </div>
                                
                                <div>
                                    <label className='text-sm font-medium text-gray-600 block mb-1'>
                                        Job Description
                                    </label>
                                    <div className='p-3 bg-gray-50 rounded border min-h-[100px] whitespace-pre-wrap'>
                                        {interviewData.jobDesc}
                                    </div>
                                </div>
                                
                                <div>
                                    <label className='text-sm font-medium text-gray-600 block mb-1'>
                                        Years of Experience
                                    </label>
                                    <div className='p-3 bg-gray-50 rounded border'>
                                        {interviewData.jobExperience} years
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Information Card */}
                    <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
                        <div className='flex items-start space-x-3'>
                            <Lightbulb className='h-6 w-6 text-blue-600 mt-0.5' />
                            <div>
                                <h4 className='font-semibold text-blue-900 mb-2'>AI Mock Interview</h4>
                                <p className='text-blue-800 text-sm leading-relaxed mb-3'>
                                    Welcome to your AI-powered mock interview! This intelligent system will conduct a realistic interview experience based on your job details.
                                </p>
                                <div className='space-y-2 text-blue-800 text-sm'>
                                    <div className='flex items-center space-x-2'>
                                        <Camera className='h-4 w-4' />
                                        <span>Record your video responses</span>
                                    </div>
                                    <div className='flex items-center space-x-2'>
                                        <Mic className='h-4 w-4' />
                                        <span>Get instant AI feedback on your answers</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Right Side - Webcam */}
                <div className='flex flex-col items-center justify-center'>
                    <div className='bg-white border rounded-lg p-6 shadow-sm w-full max-w-md'>
                        <h3 className='text-lg font-semibold mb-4 text-center text-primary'>Camera Setup</h3>
                        
                        <div className='flex flex-col items-center'>
                            {webcamEnabled ? (
                                <div className='space-y-4'>
                                    <Webcam 
                                        onUserMedia={() => setWebcamEnabled(true)}
                                        onUserMediaError={() => setWebcamEnabled(false)}
                                        className='rounded-lg border'
                                        style={{
                                            height: 300,
                                            width: 300,
                                        }}
                                    />
                                    <Button 
                                        onClick={() => setWebcamEnabled(false)} 
                                        variant="outline"
                                        className='w-full'
                                    >
                                        Disable Camera
                                    </Button>
                                </div>
                            ) : (
                                <div className='space-y-4 w-full'>
                                    <div className='flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8'>
                                        <WebcamIcon className='h-16 w-16 text-gray-400 mb-4'/>
                                        <p className='text-gray-600 text-center text-sm mb-4'>
                                            Enable your camera to start the interview
                                        </p>
                                        <Button 
                                            onClick={() => setWebcamEnabled(true)}
                                            className='w-full'
                                        >
                                            <Camera className='h-4 w-4 mr-2' />
                                            Enable Camera
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {webcamEnabled && (
                            <div className='mt-4 text-center'>
                                <Link href={`/dashboard/interview/`+params.interviewId+'/start'}>
                                    <Button className='w-full' size="lg">
                                        Start Interview
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Interview;