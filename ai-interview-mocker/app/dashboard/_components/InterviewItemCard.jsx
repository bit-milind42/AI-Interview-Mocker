import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function InterviewItemCard({ interview }) {

    const router = useRouter();
    const onStart=()=>{
        router.push("/dashboard/interview/" + interview?.mockId);
    }
    const onFeedbackPress=()=>{
        router.push("/dashboard/interview/" + interview?.mockId + "/feedback");
    }
  return (
    <div className='border p-3 rounded-lg shadow-sm'>
      <h2 className='font-bold text-primary'>{interview?.jobPosition} </h2>
      <h2 className='text-sm text-gray-600'>{interview?.jobExperience} Years of Experience</h2>
      <h2 className='text-sm text-gray-400'>Created At: {interview?.createdAt}</h2>
      <div className="flex justify-between mt-2 gap-2">
        <Button size="sm" variant="outline" className="flex-1"
        onClick={onFeedbackPress}>
            Feedback
        </Button>
       
        <Button size="sm" variant="outline" className="flex-1"
        onClick={onStart}>
            Start
        </Button>
      </div>

    </div>
  );
}

export default InterviewItemCard;
