"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

const SubscriptionContext = createContext();

export const useSubscription = () => {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
};

export const SubscriptionProvider = ({ children }) => {
    const { user } = useUser();
    const [subscription, setSubscription] = useState({
        plan: 'free',
        status: 'active',
        features: {
            maxInterviews: 3,
            advancedFeedback: false,
            industryQuestions: false,
            prioritySupport: false,
            analytics: false,
            customScenarios: false
        },
        loading: true
    });

    useEffect(() => {
        if (user) {
            loadUserSubscription();
        }
    }, [user]);

    const loadUserSubscription = async () => {
        try {
            // In a real application, you would fetch this from your database
            // For now, we'll use localStorage or default to free plan
            
            const storedSubscription = localStorage.getItem(`subscription_${user.id}`);
            if (storedSubscription) {
                const parsed = JSON.parse(storedSubscription);
                setSubscription({ ...parsed, loading: false });
            } else {
                // Default free plan
                setSubscription(prev => ({ ...prev, loading: false }));
            }
        } catch (error) {
            console.error('Error loading subscription:', error);
            setSubscription(prev => ({ ...prev, loading: false }));
        }
    };

    const updateSubscription = (newPlan) => {
        const planFeatures = {
            free: {
                maxInterviews: 3,
                advancedFeedback: false,
                industryQuestions: false,
                prioritySupport: false,
                analytics: false,
                customScenarios: false
            },
            pro: {
                maxInterviews: -1, // Unlimited
                advancedFeedback: true,
                industryQuestions: true,
                prioritySupport: true,
                analytics: true,
                customScenarios: true
            },
            enterprise: {
                maxInterviews: -1, // Unlimited
                advancedFeedback: true,
                industryQuestions: true,
                prioritySupport: true,
                analytics: true,
                customScenarios: true,
                teamManagement: true,
                customBranding: true,
                apiAccess: true
            }
        };

        const updatedSubscription = {
            plan: newPlan,
            status: 'active',
            features: planFeatures[newPlan] || planFeatures.free,
            updatedAt: new Date().toISOString(),
            loading: false
        };

        setSubscription(updatedSubscription);
        
        // Store in localStorage (in production, update database)
        if (user) {
            localStorage.setItem(`subscription_${user.id}`, JSON.stringify(updatedSubscription));
        }
    };

    const hasFeature = (feature) => {
        return subscription.features[feature] === true;
    };

    const canCreateInterview = () => {
        if (subscription.features.maxInterviews === -1) return true;
        // In production, you would check actual usage from database
        const currentUsage = parseInt(localStorage.getItem(`usage_${user?.id}`) || '0');
        return currentUsage < subscription.features.maxInterviews;
    };

    const getRemainingInterviews = () => {
        if (subscription.features.maxInterviews === -1) return 'Unlimited';
        const currentUsage = parseInt(localStorage.getItem(`usage_${user?.id}`) || '0');
        return Math.max(0, subscription.features.maxInterviews - currentUsage);
    };

    const incrementUsage = () => {
        if (user && subscription.features.maxInterviews !== -1) {
            const currentUsage = parseInt(localStorage.getItem(`usage_${user.id}`) || '0');
            localStorage.setItem(`usage_${user.id}`, (currentUsage + 1).toString());
        }
    };

    const value = {
        subscription,
        updateSubscription,
        hasFeature,
        canCreateInterview,
        getRemainingInterviews,
        incrementUsage,
        isLoading: subscription.loading
    };

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    );
};

// Higher-order component for protecting premium features
export const withSubscription = (WrappedComponent, requiredFeature) => {
    return function SubscriptionProtectedComponent(props) {
        const { hasFeature, subscription } = useSubscription();
        
        if (subscription.loading) {
            return (
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            );
        }

        if (requiredFeature && !hasFeature(requiredFeature)) {
            return (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
                    <div className="text-blue-600 dark:text-blue-400 mb-2">
                        <svg className="h-12 w-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Premium Feature
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        This feature is available with our Pro or Enterprise plans.
                    </p>
                    <a 
                        href="/dashboard/upgrade" 
                        className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                        Upgrade Now
                    </a>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };
};
