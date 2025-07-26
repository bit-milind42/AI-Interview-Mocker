"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect } from "react";
import InterviewItemCard from "./InterviewItemCard";
import { Clock, FileText, Loader2 } from "lucide-react";

function InterviewList({ interviews, onInterviewClick }) {
  const { user } = useUser();
  const [interviewList, setInterviewList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  
  useEffect(() => {
    user && GetInterviewList();
  }, [user]);
  
  const GetInterviewList = async() => {
    try {
      setLoading(true);
      const result = await db.select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy,user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(MockInterview.id));

      console.log(result);
      setInterviewList(result);
    } catch (error) {
      console.error('Error fetching interview list:', error);
      setInterviewList([]);
    } finally {
      setLoading(false);
    }
  }
  
  const handleDeleteInterview = (deletedMockId) => {
    setInterviewList(prevList => 
      prevList.filter(interview => interview.mockId !== deletedMockId)
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
          <Clock className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className='text-2xl font-bold'>Previous Mock Interviews</h2>
          <p className="text-muted-foreground">Review your past interviews and track your progress</p>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading your interviews...</p>
          </div>
        </div>
      ) : (
        <div>
          {interviewList && interviewList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviewList.map((interview, index) => (
                <InterviewItemCard 
                  key={interview.mockId || index} 
                  interview={interview} 
                  onDelete={handleDeleteInterview}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-12 bg-muted/50 rounded-xl border-2 border-dashed border-muted-foreground/20">
              <div className="space-y-4">
                <div className="h-16 w-16 bg-muted-foreground/10 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="h-8 w-8 text-muted-foreground/60" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-muted-foreground">No interviews yet</h3>
                  <p className="text-muted-foreground/80 max-w-md mx-auto">
                    Create your first mock interview to start practicing and improving your skills!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default InterviewList;