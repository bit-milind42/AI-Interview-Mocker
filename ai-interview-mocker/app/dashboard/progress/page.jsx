"use client";
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/db';
import { MockInterview, UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { 
    TrendingUp, 
    Award, 
    Target, 
    Calendar, 
    BarChart3, 
    Briefcase,
    Code,
    ArrowUp,
    ArrowDown,
    Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  extractTechStack, 
  calculateOverallTrend, 
  groupByJobRole, 
  groupByTechStack 
} from '@/utils/progressUtils';

function ProgressPage() {
    const { user } = useUser();
    const [detailedProgress, setDetailedProgress] = useState({
        jobRoles: [],
        techStacks: [],
        monthlyProgress: [],
        skillBreakdown: [],
        overallStats: {
            totalInterviews: 0,
            averageRating: 0,
            improvementTrend: 0,
            bestPerformingRole: '',
            weakestArea: '',
            totalQuestions: 0
        }
    });
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('all'); // all, 3months, 6months, 1year

    useEffect(() => {
        if (user) {
            fetchDetailedProgress();
        }
    }, [user, timeRange]);

    const fetchDetailedProgress = async () => {
        try {
            setLoading(true);
            
            // Get all user interviews
            const interviews = await db.select()
                .from(MockInterview)
                .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress));

            // Get all user answers
            const answers = await db.select()
                .from(UserAnswer)
                .where(eq(UserAnswer.userEmail, user?.primaryEmailAddress?.emailAddress));

            // Filter by time range if needed
            const filteredData = filterByTimeRange(interviews, answers, timeRange);
            
            const processedData = processDetailedData(filteredData.interviews, filteredData.answers);
            setDetailedProgress(processedData);
            
        } catch (error) {
            console.error('Error fetching detailed progress:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterByTimeRange = (interviews, answers, range) => {
        if (range === 'all') return { interviews, answers };
        
        const cutoffDate = new Date();
        switch (range) {
            case '3months':
                cutoffDate.setMonth(cutoffDate.getMonth() - 3);
                break;
            case '6months':
                cutoffDate.setMonth(cutoffDate.getMonth() - 6);
                break;
            case '1year':
                cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
                break;
        }
        
        const filteredInterviews = interviews.filter(i => 
            new Date(i.createdAt) >= cutoffDate
        );
        const filteredAnswers = answers.filter(a => 
            filteredInterviews.some(i => i.mockId === a.mockIdRef)
        );
        
        return { interviews: filteredInterviews, answers: filteredAnswers };
    };

    const processDetailedData = (interviews, answers) => {
        // Process job roles with detailed stats
        const jobRoleStats = {};
        const techStackStats = {};
        const monthlyStats = {};
        
        interviews.forEach(interview => {
            const role = interview.jobPosition;
            const month = new Date(interview.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short' 
            });
            
            // Job role stats
            if (!jobRoleStats[role]) {
                jobRoleStats[role] = {
                    role,
                    count: 0,
                    totalRating: 0,
                    ratedAnswers: 0,
                    questions: 0,
                    averageRating: 0,
                    trend: 0,
                    interviews: []
                };
            }
            jobRoleStats[role].count++;
            jobRoleStats[role].interviews.push(interview);
            
            // Monthly stats
            if (!monthlyStats[month]) {
                monthlyStats[month] = { month, count: 0, totalRating: 0, ratedAnswers: 0 };
            }
            monthlyStats[month].count++;
            
            // Extract tech stack
            const techStack = extractTechStack(interview.jobDesc);
            techStack.forEach(tech => {
                if (!techStackStats[tech]) {
                    techStackStats[tech] = {
                        tech,
                        count: 0,
                        totalRating: 0,
                        ratedAnswers: 0,
                        averageRating: 0
                    };
                }
                techStackStats[tech].count++;
            });
        });

        // Process answers and calculate ratings
        answers.forEach(answer => {
            const rating = parseFloat(answer.rating);
            if (!isNaN(rating)) {
                const interview = interviews.find(i => i.mockId === answer.mockIdRef);
                if (interview) {
                    const role = interview.jobPosition;
                    const month = new Date(interview.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short' 
                    });
                    
                    // Update job role stats
                    if (jobRoleStats[role]) {
                        jobRoleStats[role].totalRating += rating;
                        jobRoleStats[role].ratedAnswers++;
                        jobRoleStats[role].questions++;
                    }
                    
                    // Update monthly stats
                    if (monthlyStats[month]) {
                        monthlyStats[month].totalRating += rating;
                        monthlyStats[month].ratedAnswers++;
                    }
                    
                    // Update tech stack stats
                    const techStack = extractTechStack(interview.jobDesc);
                    techStack.forEach(tech => {
                        if (techStackStats[tech]) {
                            techStackStats[tech].totalRating += rating;
                            techStackStats[tech].ratedAnswers++;
                        }
                    });
                }
            }
        });

        // Calculate averages and trends
        const processedJobRoles = Object.values(jobRoleStats).map(role => ({
            ...role,
            averageRating: role.ratedAnswers > 0 ? (role.totalRating / role.ratedAnswers) : 0,
            trend: calculateRoleTrend(role.interviews, answers)
        })).sort((a, b) => b.count - a.count);

        const processedTechStack = Object.values(techStackStats).map(tech => ({
            ...tech,
            averageRating: tech.ratedAnswers > 0 ? (tech.totalRating / tech.ratedAnswers) : 0
        })).sort((a, b) => b.averageRating - a.averageRating);

        const processedMonthly = Object.values(monthlyStats).map(month => ({
            ...month,
            averageRating: month.ratedAnswers > 0 ? (month.totalRating / month.ratedAnswers) : 0
        })).sort((a, b) => new Date(a.month) - new Date(b.month));

        // Calculate overall stats
        const totalRating = answers.reduce((sum, answer) => {
            const rating = parseFloat(answer.rating);
            return sum + (isNaN(rating) ? 0 : rating);
        }, 0);

        const averageRating = answers.length > 0 ? totalRating / answers.length : 0;
        const bestRole = processedJobRoles.length > 0 ? 
            processedJobRoles.reduce((best, current) => 
                current.averageRating > best.averageRating ? current : best
            ) : null;
        const weakestTech = processedTechStack.length > 0 ?
            processedTechStack.reduce((weak, current) =>
                current.averageRating < weak.averageRating ? current : weak
            ) : null;

        return {
            jobRoles: processedJobRoles,
            techStacks: processedTechStack,
            monthlyProgress: processedMonthly,
            overallStats: {
                totalInterviews: interviews.length,
                averageRating: averageRating,
                improvementTrend: calculateOverallTrend(processedMonthly),
                bestPerformingRole: bestRole?.role || 'N/A',
                weakestArea: weakestTech?.tech || 'N/A',
                totalQuestions: answers.length
            }
        };
    };

    const extractTechStack = (jobDesc) => {
        if (!jobDesc) return ['General'];
        
        const commonTech = [
            'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'TypeScript',
            'Angular', 'Vue.js', 'PHP', 'C++', 'C#', 'Go', 'Rust', 'Swift',
            'Kotlin', 'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
            'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'Jenkins',
            'HTML', 'CSS', 'Sass', 'Bootstrap', 'Tailwind', 'Express.js',
            'Django', 'Flask', 'Spring', 'Laravel', 'Ruby on Rails'
        ];
        
        const found = [];
        const lowerDesc = jobDesc.toLowerCase();
        
        commonTech.forEach(tech => {
            if (lowerDesc.includes(tech.toLowerCase()) || 
                lowerDesc.includes(tech.toLowerCase().replace('.', ''))) {
                found.push(tech);
            }
        });
        
        return found.length > 0 ? found : ['General'];
    };

    const calculateRoleTrend = (interviews, allAnswers) => {
        if (interviews.length < 2) return 0;
        
        const sortedInterviews = interviews
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            
        const firstHalf = sortedInterviews.slice(0, Math.floor(sortedInterviews.length / 2));
        const secondHalf = sortedInterviews.slice(Math.floor(sortedInterviews.length / 2));
        
        const getAverageRating = (interviewList) => {
            const ratings = interviewList.flatMap(interview => 
                allAnswers
                    .filter(a => a.mockIdRef === interview.mockId)
                    .map(a => parseFloat(a.rating))
                    .filter(r => !isNaN(r))
            );
            return ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0;
        };
        
        const firstAvg = getAverageRating(firstHalf);
        const secondAvg = getAverageRating(secondHalf);
        
        if (firstAvg === 0) return 0;
        return ((secondAvg - firstAvg) / firstAvg * 100);
    };

    const calculateOverallTrend = (monthlyData) => {
        if (monthlyData.length < 2) return 0;
        
        const firstMonth = monthlyData[0];
        const lastMonth = monthlyData[monthlyData.length - 1];
        
        if (firstMonth.averageRating === 0) return 0;
        return ((lastMonth.averageRating - firstMonth.averageRating) / firstMonth.averageRating * 100);
    };

    const getTrendIcon = (trend) => {
        if (trend > 5) return <ArrowUp className="h-4 w-4 text-green-500" />;
        if (trend < -5) return <ArrowDown className="h-4 w-4 text-red-500" />;
        return <Minus className="h-4 w-4 text-gray-500" />;
    };

    const getTrendColor = (trend) => {
        if (trend > 5) return 'text-green-600';
        if (trend < -5) return 'text-red-600';
        return 'text-gray-600';
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <div className="container mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <TrendingUp className="h-8 w-8 text-primary" />
                        Progress Analytics
                    </h1>
                    <p className="text-muted-foreground">Track your interview progress across job roles and tech stacks</p>
                </div>
                
                <div className="flex gap-2">
                    <select 
                        value={timeRange} 
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-3 py-2 border rounded-md"
                    >
                        <option value="all">All Time</option>
                        <option value="3months">Last 3 Months</option>
                        <option value="6months">Last 6 Months</option>
                        <option value="1year">Last Year</option>
                    </select>
                </div>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-card border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Interviews</p>
                            <p className="text-2xl font-bold">{detailedProgress.overallStats.totalInterviews}</p>
                        </div>
                        <Target className="h-8 w-8 text-blue-500" />
                    </div>
                </div>
                
                <div className="bg-card border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Average Rating</p>
                            <p className="text-2xl font-bold">{detailedProgress.overallStats.averageRating.toFixed(1)}</p>
                        </div>
                        <Award className="h-8 w-8 text-yellow-500" />
                    </div>
                </div>
                
                <div className="bg-card border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Questions</p>
                            <p className="text-2xl font-bold">{detailedProgress.overallStats.totalQuestions}</p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-purple-500" />
                    </div>
                </div>
                
                <div className="bg-card border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Best Role</p>
                            <p className="text-lg font-bold truncate">{detailedProgress.overallStats.bestPerformingRole}</p>
                        </div>
                        <Briefcase className="h-8 w-8 text-green-500" />
                    </div>
                </div>
                
                <div className="bg-card border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Improvement</p>
                            <p className={`text-2xl font-bold ${getTrendColor(detailedProgress.overallStats.improvementTrend)}`}>
                                {detailedProgress.overallStats.improvementTrend >= 0 ? '+' : ''}{detailedProgress.overallStats.improvementTrend.toFixed(1)}%
                            </p>
                        </div>
                        <TrendingUp className={`h-8 w-8 ${
                            detailedProgress.overallStats.improvementTrend >= 0 ? 'text-green-500' : 'text-red-500'
                        }`} />
                    </div>
                </div>
            </div>

            {/* Job Roles Detailed Analysis */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Performance by Job Role</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {detailedProgress.jobRoles.slice(0, 6).map((role, index) => (
                        <div key={index} className="bg-card border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold truncate">{role.role}</h3>
                                {getTrendIcon(role.trend)}
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Interviews:</span>
                                    <span className="font-medium">{role.count}</span>
                                </div>
                                
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Questions:</span>
                                    <span className="font-medium">{role.questions}</span>
                                </div>
                                
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Avg Rating:</span>
                                    <span className="font-medium">{role.averageRating.toFixed(1)}/10</span>
                                </div>
                                
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Trend:</span>
                                    <span className={`font-medium ${getTrendColor(role.trend)}`}>
                                        {role.trend >= 0 ? '+' : ''}{role.trend.toFixed(1)}%
                                    </span>
                                </div>
                                
                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-primary h-2 rounded-full" 
                                        style={{ width: `${(role.averageRating / 10) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tech Stack Performance */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Technology Stack Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {detailedProgress.techStacks.slice(0, 12).map((tech, index) => (
                        <div key={index} className="bg-card border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Code className="h-5 w-5 text-primary" />
                                <h4 className="font-semibold text-sm truncate">{tech.tech}</h4>
                            </div>
                            
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Used in:</span>
                                    <span className="font-medium">{tech.count} interviews</span>
                                </div>
                                
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Avg Score:</span>
                                    <span className="font-medium">{tech.averageRating.toFixed(1)}/10</span>
                                </div>
                                
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div 
                                        className={`h-1.5 rounded-full ${
                                            tech.averageRating >= 8 ? 'bg-green-500' :
                                            tech.averageRating >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                        style={{ width: `${(tech.averageRating / 10) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Monthly Progress Chart */}
            {detailedProgress.monthlyProgress.length > 1 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Monthly Progress Trend</h2>
                    <div className="bg-card border rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {detailedProgress.monthlyProgress.map((month, index) => (
                                <div key={index} className="text-center p-4 bg-muted rounded-lg">
                                    <p className="text-sm font-medium text-muted-foreground mb-1">{month.month}</p>
                                    <p className="text-2xl font-bold">{month.averageRating.toFixed(1)}</p>
                                    <p className="text-xs text-muted-foreground">{month.count} interviews</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {detailedProgress.overallStats.totalInterviews === 0 && (
                <div className="text-center py-12 bg-muted/50 rounded-xl">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Data Available</h3>
                    <p className="text-muted-foreground mb-4">
                        Complete some interviews to see your detailed progress analytics.
                    </p>
                    <Link href="/dashboard">
                        <Button>Start Your First Interview</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default ProgressPage;
