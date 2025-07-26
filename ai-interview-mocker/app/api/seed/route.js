import { db } from "@/utils/db";
import { QuestionBank, Companies } from "@/utils/schema";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        // Sample companies data
        const companiesData = [
            {
                name: 'Google',
                logo: '/companies/google.png',
                industry: 'Technology',
                description: 'Multinational technology company focusing on online advertising, search engine technology, cloud computing, computer software, quantum computing, e-commerce, artificial intelligence, and consumer electronics.',
                websiteUrl: 'https://www.google.com',
                questionCount: 25,
                isPopular: true
            },
            {
                name: 'Amazon',
                logo: '/companies/amazon.png',
                industry: 'E-commerce & Cloud Computing',
                description: 'Multinational technology company which focuses on e-commerce, cloud computing, digital streaming, and artificial intelligence.',
                websiteUrl: 'https://www.amazon.com',
                questionCount: 22,
                isPopular: true
            },
            {
                name: 'Microsoft',
                logo: '/companies/microsoft.png',
                industry: 'Technology',
                description: 'Multinational technology corporation which produces computer software, consumer electronics, personal computers, and related services.',
                websiteUrl: 'https://www.microsoft.com',
                questionCount: 20,
                isPopular: true
            },
            {
                name: 'Apple',
                logo: '/companies/apple.png',
                industry: 'Technology',
                description: 'Multinational technology company that specializes in consumer electronics, computer software, and online services.',
                websiteUrl: 'https://www.apple.com',
                questionCount: 18,
                isPopular: true
            },
            {
                name: 'Meta',
                logo: '/companies/meta.png',
                industry: 'Social Media',
                description: 'Technology company that focuses on building products that help people connect, find communities, and grow businesses.',
                websiteUrl: 'https://www.meta.com',
                questionCount: 15,
                isPopular: true
            },
            {
                name: 'Netflix',
                logo: '/companies/netflix.png',
                industry: 'Entertainment',
                description: 'American streaming entertainment service with over 200 million paid memberships in more than 190 countries.',
                websiteUrl: 'https://www.netflix.com',
                questionCount: 12,
                isPopular: true
            }
        ];

        // Sample questions data
        const questionsData = [
            // HR/Behavioral Questions
            {
                question: "Tell me about yourself and your professional journey.",
                answer: "Structure your response using the present-past-future framework. Start with your current role, briefly cover your background, and connect it to why you're interested in this position.",
                category: "hr",
                difficulty: "easy",
                jobRole: "Software Engineer",
                technology: null,
                company: null,
                tags: JSON.stringify(["introduction", "career", "background"]),
                estimatedTime: "3-4 minutes",
                isPopular: true,
                viewCount: 150,
                practiceCount: 89,
                successRate: 85
            },
            {
                question: "Describe a time when you had to work with a difficult team member. How did you handle it?",
                answer: "Use the STAR method (Situation, Task, Action, Result) to describe a specific scenario where you demonstrated conflict resolution and teamwork skills.",
                category: "hr",
                difficulty: "medium",
                jobRole: "Software Engineer",
                technology: null,
                company: null,
                tags: JSON.stringify(["teamwork", "conflict-resolution", "communication"]),
                estimatedTime: "4-5 minutes",
                isPopular: true,
                viewCount: 125,
                practiceCount: 67,
                successRate: 78
            },
            {
                question: "Why do you want to work at Google specifically?",
                answer: "Research Google's mission, values, and recent projects. Connect your career goals with Google's innovation in areas like AI, cloud computing, or search technology.",
                category: "company-specific",
                difficulty: "medium",
                jobRole: "Software Engineer",
                technology: null,
                company: "Google",
                tags: JSON.stringify(["company-research", "motivation", "culture-fit"]),
                estimatedTime: "3-4 minutes",
                isPopular: true,
                viewCount: 98,
                practiceCount: 45,
                successRate: 82
            },
            
            // Technical Questions
            {
                question: "Explain the difference between React's useState and useEffect hooks with examples.",
                answer: "useState manages component state and triggers re-renders when state changes. useEffect handles side effects like API calls, subscriptions, and cleanup. Provide code examples for both.",
                category: "technical",
                difficulty: "medium",
                jobRole: "Frontend Developer",
                technology: "React",
                company: null,
                tags: JSON.stringify(["react", "hooks", "javascript", "state-management"]),
                estimatedTime: "5-6 minutes",
                isPopular: true,
                viewCount: 187,
                practiceCount: 134,
                successRate: 72
            },
            {
                question: "How would you implement a LRU (Least Recently Used) cache?",
                answer: "Discuss using a combination of HashMap for O(1) access and a doubly linked list for O(1) insertion/deletion. Explain the algorithm and provide implementation details.",
                category: "technical",
                difficulty: "hard",
                jobRole: "Software Engineer",
                technology: "Data Structures",
                company: null,
                tags: JSON.stringify(["algorithms", "data-structures", "caching", "system-design"]),
                estimatedTime: "8-10 minutes",
                isPopular: true,
                viewCount: 156,
                practiceCount: 78,
                successRate: 65
            },
            {
                question: "What is the difference between SQL joins? Explain with examples.",
                answer: "Cover INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN. Provide examples with sample tables and explain when to use each type.",
                category: "technical",
                difficulty: "medium",
                jobRole: "Backend Developer",
                technology: "Database",
                company: null,
                tags: JSON.stringify(["sql", "database", "joins", "queries"]),
                estimatedTime: "6-7 minutes",
                isPopular: true,
                viewCount: 143,
                practiceCount: 89,
                successRate: 79
            },
            
            // Company-specific Questions
            {
                question: "How would you design a system like Amazon's recommendation engine?",
                answer: "Discuss collaborative filtering, content-based filtering, and hybrid approaches. Consider scalability, real-time updates, and handling cold-start problems.",
                category: "company-specific",
                difficulty: "hard",
                jobRole: "Software Engineer",
                technology: "Machine Learning",
                company: "Amazon",
                tags: JSON.stringify(["system-design", "machine-learning", "recommendations", "scalability"]),
                estimatedTime: "15-20 minutes",
                isPopular: true,
                viewCount: 134,
                practiceCount: 56,
                successRate: 58
            },
            {
                question: "Explain Microsoft's cloud-first strategy and how it impacts software development.",
                answer: "Discuss Azure services, cloud-native development, microservices architecture, and how Microsoft shifted from on-premise to cloud solutions.",
                category: "company-specific",
                difficulty: "medium",
                jobRole: "Cloud Engineer",
                technology: "AWS",
                company: "Microsoft",
                tags: JSON.stringify(["cloud-computing", "azure", "strategy", "architecture"]),
                estimatedTime: "5-6 minutes",
                isPopular: false,
                viewCount: 87,
                practiceCount: 23,
                successRate: 71
            },
            
            // More technical questions
            {
                question: "Implement a function to find the longest palindromic substring.",
                answer: "Discuss multiple approaches: brute force O(n³), expand around center O(n²), and Manacher's algorithm O(n). Provide code implementation for the optimal solution.",
                category: "technical",
                difficulty: "hard",
                jobRole: "Software Engineer",
                technology: "Algorithms",
                company: null,
                tags: JSON.stringify(["algorithms", "strings", "dynamic-programming", "palindrome"]),
                estimatedTime: "10-12 minutes",
                isPopular: true,
                viewCount: 167,
                practiceCount: 95,
                successRate: 63
            },
            {
                question: "What is the event loop in Node.js and how does it work?",
                answer: "Explain the single-threaded nature of Node.js, the event loop phases (timers, I/O callbacks, idle/prepare, poll, check, close), and provide examples of asynchronous operations.",
                category: "technical",
                difficulty: "medium",
                jobRole: "Backend Developer",
                technology: "Node.js",
                company: null,
                tags: JSON.stringify(["nodejs", "event-loop", "asynchronous", "javascript"]),
                estimatedTime: "6-8 minutes",
                isPopular: true,
                viewCount: 198,
                practiceCount: 112,
                successRate: 74
            }
        ];

        // Insert companies
        await db.insert(Companies).values(companiesData);
        console.log('Companies seeded successfully');

        // Insert questions
        await db.insert(QuestionBank).values(questionsData);
        console.log('Questions seeded successfully');

        return NextResponse.json({ 
            message: 'Database seeded successfully',
            companiesCount: companiesData.length,
            questionsCount: questionsData.length
        });

    } catch (error) {
        console.error('Error seeding database:', error);
        return NextResponse.json(
            { error: "Failed to seed database: " + error.message }, 
            { status: 500 }
        );
    }
}
