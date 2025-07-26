"use client";
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, Plus, Briefcase, Clock, FileText } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import { MockInterview } from '@/utils/schema';
import { db } from '@/utils/db';
import { chatSession } from '@/utils/GeminiAIModel';
import { useRouter } from 'next/navigation';

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobExperience, setJobExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const router = useRouter();
  const { user } = useUser();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobPosition, jobDesc, jobExperience);
// guardril
// purpose
    const InputPrompt = `Job position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}, Depends on Job Position, Job Description & Years of Experience give us ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} Interview question along with Answer in JSON format, Give us question and answer field on JSON`;

    try {
      const result = await chatSession.sendMessage(InputPrompt);
      const responseText = await result.response.text();
      const MockJsonResp = responseText.replace('```json', '').replace('```', '');
      console.log(JSON.parse(MockJsonResp));
      setJsonResponse(MockJsonResp);

      if (MockJsonResp) {
        const resp = await db.insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResp: MockJsonResp,
            jobPosition: jobPosition,
            jobDesc: jobDesc,
            jobExperience: jobExperience,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: new Date().toISOString(),
          }).returning({ mockId: MockInterview.mockId });

        console.log("Inserted ID:", resp);
        if (resp) {
          setOpenDialog(false);
          router.push('/dashboard/interview/' + resp[0]?.mockId);
        }
      } else {
        console.log("ERROR");
      }
    } catch (error) {
      console.error('Error creating interview:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div 
        className='group relative p-8 bg-gradient-to-br from-primary/5 to-blue-500/5 border-2 border-dashed border-primary/30 rounded-2xl cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]'
        onClick={() => setOpenDialog(true)}
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Plus className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className='font-bold text-xl text-foreground mb-2'>Add New Interview</h2>
            <p className='text-muted-foreground text-sm max-w-sm'>
              Create a new mock interview session tailored to your job position and experience level
            </p>
          </div>
        </div>
        
        {/* Subtle background decoration */}
        <div className="absolute top-4 right-4 opacity-10">
          <Briefcase className="h-8 w-8 text-primary" />
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              Create New Mock Interview
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Fill in the details below to generate personalized interview questions powered by AI
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Job Position */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Job Role/Job Position
                </label>
                <Input
                  placeholder="Ex. Full Stack Developer, Data Scientist, Product Manager"
                  required
                  value={jobPosition}
                  onChange={(event) => setJobPosition(event.target.value)}
                  className="h-12"
                />
              </div>

              {/* Job Description */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Job Description/Tech Stack
                </label>
                <Textarea
                  placeholder="Ex. React, Angular, NodeJs, MySql etc"
                  required
                  value={jobDesc}
                  onChange={(event) => setJobDesc(event.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Years of Experience */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Years of Experience
                </label>
                <Input
                  placeholder="Ex. 5"
                  type="number"
                  max="100"
                  required
                  value={jobExperience}
                  onChange={(event) => setJobExperience(event.target.value)}
                  className="h-12"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpenDialog(false)}
                className="flex-1 h-12"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1 h-12"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin h-4 w-4 mr-2" />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Start Interview
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
