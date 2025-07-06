"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect } from "react";
import InterviewItemCard from "./InterviewItemCard";

function InterviewList({ interviews, onInterviewClick }) {
  const { user } = useUser();
  const [interviewList, setInterviewList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  
  useEffect(() => {
    user && GetInterviewList();
  }, [user]);
  
  const GetInterviewList = async()=>{
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
  return (
    <div>
      <h2 className='font-medium text-xl'>Previous Mock Interview List</h2>
      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading previous interviews...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
          {interviewList && interviewList.length > 0 ? (
            interviewList.map((interview, index) => (
              <InterviewItemCard key={interview.mockId || index} interview={interview} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <div className="text-gray-500">No previous interviews found. Create your first interview!</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default InterviewList;