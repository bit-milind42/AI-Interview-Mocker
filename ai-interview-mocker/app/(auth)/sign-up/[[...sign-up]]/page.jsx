import { SignUp } from '@clerk/nextjs'
import { Brain, Star, Users, Target, ArrowRight } from 'lucide-react'

export default function Page() {
    return (
        <main className="w-full flex min-h-screen">
            <div className="relative flex-1 hidden items-center justify-center h-screen bg-gradient-to-br from-primary to-primary/80 lg:flex">
                <div className="relative z-10 w-full max-w-md p-8">
                    <div className="flex items-center space-x-3 mb-16">
                        <Brain className="h-10 w-10 text-white" />
                        <span className="text-2xl font-bold text-white">AI Interview Mocker</span>
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-white text-3xl font-bold">Join Our Community</h3>
                        <p className="text-gray-200 text-lg">
                            Start your journey to interview success. Practice with AI, get feedback, and boost your confidence.
                        </p>
                        <div className="grid grid-cols-1 gap-4 mt-8">
                            <div className="flex items-center space-x-3 text-white/90">
                                <Brain className="h-5 w-5 text-white" />
                                <span>Personalized AI Questions</span>
                            </div>
                            <div className="flex items-center space-x-3 text-white/90">
                                <Target className="h-5 w-5 text-white" />
                                <span>Real-time Feedback</span>
                            </div>
                            <div className="flex items-center space-x-3 text-white/90">
                                <Users className="h-5 w-5 text-white" />
                                <span>Progress Analytics</span>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mt-8">
                            <div className="flex items-center space-x-2 mb-2">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-white/90 text-sm font-medium">
                                    Free Trial Available
                                </span>
                            </div>
                            <p className="text-white/80 text-sm">
                                Start practicing immediately with our free tier
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center h-screen bg-background">
                <div className="w-full max-w-md space-y-8 px-4 sm:px-0">
                    <div className="flex items-center justify-center lg:hidden mb-8">
                        <Brain className="h-8 w-8 text-primary mr-2" />
                        <span className="text-xl font-bold">AI Interview Mocker</span>
                    </div>
                    
                    <SignUp 
                        redirectUrl="/dashboard"
                        fallbackRedirectUrl="/dashboard"
                    />
                </div>
            </div>
        </main>
    );
}