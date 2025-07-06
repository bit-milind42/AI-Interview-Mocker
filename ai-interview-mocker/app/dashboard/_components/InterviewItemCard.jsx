import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Play, BarChart3, Briefcase } from "lucide-react";

function InterviewItemCard({ interview }) {
    const router = useRouter();
    
    const onStart = () => {
        router.push("/dashboard/interview/" + interview?.mockId);
    }
    
    const onFeedbackPress = () => {
        router.push("/dashboard/interview/" + interview?.mockId + "/feedback");
    }
    
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    return (
        <div className='group bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]'>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                        <h3 className='font-bold text-lg text-foreground leading-tight'>
                            {interview?.jobPosition || 'Interview Position'}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            {interview?.jobExperience} Years Experience
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Description/Tech Stack */}
            {interview?.jobDesc && (
                <div className="mb-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {interview.jobDesc}
                    </p>
                </div>
            )}
            
            {/* Created Date */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4 pb-4 border-b">
                <Calendar className="h-3 w-3" />
                Created: {formatDate(interview?.createdAt)}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 h-9"
                    onClick={onFeedbackPress}
                >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Feedback
                </Button>
                
                <Button 
                    size="sm" 
                    className="flex-1 h-9"
                    onClick={onStart}
                >
                    <Play className="h-4 w-4 mr-2" />
                    Start
                </Button>
            </div>
        </div>
    );
}

export default InterviewItemCard;
