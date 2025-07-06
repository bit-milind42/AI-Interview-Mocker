"use client";
import React from 'react';
import { useSubscription } from './SubscriptionProvider';
import { Crown, Zap, Users } from 'lucide-react';
import Link from 'next/link';

const SubscriptionBadge = () => {
    const { subscription, getRemainingInterviews } = useSubscription();

    if (subscription.loading) {
        return (
            <div className="flex items-center space-x-2">
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
        );
    }

    const planConfig = {
        free: {
            icon: <Users className="h-4 w-4" />,
            color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
            hoverColor: 'hover:bg-gray-200 dark:hover:bg-gray-600'
        },
        pro: {
            icon: <Zap className="h-4 w-4" />,
            color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
            hoverColor: 'hover:bg-blue-200 dark:hover:bg-blue-900/50'
        },
        enterprise: {
            icon: <Crown className="h-4 w-4" />,
            color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
            hoverColor: 'hover:bg-purple-200 dark:hover:bg-purple-900/50'
        }
    };

    const config = planConfig[subscription.plan] || planConfig.free;
    const remaining = getRemainingInterviews();

    return (
        <Link 
            href="/dashboard/upgrade"
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${config.color} ${config.hoverColor}`}
        >
            {config.icon}
            <span className="capitalize">{subscription.plan}</span>
            {subscription.plan === 'free' && (
                <span className="text-xs opacity-75">
                    ({remaining} left)
                </span>
            )}
        </Link>
    );
};

export default SubscriptionBadge;
