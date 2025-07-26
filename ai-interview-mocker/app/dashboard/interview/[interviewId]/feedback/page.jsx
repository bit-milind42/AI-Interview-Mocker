"use client";
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { ChevronsUpDown, User, AlertTriangle, CheckCircle, TrendingUp, Star } from 'lucide-react';
import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    calculatePerformanceStats, 
    getRatingCategory, 
    generateRecommendations,
    RATING_THRESHOLDS 
} from '@/utils/ratingUtils';


function Feedback({params}) {
    const resolvedParams = React.use(params);
    const [feedbackList, setFeedbackList] = React.useState([]);
    const [performanceStats, setPerformanceStats] = React.useState(null);
    const router= useRouter();
    
    useEffect(() => {
        GetFeedback();
    },[])

    useEffect(() => {
        if (feedbackList.length > 0) {
            const stats = calculatePerformanceStats(feedbackList);
            setPerformanceStats(stats);
        }
    }, [feedbackList]);

    const GetFeedback=async()=>{
        const result = await db.select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, resolvedParams.interviewId))
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
        <div className='p-10 max-w-6xl mx-auto'>
            
            {feedbackList?.length ==0?
            <h2 className='font-bold text-xl text-gray-500'> No Interview Feedback Record Found</h2>
            :<>
            <h2 className='font-bold text-3xl text-green-500'>Congratulations</h2>
            <h2 className='font-bold text-2xl text-gray-700'>Here is your interview feedback</h2>

            {/* Performance Overview */}
            {performanceStats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                    {/* Overall Rating Card */}
                    <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">Overall Rating</h3>
                            <Star className="h-6 w-6 text-yellow-500" />
                        </div>
                        <div className="text-3xl font-bold text-primary mb-2">
                            {performanceStats.averageRating}/5
                        </div>
                        <Badge variant={performanceStats.overallPass ? "default" : "destructive"}>
                            {performanceStats.overallPass ? "Passing" : "Needs Improvement"}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-2">
                            Minimum threshold: {RATING_THRESHOLDS.OVERALL_MINIMUM}/5
                        </p>
                    </div>

                    {/* Questions Analysis */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">Question Analysis</h3>
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm">Passed Questions:</span>
                                <span className="font-semibold text-green-600">
                                    {performanceStats.passedQuestions}/{performanceStats.totalQuestions}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Need Improvement:</span>
                                <span className="font-semibold text-orange-600">
                                    {performanceStats.questionsNeedingImprovement}
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Minimum rating per question: {RATING_THRESHOLDS.MINIMUM_PASSING_RATING}/5
                        </p>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">Next Steps</h3>
                            <TrendingUp className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="space-y-2">
                            {generateRecommendations(performanceStats).slice(0, 2).map((rec, index) => (
                                <p key={index} className="text-sm text-muted-foreground">
                                    • {rec}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <h2 className='text-sm text-gray-500 mb-6'>Find below interview question with correct answer, Your answer and feedback for improvement</h2>

            {feedbackList && feedbackList.map((item,index)=>{
                const rating = parseInt(item.rating) || 0;
                const ratingCategory = getRatingCategory(rating);
                const needsImprovement = rating < RATING_THRESHOLDS.MINIMUM_PASSING_RATING;
                
                return (
                <Collapsible key={index} className='mt-7'>
                    <CollapsibleTrigger className="p-4 bg-secondary rounded-lg flex justify-between items-center my-2 text-left gap-4 w-full hover:bg-secondary/80 transition-colors">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="font-medium">Question {index + 1}</span>
                                {needsImprovement && (
                                    <Badge variant="destructive" className="text-xs">
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        Needs Improvement
                                    </Badge>
                                )}
                                <Badge 
                                    variant="outline" 
                                    className={`${ratingCategory.color} ${ratingCategory.borderColor}`}
                                >
                                    {rating}/5 - {ratingCategory.label}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.question}</p>
                        </div>
                        <ChevronsUpDown className='h-5 w-5 text-muted-foreground'/>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className='flex flex-col gap-4 p-4 bg-muted/20 rounded-lg mt-2'>
                            <div className={`p-3 border rounded-lg ${ratingCategory.bgColor} ${ratingCategory.borderColor}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <strong className={ratingCategory.color}>Rating: {item.rating}/5</strong>
                                    <Badge variant="outline" size="sm" className={ratingCategory.color}>
                                        {ratingCategory.label}
                                    </Badge>
                                </div>
                                <p className={`text-sm ${ratingCategory.color}`}>
                                    {ratingCategory.description}
                                    {needsImprovement && " - Below minimum threshold"}
                                </p>
                            </div>
                            <div className='p-3 border rounded-lg bg-red-50 border-red-200'>
                                <strong className="text-red-700">Your Answer:</strong>
                                <p className="text-sm text-red-600 mt-1">{item.userAns}</p>
                            </div>
                            <div className='p-3 border rounded-lg bg-green-50 border-green-200'>
                                <strong className="text-green-700">Correct Answer:</strong>
                                <p className="text-sm text-green-600 mt-1">{item.correctAns}</p>
                            </div>
                            <div className='p-3 border rounded-lg bg-blue-50 border-blue-200'>
                                <strong className="text-blue-700">Feedback:</strong>
                                <p className="text-sm text-blue-600 mt-1">{item.feedback}</p>
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
                )
            })}
            
            <div className="mt-8 pt-6 border-t">
                <Button onClick={()=>router.replace('/dashboard')} size="lg">
                    Go Home
                </Button>
            </div>
            </>}

        </div>
    )
}

export default Feedback;