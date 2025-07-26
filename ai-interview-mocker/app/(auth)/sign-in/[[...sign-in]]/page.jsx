import { SignIn } from '@clerk/nextjs'
import { Brain, Star, Users, Target } from 'lucide-react'

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
                        <h3 className="text-white text-3xl font-bold">Master Your Interview Skills</h3>
                        <p className="text-gray-200 text-lg">
                            Practice realistic mock interviews powered by AI. Get instant feedback and land your dream job with confidence.
                        </p>
                        <div className="grid grid-cols-1 gap-4 mt-8">
                            <div className="flex items-center space-x-3 text-white/90">
                                <Brain className="h-5 w-5 text-white" />
                                <span>AI-Powered Questions</span>
                            </div>
                            <div className="flex items-center space-x-3 text-white/90">
                                <Target className="h-5 w-5 text-white" />
                                <span>Instant Feedback</span>
                            </div>
                            <div className="flex items-center space-x-3 text-white/90">
                                <Users className="h-5 w-5 text-white" />
                                <span>Track Progress</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-8">
                            <Star className="h-5 w-5 text-yellow-400 fill-current" />
                            <span className="text-white/90 text-sm font-medium">
                                Trusted by 10,000+ job seekers
                            </span>
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
                    
                    <SignIn 
                        redirectUrl="/dashboard"
                        fallbackRedirectUrl="/dashboard"
                    />
                </div>
            </div>
        </main>
    );
}
