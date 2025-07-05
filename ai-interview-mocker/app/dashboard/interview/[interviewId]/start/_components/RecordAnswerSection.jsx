"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Mic, StopCircle, User } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import Webcam from "react-webcam";
import { toast } from "sonner";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import moment from "moment";


function RecordAnswerSection({ mockInterviewQuestions, activeQuestionIndex, interviewData }) {
    const [userAnswer, setUserAnswer] = React.useState("");
    const {user} = useUser()
    const [loading, setLoading] = React.useState(false);
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
  });

  useEffect(() => {
    results.map((result) => (
        setUserAnswer(prevAns => prevAns + result?.transcript)
    ));
  }, [results]);

  useEffect(()=>{
    if(!isRecording && userAnswer.length>10){
        UpdatingUserAnswer()
    }
   
    //   }
  },[userAnswer])

  const StartStopRecording=async()=>{
    if(isRecording){
        
      stopSpeechToText()
    
    }
    else{
        startSpeechToText();
    }
  }
  const UpdatingUserAnswer=async()=>{
    try {
        console.log(userAnswer)
        setLoading(true);
        const feedbackPrompt = "Question:" + mockInterviewQuestions[activeQuestionIndex]?.question + "\n" +
          ", User Answer:" + userAnswer +', Depends on question and user answer for give interview question '+ "\n" +
          "please give us rating for answer on a scale of 1 to 5 (where 1 is poor and 5 is excellent), and feedback as area of improvement if any" + 
          "in just 3 to 5 lines to improve it in JSON format with rating field (number from 1-5) and feedback field" ;

        // Initialize Google Generative AI
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(feedbackPrompt);
        const response = await result.response;
        const text = response.text();
        const mockJsonResp = text.replace('```json', '').replace('```', '');
        console.log(mockJsonResp);

        const JsonFeedbackResp = JSON.parse(mockJsonResp)

        try {
          const resp=await db.insert(UserAnswer)
          .values({
              mockIdRef: interviewData?.mockId,
              question:mockInterviewQuestions[activeQuestionIndex]?.question,
              correctAns: mockInterviewQuestions[activeQuestionIndex]?.answer,
              userAns:userAnswer,
              feedback:JsonFeedbackResp?.feedback,
              rating: JsonFeedbackResp?.rating,
              userEmail:user?.primaryEmailAddress?.emailAddress,
              createdAt:moment().format('DD-MM-yyyy')
          })

          if(resp){
            toast('Answer recorded successfully!');
            setUserAnswer(''); 
            setResults([]); 
          }
        } catch (dbError) {
          console.error('Database error:', dbError);
          toast('Answer feedback generated but failed to save to database');
          // Still show the feedback even if DB save fails
          console.log('Generated feedback:', JsonFeedbackResp);
        }
        setResults([]); 
        setLoading(false);
        
    } catch (error) {
        console.error('Error updating user answer:', error);
        toast('Failed to process answer. Please try again.');
        setLoading(false);
    }
  }

    return (
        <div className="flex items-center justify-center flex-col">
            <div className="flex flex-col mt-20 justify-center items-center rounded-lg p-5">
                <Image src={'/download.png'} width={150} height={150} alt="user-avatar"
                className="absolute"
                />
                
                <Webcam
                mirrored={true}
                style={{
                    height: 300,
                    width: '100%',
                    zIndex:10,
                    
                }}
                />
            </div>

            <Button 
            disabled={loading}
            variant="outline" className="mt-10" onClick={StartStopRecording}>
            { isRecording ? 
            <h2 className="text-red-600 animate-pulse flex gap-2 items-center">
                <StopCircle/> Stop Recording
            </h2>
            :
            <h2 className="text-primary flex gap-2 items-center">
            <Mic/> Record Answer
            </h2>}
            </Button>


        </div>
    );
}
export default RecordAnswerSection;