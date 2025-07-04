import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import Webcam from "react-webcam";

function RecordAnswerSection(){
    return (
        <div>
            <div className="flex flex-col my-20 justify-center items-center rounded-lg p-5">
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

            <Button variant="outline">Record Answer</Button>
        </div>
    );
}
export default RecordAnswerSection;