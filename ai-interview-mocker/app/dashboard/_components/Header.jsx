"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { Brain, Home, HelpCircle, Zap, MessageSquare } from "lucide-react";
import SubscriptionBadge from "../../../components/SubscriptionBadge";

function Header() {
    const path = usePathname();
    
    useEffect(() => {
        console.log("Current path:", path);
    }, [])
    
    return (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center">
                {/* Logo */}
                <Link href="/dashboard" className="flex items-center space-x-2">
                    <Brain className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold">AI Interview Mocker</span>
                </Link>
                
                {/* Navigation - Centered */}
                <nav className="hidden md:flex items-center space-x-1 flex-1 justify-center">
                    <Link 
                        href="/dashboard" 
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                            path === '/dashboard' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                        }`}
                    >
                        <Home className="h-4 w-4" />
                        Dashboard
                    </Link>
                    <Link 
                        href="/dashboard/questions" 
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                            path === '/dashboard/questions' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                        }`}
                    >
                        <MessageSquare className="h-4 w-4" />
                        Questions
                    </Link>
                    <Link 
                        href="/dashboard/upgrade" 
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                            path === '/dashboard/upgrade' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                        }`}
                    >
                        <Zap className="h-4 w-4" />
                        Pricing
                    </Link>
                    <Link 
                        href="/dashboard/how-it-works" 
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                            path === '/dashboard/how-it-works' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                        }`}
                    >
                        <HelpCircle className="h-4 w-4" />
                        How it Works
                    </Link>
                </nav>
                
                {/* User Button */}
                <div className="flex items-center space-x-4">
                    <SubscriptionBadge />
                    <UserButton 
                        appearance={{
                            elements: {
                                avatarBox: "h-9 w-9"
                            }
                        }}
                    />
                </div>
            </div>
        </header>
    );
}

export default Header;
