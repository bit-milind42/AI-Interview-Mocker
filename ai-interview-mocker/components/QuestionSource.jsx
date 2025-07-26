"use client";
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Verified, Bot, Users, Calendar, Building2, Clock } from 'lucide-react';

export default function QuestionSource({ question }) {
    const {
        isRealQuestion = false,
        questionSource = "AI-Generated",
        company,
        interviewYear,
        interviewRound,
        verificationStatus = "unverified"
    } = question;

    if (isRealQuestion) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Verified className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">Real Interview Question</span>
                        <Badge variant={verificationStatus === 'verified' ? 'default' : 'secondary'} className="ml-2">
                            {verificationStatus === 'verified' ? 'Verified' : 'Pending Verification'}
                        </Badge>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-sm text-green-700">
                    {company && (
                        <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            <span><strong>Company:</strong> {company}</span>
                        </div>
                    )}
                    {interviewYear && (
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span><strong>Year:</strong> {interviewYear}</span>
                        </div>
                    )}
                    {interviewRound && (
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span><strong>Round:</strong> {interviewRound}</span>
                        </div>
                    )}
                </div>
                
                <p className="mt-3 text-sm text-green-600 italic">
                    This question was actually asked in a real interview and has been reported by candidates.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">AI-Generated Question</span>
                    <Badge variant="outline" className="ml-2 text-blue-600 border-blue-200">
                        Based on Real Patterns
                    </Badge>
                </div>
            </div>
            
            <p className="text-sm text-blue-600 italic">
                This question is AI-generated based on real interview patterns and commonly asked questions 
                at {company || 'top companies'}.
            </p>
        </div>
    );
}

// Badge component if not already available
export function QuestionTypeBadge({ isRealQuestion, verificationStatus }) {
    if (isRealQuestion) {
        return (
            <Badge 
                variant={verificationStatus === 'verified' ? 'default' : 'secondary'}
                className="flex items-center gap-1"
            >
                <Verified className="w-3 h-3" />
                {verificationStatus === 'verified' ? 'Real & Verified' : 'Real (Pending)'}
            </Badge>
        );
    }
    
    return (
        <Badge variant="outline" className="flex items-center gap-1 text-blue-600 border-blue-200">
            <Bot className="w-3 h-3" />
            AI-Generated
        </Badge>
    );
}
