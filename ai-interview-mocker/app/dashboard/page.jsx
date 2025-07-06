import { UserButton } from "@clerk/nextjs";
import React from "react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";
import { Plus, Zap } from "lucide-react";

function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">Welcome to AI Interview Mocker</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Create and manage your AI-powered mock interviews. Practice makes perfect!
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border rounded-lg p-6 text-center">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">Ready to Start</h3>
          <p className="text-muted-foreground text-sm">Create your first mock interview</p>
        </div>
        <div className="bg-card border rounded-lg p-6 text-center">
          <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-6 w-6 text-green-500" />
          </div>
          <h3 className="font-semibold text-lg">New Interview</h3>
          <p className="text-muted-foreground text-sm">Click below to get started</p>
        </div>
        <div className="bg-card border rounded-lg p-6 text-center">
          <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="h-6 w-6 bg-blue-500 rounded-full"></div>
          </div>
          <h3 className="font-semibold text-lg">Track Progress</h3>
          <p className="text-muted-foreground text-sm">Monitor your improvement</p>
        </div>
      </div>

      {/* Add New Interview Section */}
      <div className="bg-muted/50 rounded-lg p-8">
        <div className="text-center space-y-4 mb-6">
          <h2 className="text-2xl font-bold">Create New Mock Interview</h2>
          <p className="text-muted-foreground">
            Get started with personalized interview questions based on your job role and experience.
          </p>
        </div>
        <div className="flex justify-center">
          <AddNewInterview/>
        </div>
      </div>

      {/* Interview List */}
      <InterviewList/>
    </div>
  );
}

export default Dashboard;
