"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    BookOpen, 
    Code2, 
    Users, 
    Eye, 
    EyeOff, 
    GraduationCap,
    Target,
    Lightbulb,
    Briefcase
} from 'lucide-react';

const staticQuestions = {
    hr: {
        title: "Most Asked HR Questions",
        icon: Users,
        description: "Common behavioral and situational questions asked in interviews",
        questions: [
            {
                id: 1,
                question: "Tell me about yourself.",
                category: "HR",
                difficulty: "Easy",
                answer: "This is your elevator pitch. Start with your current role, highlight relevant experience, mention key achievements, and connect it to why you're interested in this position. Keep it concise and professional."
            },
            {
                id: 2,
                question: "Why do you want to work here?",
                category: "HR",
                difficulty: "Easy",
                answer: "Research the company's mission, values, recent achievements, and culture. Explain how your goals align with theirs and what specific aspects of the role/company excite you."
            },
            {
                id: 3,
                question: "What are your strengths and weaknesses?",
                category: "HR",
                difficulty: "Medium",
                answer: "For strengths, choose relevant ones with examples. For weaknesses, mention a real weakness you're actively working to improve, and explain the steps you're taking."
            },
            {
                id: 4,
                question: "Where do you see yourself in 5 years?",
                category: "HR",
                difficulty: "Medium",
                answer: "Show ambition but be realistic. Align your goals with potential growth paths at the company. Focus on skills you want to develop and impact you want to make."
            },
            {
                id: 5,
                question: "Why are you leaving your current job?",
                category: "HR",
                difficulty: "Medium",
                answer: "Be honest but positive. Focus on seeking growth, new challenges, or better alignment with your career goals rather than criticizing your current employer."
            },
            {
                id: 6,
                question: "Describe a challenging situation and how you handled it.",
                category: "HR",
                difficulty: "Hard",
                answer: "Use the STAR method (Situation, Task, Action, Result). Choose a relevant professional challenge that showcases problem-solving, leadership, or technical skills."
            },
            {
                id: 7,
                question: "What motivates you?",
                category: "HR",
                difficulty: "Easy",
                answer: "Mention intrinsic motivators like learning, solving problems, making an impact, or working with great teams. Connect it to the role you're applying for."
            },
            {
                id: 8,
                question: "How do you handle stress and pressure?",
                category: "HR",
                difficulty: "Medium",
                answer: "Provide specific strategies you use (prioritization, time management, communication) and give an example of successfully managing a high-pressure situation."
            }
        ]
    },
    technical: {
        easy: {
            title: "Technical Questions - Easy",
            icon: GraduationCap,
            description: "Fundamental concepts and basic technical knowledge",
            questions: [
                {
                    id: 9,
                    question: "What is the difference between == and === in JavaScript?",
                    category: "Technical",
                    difficulty: "Easy",
                    answer: "== performs type coercion and compares values after converting them to the same type. === performs strict comparison without type coercion, comparing both value and type."
                },
                {
                    id: 10,
                    question: "Explain what HTML semantic elements are.",
                    category: "Technical",
                    difficulty: "Easy",
                    answer: "Semantic elements clearly describe their meaning to both the browser and developer. Examples include <header>, <nav>, <main>, <section>, <article>, <aside>, and <footer>. They improve accessibility and SEO."
                },
                {
                    id: 11,
                    question: "What is CSS Box Model?",
                    category: "Technical",
                    difficulty: "Easy",
                    answer: "The CSS Box Model describes how elements are rendered. From inside out: Content, Padding, Border, and Margin. Total width = content + padding + border + margin."
                },
                {
                    id: 12,
                    question: "What is the difference between var, let, and const?",
                    category: "Technical",
                    difficulty: "Easy",
                    answer: "var: function-scoped, can be redeclared, hoisted. let: block-scoped, cannot be redeclared, hoisted but not initialized. const: block-scoped, cannot be redeclared or reassigned, must be initialized."
                },
                {
                    id: 13,
                    question: "What is a REST API?",
                    category: "Technical",
                    difficulty: "Easy",
                    answer: "REST (Representational State Transfer) is an architectural style for web services. It uses HTTP methods (GET, POST, PUT, DELETE) and is stateless, cacheable, and uses standard HTTP status codes."
                }
            ]
        },
        medium: {
            title: "Technical Questions - Medium",
            icon: Target,
            description: "Intermediate concepts requiring deeper understanding",
            questions: [
                {
                    id: 14,
                    question: "Explain event bubbling and event capturing in JavaScript.",
                    category: "Technical",
                    difficulty: "Medium",
                    answer: "Event bubbling: events start from the target element and bubble up to parent elements. Event capturing: events start from the root and go down to the target. You can control this with addEventListener's third parameter."
                },
                {
                    id: 15,
                    question: "What are closures in JavaScript? Provide an example.",
                    category: "Technical",
                    difficulty: "Medium",
                    answer: "A closure is a function that has access to variables in its outer scope even after the outer function returns. Example: function outer() { let x = 10; return function inner() { console.log(x); }; }"
                },
                {
                    id: 16,
                    question: "Explain the difference between SQL and NoSQL databases.",
                    category: "Technical",
                    difficulty: "Medium",
                    answer: "SQL databases are relational, use structured schemas, ACID compliant, and use SQL. NoSQL databases are non-relational, flexible schemas, eventual consistency, and include document, key-value, column-family, and graph types."
                },
                {
                    id: 17,
                    question: "What are React Hooks and why were they introduced?",
                    category: "Technical",
                    difficulty: "Medium",
                    answer: "Hooks allow you to use state and other React features in functional components. They were introduced to avoid class component complexity, enable better code reuse, and provide a more intuitive API."
                },
                {
                    id: 18,
                    question: "Explain the concept of database indexing.",
                    category: "Technical",
                    difficulty: "Medium",
                    answer: "Database indexing creates a data structure that improves query performance by providing faster access paths to data. Like a book index, it allows the database to find rows without scanning the entire table."
                }
            ]
        },
        hard: {
            title: "Technical Questions - Hard",
            icon: Lightbulb,
            description: "Advanced concepts and system design challenges",
            questions: [
                {
                    id: 19,
                    question: "Design a system to handle millions of concurrent users.",
                    category: "Technical",
                    difficulty: "Hard",
                    answer: "Use load balancers, microservices architecture, database sharding, caching layers (Redis), CDNs, horizontal scaling, message queues, and implement proper monitoring and auto-scaling mechanisms."
                },
                {
                    id: 20,
                    question: "Implement a LRU (Least Recently Used) cache.",
                    category: "Technical",
                    difficulty: "Hard",
                    answer: "Use a combination of HashMap and Doubly Linked List. HashMap provides O(1) access, while DLL maintains order. Move accessed items to front, remove from tail when capacity exceeded."
                },
                {
                    id: 21,
                    question: "Explain database transactions and ACID properties.",
                    category: "Technical",
                    difficulty: "Hard",
                    answer: "ACID: Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent transactions don't interfere), Durability (committed changes persist). Transactions ensure data integrity in multi-step operations."
                },
                {
                    id: 22,
                    question: "How would you optimize a slow-performing web application?",
                    category: "Technical",
                    difficulty: "Hard",
                    answer: "Profile and identify bottlenecks, optimize database queries, implement caching, minimize HTTP requests, optimize images, use CDN, enable compression, lazy loading, code splitting, and optimize critical rendering path."
                },
                {
                    id: 23,
                    question: "Explain the CAP theorem and its implications.",
                    category: "Technical",
                    difficulty: "Hard",
                    answer: "CAP theorem states you can only guarantee 2 of 3: Consistency, Availability, Partition tolerance. In distributed systems during network partitions, you must choose between consistency and availability."
                }
            ]
        }
    }
};

export default function CompanyQuestionsPage() {
    const [selectedCategory, setSelectedCategory] = useState('hr');
    const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
    const [showAnswers, setShowAnswers] = useState({});

    const toggleAnswer = (questionId) => {
        setShowAnswers(prev => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
    };

    const getDifficultyVariant = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'easy': return 'default';
            case 'medium': return 'secondary';
            case 'hard': return 'destructive';
            default: return 'outline';
        }
    };

    const getCurrentQuestions = () => {
        if (selectedCategory === 'hr') {
            return staticQuestions.hr.questions;
        }
        return staticQuestions.technical[selectedDifficulty].questions;
    };

    const getCurrentData = () => {
        if (selectedCategory === 'hr') {
            return staticQuestions.hr;
        }
        return staticQuestions.technical[selectedDifficulty];
    };

    const currentData = getCurrentData();
    const IconComponent = currentData.icon;

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">Interview Questions Bank</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Master your interviews with our comprehensive collection of HR and technical questions
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border rounded-lg p-6 text-center">
                    <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="h-6 w-6 text-blue-500" />
                    </div>
                    <h3 className="font-semibold text-2xl">{staticQuestions.hr.questions.length}</h3>
                    <p className="text-muted-foreground text-sm">HR Questions</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                    <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Code2 className="h-6 w-6 text-green-500" />
                    </div>
                    <h3 className="font-semibold text-2xl">
                        {staticQuestions.technical.easy.questions.length + 
                         staticQuestions.technical.medium.questions.length + 
                         staticQuestions.technical.hard.questions.length}
                    </h3>
                    <p className="text-muted-foreground text-sm">Technical Questions</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                    <div className="h-12 w-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="h-6 w-6 text-purple-500" />
                    </div>
                    <h3 className="font-semibold text-2xl">{getCurrentQuestions().length}</h3>
                    <p className="text-muted-foreground text-sm">Current Selection</p>
                </div>
            </div>

            {/* Category Selection */}
            <div className="flex flex-wrap justify-center gap-4">
                <Button
                    variant={selectedCategory === 'hr' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('hr')}
                    className="flex items-center gap-2"
                    size="lg"
                >
                    <Users className="h-4 w-4" />
                    HR Questions
                </Button>
                <Button
                    variant={selectedCategory === 'technical' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('technical')}
                    className="flex items-center gap-2"
                    size="lg"
                >
                    <Code2 className="h-4 w-4" />
                    Technical Questions
                </Button>
            </div>

            {/* Difficulty Selection for Technical Questions */}
            {selectedCategory === 'technical' && (
                <div className="flex flex-wrap justify-center gap-3">
                    {['easy', 'medium', 'hard'].map((difficulty) => (
                        <Button
                            key={difficulty}
                            variant={selectedDifficulty === difficulty ? "default" : "outline"}
                            onClick={() => setSelectedDifficulty(difficulty)}
                            className="capitalize flex items-center gap-2"
                        >
                            <IconComponent className="h-4 w-4" />
                            {difficulty}
                        </Button>
                    ))}
                </div>
            )}

            {/* Section Header */}
            <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{currentData.title}</h2>
                        <p className="text-muted-foreground">{currentData.description}</p>
                    </div>
                </div>
            </div>

            {/* Questions Grid */}
            <div className="space-y-4">
                {getCurrentQuestions().map((question) => (
                    <div key={question.id} className="bg-card border rounded-lg p-6 border-l-4 border-l-primary">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold flex-1 pr-4">
                                {question.question}
                            </h3>
                            <Badge variant={getDifficultyVariant(question.difficulty)}>
                                {question.difficulty}
                            </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleAnswer(question.id)}
                                className="flex items-center gap-2"
                            >
                                {showAnswers[question.id] ? (
                                    <>
                                        <EyeOff className="h-4 w-4" />
                                        Hide Answer
                                    </>
                                ) : (
                                    <>
                                        <Eye className="h-4 w-4" />
                                        View Answer
                                    </>
                                )}
                            </Button>
                        </div>
                        
                        {showAnswers[question.id] && (
                            <div className="bg-muted/50 border-l-4 border-l-primary p-4 rounded-r-lg">
                                <h4 className="font-semibold mb-2">Answer:</h4>
                                <p className="text-muted-foreground leading-relaxed">{question.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
