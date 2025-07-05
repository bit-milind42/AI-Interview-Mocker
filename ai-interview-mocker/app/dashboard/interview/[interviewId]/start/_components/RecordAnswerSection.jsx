"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import Webcam from "react-webcam";


function RecordAnswerSection(){
    const [userAnswer, setUserAnswer] = React.useState("");
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
  });

  useEffect(() => {
    results.map((result) => (
        setUserAnswer(prevAns => prevAns + result?.transcript)
    ));
  }, [results]);
    return (
        <div className="flex items-center justify-center flex-col">
            <div className="flex flex-col mt-20 justify-center items-center rounded-lg p-5">
                <Image src={'/download.png'} width={150} height={150}
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

            <Button variant="outline" className="mt-10" onClick={isRecording? stopSpeechToText : startSpeechToText}>
            { isRecording ? 
            <h2 className="text-red-600 flex gap-2">
                <Mic/> 'Recording...'
            </h2>
            :'Record Answer'}
            </Button>

                <Button onClick={() => console.log(userAnswer)}>Show User Answer</Button>
        </div>
    );
}
export default RecordAnswerSection;