'use client';
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useRouter } from "next/navigation";



const AddNewInterview = () => {
    const [openDialog, setOpenDialog] = React.useState(false);
    const [jobPosition, setJobPosition] = React.useState('');
    const [jobDesc, setJobDesc] = React.useState('');
    const [jobExperience, setJobExperience] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const { user } = useUser();
    const router = useRouter();
   

    const onSubmit = async(e) => {
        setLoading(true);
        e.preventDefault();
        
        try {
            console.log(jobPosition, jobDesc, jobExperience);

            // Initialize Google Generative AI
            const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const inputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}. Based on this information, generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT || 5} interview questions with answers in JSON format. Each question should have 'question' and 'answer' fields.`;
            
            const result = await model.generateContent(inputPrompt);
            const response = await result.response;
            const text = response.text();
            
            const mockJsonResp = text.replace('```json', '').replace('```', '');
            console.log('Generated questions:', mockJsonResp);

            // Save to database via API route
            const dbResponse = await fetch('/api/interviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mockJsonResponse: mockJsonResp,
                    jobPosition: jobPosition,
                    jobDesc: jobDesc,
                    jobExperience: jobExperience,
                    createdBy: user?.primaryEmailAddress?.emailAddress,
                }),
            });

            // Check if the response is ok before trying to parse JSON
            if (!dbResponse.ok) {
                throw new Error(`HTTP error! status: ${dbResponse.status}`);
            }

            const dbResult = await dbResponse.json();
            
            if (dbResult.success) {
                console.log("Interview created with ID:", dbResult.mockId);
                setOpenDialog(false);
                router.push(`/dashboard/interview/${dbResult.mockId}`);
            } else {
                console.error("Error saving interview:", dbResult.error);
            }
        } catch (error) {
            console.error("Error creating interview:", error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <div className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
            onClick={() => setOpenDialog(true)}>
                <h2 className="text-lg text-center">+ Add New</h2>
            </div>
            <Dialog open={openDialog} >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                    <DialogTitle className=" text-2xl">Tell us more about your job interview.</DialogTitle>
                    <DialogDescription>
                        <form onSubmit={onSubmit} >
                        <div>
                            <h2>
                                Please add details about your job position or role, job description, and years of experience.
                            </h2>
                            <div className="mt-7 my-2">
                                <label>Job Role/Job Position</label>
                                <Input placeholder="Ex. Full Stack Developer" required
                                value={jobPosition}
                                onChange={(e) => setJobPosition(e.target.value)}
                                />
                            </div>
                            <div className="my-2">
                                <label>Job Description/ Tech Stack (In Short)</label>
                                <Input placeholder="Ex. React, Node.js, Express" required
                                value={jobDesc}
                                onChange={(e) => setJobDesc(e.target.value)}
                             />
                            </div>
                            
                            <div className="my-2">
                                <label>Years of Experience</label>
                                <Input placeholder="Ex. 5" max="50" required
                                value={jobExperience}
                                onChange={(e) => setJobExperience(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-5">
                            <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                            <Button type="submit" disabled={loading}>{loading ?<><LoaderCircle className="animate-spin" />"Starting Interview..." </>: "Start Interview"}</Button>
                        </div>
                        </form>
                    </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddNewInterview;
