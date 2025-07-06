"use client";
import React from 'react';
import { Zap, Star, Crown } from 'lucide-react';
import Link from 'next/link';

const UpgradePrompt = ({ 
    feature = "this feature",
    description = "Unlock premium features with our Pro plan",
    showFeatures = true,
    compact = false 
}) => {
    const features = [
        "Unlimited AI interview sessions",
        "Advanced feedback analysis", 
        "Industry-specific questions",
        "Priority support",
        "Detailed analytics"
    ];

    if (compact) {
        return (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-500 rounded-lg">
                            <Zap className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Upgrade to Pro
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {description}
                            </p>
                        </div>
                    </div>
                    <Link 
                        href="/dashboard/upgrade"
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        Upgrade
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8 text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
                <Star className="h-8 w-8 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Unlock {feature}
            </h2>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                {description}
            </p>

            {/* Features List */}
            {showFeatures && (
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        What you'll get:
                    </h3>
                    <ul className="text-left max-w-sm mx-auto space-y-2">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3">
                <Link 
                    href="/dashboard/upgrade"
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                    <Zap className="h-5 w-5 mr-2" />
                    Upgrade to Pro
                </Link>
                
                <Link 
                    href="/dashboard"
                    className="w-full inline-flex items-center justify-center px-6 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-sm transition-colors"
                >
                    Maybe later
                </Link>
            </div>

            {/* Pricing hint */}
            <div className="mt-6 pt-6 border-t border-blue-200 dark:border-blue-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Starting at <span className="font-semibold text-blue-600 dark:text-blue-400">₹999/month</span>
                    {" • "}
                    <span className="text-green-600 dark:text-green-400">Cancel anytime</span>
                </p>
            </div>
        </div>
    );
};

export default UpgradePrompt;
