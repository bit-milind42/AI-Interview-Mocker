"use client";
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { useEffect } from 'react';
import React, { use } from 'react';
import { db } from '@/utils/db';
import Webcam from "react-webcam";
import { useState } from 'react';
import { WebcamIcon, Lightbulb, Camera, Mic, Play, Briefcase, Clock, FileText, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function Interview({params}){
    const unwrappedParams = React.use(params);
    const [interviewData, setInterviewData] = useState();
    const [webcamEnabled, setWebcamEnabled] = useState(false);
    
    useEffect(() => {
        console.log(unwrappedParams.interviewId);
        GetInterviewDetails();
    }, []);
    
    // Used to get interview details by mockId/interviewId
    const GetInterviewDetails=async()=>{
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, unwrappedParams.interviewId));
        console.log(result)
        setInterviewData(result[0]);
    }
    
    return (
        <div className='space-y-8'>
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Brain className="h-8 w-8 text-primary" />
                </div>
                <h1 className='text-3xl md:text-4xl font-bold'>Let's Get Started</h1>
                <p className="text-xl text-muted-foreground">
                    Prepare yourself for an AI-powered mock interview experience
                </p>
            </div>
            
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto'>
                {/* Left Side - Interview Details */}
                <div className='space-y-6'>
                    {/* Interview Details Card */}
                    <div className='bg-card border rounded-xl p-6 space-y-6'>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <Briefcase className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className='text-xl font-semibold'>Interview Details</h3>
                        </div>
                        
                        {interviewData ? (
                            <div className='space-y-4'>
                                <div className="space-y-2">
                                    <label className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
                                        <Briefcase className="h-4 w-4" />
                                        Job Position
                                    </label>
                                    <div className='p-4 bg-muted/50 rounded-lg border'>
                                        <p className="font-medium">{interviewData.jobPosition}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
                                        <FileText className="h-4 w-4" />
                                        Job Description/Tech Stack
                                    </label>
                                    <div className='p-4 bg-muted/50 rounded-lg border min-h-[100px]'>
                                        <p className="whitespace-pre-wrap">{interviewData.jobDesc}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
                                        <Clock className="h-4 w-4" />
                                        Years of Experience
                                    </label>
                                    <div className='p-4 bg-muted/50 rounded-lg border'>
                                        <p className="font-medium">{interviewData.jobExperience} years</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="animate-pulse space-y-3">
                                    <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                                    <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Information Card */}
                    <div className='bg-gradient-to-br from-primary/10 to-blue-500/10 border rounded-xl p-6'>
                        <div className='flex items-start space-x-3'>
                            <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center">
                                <Lightbulb className='h-5 w-5 text-primary' />
                            </div>
                            <div className="flex-1">
                                <h4 className='font-semibold text-lg mb-3'>AI Mock Interview Experience</h4>
                                <p className='text-muted-foreground mb-4 leading-relaxed'>
                                    Get ready for a realistic interview experience powered by advanced AI. 
                                    Practice with personalized questions and receive instant feedback.
                                </p>
                                <div className='space-y-3'>
                                    <div className='flex items-center space-x-3 text-sm'>
                                        <div className="h-8 w-8 bg-green-500/10 rounded-full flex items-center justify-center">
                                            <Camera className='h-4 w-4 text-green-600' />
                                        </div>
                                        <span>Record video responses for review</span>
                                    </div>
                                    <div className='flex items-center space-x-3 text-sm'>
                                        <div className="h-8 w-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                                            <Mic className='h-4 w-4 text-blue-600' />
                                        </div>
                                        <span>Get instant AI-powered feedback</span>
                                    </div>
                                    <div className='flex items-center space-x-3 text-sm'>
                                        <div className="h-8 w-8 bg-purple-500/10 rounded-full flex items-center justify-center">
                                            <Brain className='h-4 w-4 text-purple-600' />
                                        </div>
                                        <span>Personalized questions for your role</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Right Side - Webcam */}
                <div className='flex flex-col'>
                    <div className='bg-card border rounded-xl p-6 h-fit'>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <Camera className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className='text-xl font-semibold'>Camera Setup</h3>
                        </div>
                        
                        <div className='flex flex-col items-center space-y-4'>
                            {webcamEnabled ? (
                                <div className='space-y-4 w-full'>
                                    <div className="relative rounded-xl overflow-hidden border-2 border-primary/20">
                                        <Webcam 
                                            onUserMedia={() => setWebcamEnabled(true)}
                                            onUserMediaError={() => setWebcamEnabled(false)}
                                            className='w-full h-[300px] object-cover'
                                        />
                                    </div>
                                    <Button 
                                        onClick={() => setWebcamEnabled(false)} 
                                        variant="outline"
                                        className='w-full'
                                    >
                                        <Camera className="h-4 w-4 mr-2" />
                                        Disable Camera
                                    </Button>
                                </div>
                            ) : (
                                <div className='w-full'>
                                    <div className='flex flex-col items-center justify-center bg-muted/50 rounded-xl border-2 border-dashed border-muted-foreground/20 p-12'>
                                        <div className="h-16 w-16 bg-muted-foreground/10 rounded-full flex items-center justify-center mb-4">
                                            <WebcamIcon className='h-8 w-8 text-muted-foreground/60'/>
                                        </div>
                                        <h4 className="font-semibold mb-2">Camera Required</h4>
                                        <p className='text-muted-foreground text-center text-sm mb-6'>
                                            Enable your camera to start recording your responses
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
                            <div className='mt-6'>
                                <Link href={`/dashboard/interview/`+unwrappedParams.interviewId+'/start'}>
                                    <Button className='w-full' size="lg">
                                        <Play className="h-5 w-5 mr-2" />
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