"use client";
import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Target, Clock, TrendingUp, Play, Bookmark, ChevronRight, Brain, Code, Briefcase, Users, Database, Lightbulb, Star, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

function QuestionsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const router = useRouter();

    // Sample question data - In real app, this would come from your database
    const questionCategories = [
        { id: 'all', name: 'All Questions', icon: BookOpen, count: 156 },
        { id: 'technical', name: 'Technical', icon: Code, count: 45 },
        { id: 'behavioral', name: 'Behavioral', icon: Users, count: 38 },
        { id: 'situational', name: 'Situational', icon: Target, count: 32 },
        { id: 'database', name: 'Database', icon: Database, count: 25 },
        { id: 'leadership', name: 'Leadership', icon: TrendingUp, count: 16 }
    ];

    const popularQuestions = [
        {
            id: 1,
            question: "Tell me about yourself and your experience in software development.",
            category: "behavioral",
            difficulty: "easy",
            timeLimit: "2-3 minutes",
            tags: ["introduction", "experience"],
            popularity: 95,
            isBookmarked: false
        },
        {
            id: 2,
            question: "Explain the difference between React's useState and useEffect hooks.",
            category: "technical",
            difficulty: "medium",
            timeLimit: "3-4 minutes",
            tags: ["react", "hooks", "javascript"],
            popularity: 87,
            isBookmarked: true
        },
        {
            id: 3,
            question: "How would you handle a situation where you disagree with your manager's technical decision?",
            category: "situational",
            difficulty: "hard",
            timeLimit: "4-5 minutes",
            tags: ["conflict", "communication", "leadership"],
            popularity: 78,
            isBookmarked: false
        },
        {
            id: 4,
            question: "Design a database schema for an e-commerce application.",
            category: "database",
            difficulty: "hard",
            timeLimit: "8-10 minutes",
            tags: ["database", "design", "sql"],
            popularity: 82,
            isBookmarked: false
        },
        {
            id: 5,
            question: "What are your greatest strengths and how do they apply to this role?",
            category: "behavioral",
            difficulty: "easy",
            timeLimit: "2-3 minutes",
            tags: ["strengths", "self-assessment"],
            popularity: 91,
            isBookmarked: true
        }
    ];

    const difficultyLevels = [
        { id: 'all', name: 'All Levels', color: 'text-muted-foreground' },
        { id: 'easy', name: 'Easy', color: 'text-green-600' },
        { id: 'medium', name: 'Medium', color: 'text-yellow-600' },
        { id: 'hard', name: 'Hard', color: 'text-red-600' }
    ];

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy': return 'text-green-600 bg-green-50 border-green-200';
            case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'hard': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-muted-foreground bg-muted border-muted';
        }
    };

    const filteredQuestions = popularQuestions.filter(question => {
        const matchesSearch = question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;
        const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
        
        return matchesSearch && matchesCategory && matchesDifficulty;
    });

    const handlePracticeQuestion = (questionId) => {
        // In a real app, you might create a quick practice session
        console.log('Starting practice for question:', questionId);
        // For now, redirect to create new interview
        router.push('/dashboard');
    };

    const toggleBookmark = (questionId) => {
        // In a real app, this would update the database
        console.log('Toggling bookmark for question:', questionId);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold">Question Bank</h1>
                </div>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Explore our comprehensive collection of interview questions, practice specific scenarios, and track your progress.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-card border rounded-lg p-6 text-center">
                    <div className="h-10 w-10 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg">156</h3>
                    <p className="text-muted-foreground text-sm">Total Questions</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                    <div className="h-10 w-10 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Target className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg">23</h3>
                    <p className="text-muted-foreground text-sm">Practiced Today</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                    <div className="h-10 w-10 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Star className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-lg">12</h3>
                    <p className="text-muted-foreground text-sm">Bookmarked</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                    <div className="h-10 w-10 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BarChart3 className="h-5 w-5 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-lg">78%</h3>
                    <p className="text-muted-foreground text-sm">Success Rate</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-card border rounded-xl p-6 space-y-6">
                <h2 className="text-xl font-semibold">Filter Questions</h2>
                
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search questions by topic, keywords, or tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-11"
                    />
                </div>

                {/* Category Filter */}
                <div>
                    <label className="text-sm font-medium mb-3 block">Category</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {questionCategories.map((category) => {
                            const IconComponent = category.icon;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`p-3 rounded-lg border text-left transition-all hover:shadow-sm ${
                                        selectedCategory === category.id
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-border hover:border-primary/50'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <IconComponent className="h-4 w-4" />
                                        <span className="font-medium text-sm">{category.name}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{category.count} questions</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Difficulty Filter */}
                <div>
                    <label className="text-sm font-medium mb-3 block">Difficulty Level</label>
                    <div className="flex flex-wrap gap-2">
                        {difficultyLevels.map((level) => (
                            <button
                                key={level.id}
                                onClick={() => setSelectedDifficulty(level.id)}
                                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                                    selectedDifficulty === level.id
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-border hover:border-primary/50'
                                }`}
                            >
                                {level.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        Questions ({filteredQuestions.length})
                    </h2>
                    <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        More Filters
                    </Button>
                </div>

                <div className="space-y-4">
                    {filteredQuestions.map((question) => (
                        <div key={question.id} className="bg-card border rounded-xl p-6 hover:shadow-sm transition-all">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-3">
                                    {/* Question Header */}
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg leading-relaxed mb-2">
                                                {question.question}
                                            </h3>
                                            
                                            {/* Meta Information */}
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <BookOpen className="h-3 w-3" />
                                                    <span className="capitalize">{question.category}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{question.timeLimit}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <TrendingUp className="h-3 w-3" />
                                                    <span>{question.popularity}% popular</span>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(question.difficulty)}`}>
                                                    {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2">
                                        {question.tags.map((tag, index) => (
                                            <span key={index} className="px-2 py-1 bg-muted rounded-md text-xs font-medium">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => handlePracticeQuestion(question.id)}
                                        className="w-32"
                                    >
                                        <Play className="h-4 w-4 mr-2" />
                                        Practice
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={question.isBookmarked ? "default" : "outline"}
                                        onClick={() => toggleBookmark(question.id)}
                                        className="w-32"
                                    >
                                        <Bookmark className={`h-4 w-4 mr-2 ${question.isBookmarked ? 'fill-current' : ''}`} />
                                        {question.isBookmarked ? 'Saved' : 'Save'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredQuestions.length === 0 && (
                    <div className="text-center py-12 bg-muted/50 rounded-xl border-2 border-dashed border-muted-foreground/20">
                        <div className="space-y-4">
                            <div className="h-16 w-16 bg-muted-foreground/10 rounded-full flex items-center justify-center mx-auto">
                                <Search className="h-8 w-8 text-muted-foreground/60" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-muted-foreground">No questions found</h3>
                                <p className="text-muted-foreground/80">
                                    Try adjusting your search criteria or browse different categories.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 border rounded-xl p-6">
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <Lightbulb className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold">Ready for a Full Interview?</h3>
                    </div>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Create a complete mock interview session with multiple questions tailored to your job role.
                    </p>
                    <Button onClick={() => router.push('/dashboard')} size="lg">
                        <Brain className="h-4 w-4 mr-2" />
                        Create Mock Interview
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default QuestionsPage;
