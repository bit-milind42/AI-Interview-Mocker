"use client";
import React from 'react';
import { CheckCircle, ArrowRight, Play, Target, Brain, Users, BarChart3, Clock, Lightbulb, Star, MessageSquare, Camera, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function HowItWorksPage() {
    const router = useRouter();

    const steps = [
        {
            number: 1,
            title: "Create Your Profile",
            description: "Set up your interview profile with job position, experience level, and technical skills.",
            icon: Users,
            color: "bg-blue-500",
            details: [
                "Choose your target job role",
                "Specify years of experience", 
                "Add relevant tech stack and skills",
                "Customize interview preferences"
            ]
        },
        {
            number: 2,
            title: "AI Generates Questions",
            description: "Our advanced AI creates personalized interview questions based on your profile and industry standards.",
            icon: Brain,
            color: "bg-purple-500",
            details: [
                "Personalized questions for your role",
                "Industry-specific scenarios",
                "Difficulty matched to experience",
                "Mix of technical and behavioral questions"
            ]
        },
        {
            number: 3,
            title: "Practice Interview",
            description: "Participate in a realistic mock interview session with camera and microphone recording.",
            icon: Camera,
            color: "bg-green-500",
            details: [
                "Real-time video recording",
                "Timed question responses",
                "Natural conversation flow",
                "Professional interview environment"
            ]
        },
        {
            number: 4,
            title: "Get AI Feedback",
            description: "Receive detailed analysis and improvement suggestions powered by artificial intelligence.",
            icon: BarChart3,
            color: "bg-orange-500",
            details: [
                "Detailed performance analysis",
                "Areas for improvement",
                "Suggested better responses",
                "Progress tracking over time"
            ]
        }
    ];

    const features = [
        {
            title: "AI-Powered Questions",
            description: "Get industry-specific questions tailored to your job role and experience level",
            icon: Brain,
            benefits: ["Personalized content", "Industry standards", "Real interview scenarios"]
        },
        {
            title: "Real-time Recording",
            description: "Practice with actual video recording to simulate real interview conditions",
            icon: Camera,
            benefits: ["Video analysis", "Body language tips", "Confidence building"]
        },
        {
            title: "Instant Feedback",
            description: "Receive detailed feedback on your answers with actionable improvement suggestions",
            icon: MessageSquare,
            benefits: ["Performance metrics", "Improvement areas", "Better responses"]
        },
        {
            title: "Progress Tracking",
            description: "Monitor your improvement over time with detailed analytics and scoring",
            icon: Target,
            benefits: ["Performance trends", "Skill development", "Success metrics"]
        }
    ];

    const faqs = [
        {
            question: "How accurate are the AI-generated questions?",
            answer: "Our AI uses real interview data and industry standards to generate questions that closely match what you'd encounter in actual interviews for your specific role and experience level."
        },
        {
            question: "Can I practice multiple times?",
            answer: "Yes! You can create unlimited mock interviews and practice as many times as you want. Each session generates new questions to keep your practice fresh."
        },
        {
            question: "Is my data secure?",
            answer: "Absolutely. All your interview recordings and personal data are encrypted and stored securely. We follow industry best practices for data protection."
        },
        {
            question: "How long does each interview take?",
            answer: "Interview duration varies based on the number of questions (typically 5-10 questions), but most sessions take between 15-30 minutes to complete."
        }
    ];

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold">How It Works</h1>
                </div>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Master your interview skills with our AI-powered platform in just four simple steps.
                </p>
            </div>

            {/* Steps */}
            <div className="space-y-8">
                {steps.map((step, index) => {
                    const IconComponent = step.icon;
                    const isEven = index % 2 === 1;
                    
                    return (
                        <div key={step.number} className={`flex flex-col lg:flex-row items-center gap-8 ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                            {/* Content */}
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 ${step.color} text-white rounded-full flex items-center justify-center text-xl font-bold`}>
                                        {step.number}
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold">{step.title}</h2>
                                </div>
                                
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {step.description}
                                </p>
                                
                                <div className="space-y-2">
                                    {step.details.map((detail, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            <span className="text-muted-foreground">{detail}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Icon/Visual */}
                            <div className="flex-1 flex justify-center">
                                <div className="w-64 h-64 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-2xl flex items-center justify-center border-2 border-dashed border-primary/20">
                                    <div className={`w-24 h-24 ${step.color} rounded-full flex items-center justify-center`}>
                                        <IconComponent className="h-12 w-12 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Features Section */}
            <div className="bg-muted/50 rounded-2xl p-8 space-y-8">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl md:text-3xl font-bold">Key Features</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Everything you need to ace your next interview, powered by advanced AI technology.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                            <div key={index} className="bg-card border rounded-xl p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <IconComponent className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                                </div>
                                
                                <p className="text-muted-foreground">{feature.description}</p>
                                
                                <div className="space-y-1">
                                    {feature.benefits.map((benefit, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-muted-foreground">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Success Metrics */}
            <div className="bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-2xl p-8">
                <div className="text-center space-y-6">
                    <h2 className="text-2xl md:text-3xl font-bold">Proven Results</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Our users have seen significant improvements in their interview performance.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="text-center space-y-2">
                            <div className="text-4xl font-bold text-primary">87%</div>
                            <div className="text-muted-foreground">Success Rate</div>
                            <div className="text-sm text-muted-foreground">Users who got job offers</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-4xl font-bold text-primary">3.2x</div>
                            <div className="text-muted-foreground">Improvement</div>
                            <div className="text-sm text-muted-foreground">Average score increase</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-4xl font-bold text-primary">15min</div>
                            <div className="text-muted-foreground">Time to Results</div>
                            <div className="text-sm text-muted-foreground">Get feedback instantly</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="space-y-8">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl md:text-3xl font-bold">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Got questions? We've got answers to help you get started.
                    </p>
                </div>

                <div className="space-y-4 max-w-3xl mx-auto">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-card border rounded-xl p-6">
                            <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                            <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 border rounded-2xl p-8">
                <div className="text-center space-y-6">
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                            <Play className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold">Ready to Start?</h2>
                    </div>
                    
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Join thousands of successful candidates who improved their interview skills with our AI-powered platform.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" onClick={() => router.push('/dashboard')}>
                            <Brain className="h-5 w-5 mr-2" />
                            Create Mock Interview
                            <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => router.push('/dashboard/questions')}>
                            <MessageSquare className="h-5 w-5 mr-2" />
                            Browse Questions
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HowItWorksPage;
