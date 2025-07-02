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



const AddNewInterview = () => {
    const [openDialog, setOpenDialog] = React.useState(false);
    const [jobPosition, setJobPosition] = React.useState();
    const [jobDesc, setJobDesc] = React.useState();
    const [jobExperience, setJobExperience] = React.useState();
    const onSubmit = (e) => {
        e.preventDefault();
        console.log(jobPosition, jobDesc, jobExperience);
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
                            <Button type="submit">Start Interview</Button>
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
