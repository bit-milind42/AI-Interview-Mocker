"use client";
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/db';
import { MockInterview, UserAnswer } from '@/utils/schema';
import { eq, sql } from 'drizzle-orm';
import { TrendingUp, Award, Target, Calendar, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  extractTechStack, 
  calculateOverallTrend, 
  groupByJobRole
} from '@/utils/progressUtils';

function ProgressTracker() {
  const { user } = useUser();
  const [progressData, setProgressData] = useState({
    byJobRole: [],
    overallStats: {
      totalInterviews: 0,
      averageRating: 0,
      improvementTrend: 0,
      completedThisMonth: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProgressData();
    }
  }, [user]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      
      // Get all user interviews with their answers
      const interviews = await db.select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress));

      // Get all user answers
      const answers = await db.select()
        .from(UserAnswer)
        .where(eq(UserAnswer.userEmail, user?.primaryEmailAddress?.emailAddress));

      // Process data for progress tracking
      const processedData = await processProgressData(interviews, answers);
      setProgressData(processedData);
      
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processProgressData = async (interviews, answers) => {
    // Use utility functions for processing
    const jobRoleProgress = groupByJobRole(interviews, answers);

    // Calculate overall stats
    const totalRating = answers.reduce((sum, answer) => {
      const rating = parseFloat(answer.rating);
      return sum + (isNaN(rating) ? 0 : rating);
    }, 0);

    const averageRating = answers.length > 0 ? totalRating / answers.length : 0;
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const completedThisMonth = interviews.filter(i => 
      new Date(i.createdAt) >= thisMonth
    ).length;

    const improvementTrend = calculateOverallTrend(answers);

    return {
      byJobRole: jobRoleProgress.slice(0, 6), // Show top 6 job roles
      overallStats: {
        totalInterviews: interviews.length,
        averageRating: averageRating.toFixed(1),
        improvementTrend: improvementTrend.toFixed(1),
        completedThisMonth
      }
    };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card border rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overall Statistics */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Progress Overview
          </h2>
          <Link href="/dashboard/progress">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              View Detailed Analytics
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Interviews</p>
                <p className="text-2xl font-bold">{progressData.overallStats.totalInterviews}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold">{progressData.overallStats.averageRating}</p>
              </div>
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Improvement</p>
                <p className={`text-2xl font-bold ${
                  progressData.overallStats.improvementTrend >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {progressData.overallStats.improvementTrend >= 0 ? '+' : ''}{progressData.overallStats.improvementTrend}%
                </p>
              </div>
              <TrendingUp className={`h-8 w-8 ${
                progressData.overallStats.improvementTrend >= 0 ? 'text-green-500' : 'text-red-500'
              }`} />
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">{progressData.overallStats.completedThisMonth}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress by Job Role */}
      {progressData.byJobRole.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4">Progress by Job Role</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {progressData.byJobRole.slice(0, 6).map((roleData, index) => (
              <div key={index} className="bg-card border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg truncate">{roleData.role}</h4>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Interviews:</span>
                    <span className="font-medium">{roleData.count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg Rating:</span>
                    <span className="font-medium">{roleData.averageRating}/10</span>
                  </div>
                  {roleData.progress && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress:</span>
                      <span className={`font-medium ${
                        roleData.progress >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {roleData.progress >= 0 ? '+' : ''}{roleData.progress}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {progressData.byJobRole.length === 0 && (
        <div className="text-center py-12 bg-muted/50 rounded-xl">
          <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Progress Data Yet</h3>
          <p className="text-muted-foreground">
            Complete some interviews to see your progress tracking data here.
          </p>
        </div>
      )}
    </div>
  );
}

export default ProgressTracker;
