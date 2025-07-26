import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Play, BarChart3, Briefcase, Star, TrendingUp, Trash2, MoreVertical } from "lucide-react";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function InterviewItemCard({ interview, onDelete }) {
    const router = useRouter();
    const [averageRating, setAverageRating] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    
    useEffect(() => {
        fetchInterviewStats();
    }, [interview?.mockId]);
    
    const fetchInterviewStats = async () => {
        if (!interview?.mockId) {
            setLoading(false);
            return;
        }
        
        try {
            const answers = await db.select()
                .from(UserAnswer)
                .where(eq(UserAnswer.mockIdRef, interview.mockId));
            
            if (answers.length > 0) {
                const totalRating = answers.reduce((sum, answer) => {
                    const rating = parseFloat(answer.rating) || 0;
                    return sum + rating;
                }, 0);
                
                const avgRating = totalRating / answers.length;
                setAverageRating(avgRating);
                setIsCompleted(true);
            }
        } catch (error) {
            console.error('Error fetching interview stats:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const extractTechStack = (jobDesc) => {
        if (!jobDesc) return [];
        
        const commonTech = [
            'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'TypeScript',
            'Angular', 'Vue.js', 'PHP', 'C++', 'C#', 'Go', 'Rust', 'Swift',
            'Kotlin', 'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
            'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'Jenkins',
            'HTML', 'CSS', 'Sass', 'Bootstrap', 'Tailwind', 'Express.js'
        ];
        
        const found = [];
        const lowerDesc = jobDesc.toLowerCase();
        
        commonTech.forEach(tech => {
            if (lowerDesc.includes(tech.toLowerCase()) || 
                lowerDesc.includes(tech.toLowerCase().replace('.', ''))) {
                found.push(tech);
            }
        });
        
        return found.slice(0, 3); // Show max 3 tech stack items
    };
    
    const onStart = () => {
        router.push("/dashboard/interview/" + interview?.mockId);
    }
    
    const onFeedbackPress = () => {
        router.push("/dashboard/interview/" + interview?.mockId + "/feedback");
    }
    
    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const response = await fetch(`/api/interviews/${interview.mockId}`, {
                method: 'DELETE',
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Call the parent component's onDelete callback
                if (onDelete) {
                    onDelete(interview.mockId);
                }
                setShowDeleteDialog(false);
            } else {
                console.error('Failed to delete interview:', result.error);
                alert('Failed to delete interview. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting interview:', error);
            alert('An error occurred while deleting the interview.');
        } finally {
            setIsDeleting(false);
        }
    };
    
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    const techStack = extractTechStack(interview?.jobDesc);
    
    return (
        <div className='group bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]'>
            {/* Status Badge */}
            {!loading && (
                <div className="flex justify-between items-start mb-4">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isCompleted 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                        {isCompleted ? 'Completed' : 'Pending'}
                    </div>
                    
                    {/* Average Rating Display */}
                    {averageRating && (
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
                        </div>
                    )}
                </div>
            )}
            
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
                
                {/* Action Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600"
                            onClick={() => setShowDeleteDialog(true)}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Interview
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            
            {/* Tech Stack */}
            {techStack.length > 0 && (
                <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2">Tech Stack:</p>
                    <div className="flex flex-wrap gap-1">
                        {techStack.map((tech, index) => (
                            <span 
                                key={index}
                                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                            >
                                {tech}
                            </span>
                        ))}
                        {techStack.length < extractTechStack(interview?.jobDesc).length && (
                            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                                +{extractTechStack(interview?.jobDesc).length - techStack.length} more
                            </span>
                        )}
                    </div>
                </div>
            )}
            
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
            
            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Interview</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this interview? This action will permanently 
                            remove the interview and all associated answers and feedback. This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button 
                            variant="outline" 
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default InterviewItemCard;
