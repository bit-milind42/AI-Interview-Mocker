"use client";
import React, { useState } from 'react';
import { Check, Star, Zap, Crown, Users, Clock, MessageSquare, Target } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

const PricingPage = () => {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const plans = [
        {
            id: 'free',
            name: 'Free',
            price: 0,
            period: 'forever',
            description: 'Perfect for getting started with AI interviews',
            features: [
                '3 AI interview sessions',
                'Basic feedback analysis',
                'Common interview questions',
                'Email support',
                'Basic performance tracking'
            ],
            icon: <Users className="h-6 w-6" />,
            popular: false,
            buttonText: 'Current Plan',
            color: 'from-gray-400 to-gray-600'
        },
        {
            id: 'pro',
            name: 'Pro',
            price: 999,
            period: 'month',
            description: 'Ideal for serious job seekers and professionals',
            features: [
                'Unlimited AI interview sessions',
                'Advanced feedback analysis',
                'Industry-specific questions',
                'Priority support',
                'Detailed performance analytics',
                'Custom interview scenarios',
                'Resume analysis integration',
                'Interview scheduling assistant'
            ],
            icon: <Zap className="h-6 w-6" />,
            popular: true,
            buttonText: 'Upgrade to Pro',
            color: 'from-blue-500 to-purple-600'
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: 4999,
            period: 'month',
            description: 'For teams and organizations',
            features: [
                'Everything in Pro',
                'Team management dashboard',
                'Bulk user management',
                'Custom branding',
                'API access',
                'Dedicated account manager',
                'Advanced analytics & reporting',
                'SSO integration',
                'Custom integrations'
            ],
            icon: <Crown className="h-6 w-6" />,
            popular: false,
            buttonText: 'Contact Sales',
            color: 'from-purple-500 to-pink-600'
        }
    ];

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (plan) => {
        if (plan.id === 'free') {
            toast.info('You are already on the free plan');
            return;
        }

        if (plan.id === 'enterprise') {
            toast.info('Please contact our sales team for enterprise pricing');
            return;
        }

        setLoading(true);
        setSelectedPlan(plan.id);

        try {
            // Load Razorpay script
            const res = await loadRazorpayScript();
            if (!res) {
                toast.error('Failed to load payment gateway');
                return;
            }

            // Create order
            const requestData = {
                amount: plan.price,
                planId: plan.id,
                userId: user?.id,
            };
            console.log('Sending payment request with data:', requestData);
            console.log('Plan object:', plan);
            console.log('User object:', user);
            console.log('Request data types:', {
                amount: typeof requestData.amount,
                planId: typeof requestData.planId,
                userId: typeof requestData.userId
            });
            
            const requestBody = JSON.stringify(requestData);
            console.log('Stringified request body:', requestBody);
            
            const orderResponse = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody,
            });

            console.log('Response status:', orderResponse.status);
            console.log('Response headers:', orderResponse.headers);
            
            let orderData;
            try {
                const responseText = await orderResponse.text();
                console.log('Raw response text:', responseText);
                orderData = JSON.parse(responseText);
                console.log('Parsed response data:', orderData);
            } catch (parseError) {
                console.error('Failed to parse response:', parseError);
                throw new Error('Invalid response from server');
            }

            if (!orderResponse.ok) {
                console.error('Order creation failed:', orderData);
                throw new Error(orderData.error || 'Failed to create payment order');
            }

            // Razorpay options
            const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
            console.log('Razorpay Key:', razorpayKey); // Debug log
            
            if (!razorpayKey) {
                throw new Error('Razorpay key not found. Please check environment variables.');
            }
            
            const options = {
                key: razorpayKey,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'AI Interview Mocker',
                description: `${plan.name} Plan Subscription`,
                order_id: orderData.id,
                prefill: {
                    name: user?.fullName || '',
                    email: user?.emailAddresses?.[0]?.emailAddress || '',
                },
                theme: {
                    color: '#3B82F6',
                },
                handler: function (response) {
                    // Payment successful
                    toast.success('Payment successful! Welcome to ' + plan.name + ' plan!');
                    console.log('Payment successful:', response);
                    // You can redirect user or update their subscription status here
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        setSelectedPlan(null);
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error.message || 'Payment failed. Please try again.');
        } finally {
            setLoading(false);
            setSelectedPlan(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Choose Your Perfect Plan
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Unlock your potential with AI-powered interview practice. Get personalized feedback 
                        and boost your confidence for your next big opportunity.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {[
                        {
                            icon: <MessageSquare className="h-8 w-8 text-blue-500" />,
                            title: "AI-Powered Questions",
                            description: "Get realistic interview questions tailored to your industry"
                        },
                        {
                            icon: <Target className="h-8 w-8 text-green-500" />,
                            title: "Instant Feedback",
                            description: "Receive detailed analysis on your answers and performance"
                        },
                        {
                            icon: <Clock className="h-8 w-8 text-purple-500" />,
                            title: "Practice Anytime",
                            description: "Available 24/7 to help you practice whenever you want"
                        },
                        {
                            icon: <Star className="h-8 w-8 text-yellow-500" />,
                            title: "Track Progress",
                            description: "Monitor your improvement over time with detailed analytics"
                        }
                    ].map((feature, index) => (
                        <div key={index} className="text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                            <div className="inline-flex items-center justify-center mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl ${
                                plan.popular 
                                    ? 'border-blue-500 transform scale-105' 
                                    : 'border-gray-200 dark:border-slate-700 hover:border-blue-300'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="p-8">
                                {/* Plan Icon & Name */}
                                <div className="flex items-center justify-center mb-4">
                                    <div className={`p-3 rounded-full bg-gradient-to-r ${plan.color} text-white`}>
                                        {plan.icon}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
                                    {plan.name}
                                </h3>

                                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                                    {plan.description}
                                </p>

                                {/* Price */}
                                <div className="text-center mb-8">
                                    <div className="flex items-center justify-center">
                                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                            ₹{plan.price}
                                        </span>
                                        {plan.period !== 'forever' && (
                                            <span className="text-gray-600 dark:text-gray-300 ml-1">
                                                /{plan.period}
                                            </span>
                                        )}
                                    </div>
                                    {plan.price > 0 && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Billed monthly
                                        </p>
                                    )}
                                </div>

                                {/* Features */}
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-center">
                                            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-3" />
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <button
                                    onClick={() => handlePayment(plan)}
                                    disabled={loading && selectedPlan === plan.id}
                                    className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
                                        plan.popular
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                                            : plan.id === 'free'
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
                                    } ${loading && selectedPlan === plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {loading && selectedPlan === plan.id ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Processing...
                                        </div>
                                    ) : (
                                        plan.buttonText
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="mt-20 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                question: "Can I cancel my subscription anytime?",
                                answer: "Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period."
                            },
                            {
                                question: "Is there a refund policy?",
                                answer: "We offer a 7-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund."
                            },
                            {
                                question: "How does the AI interview work?",
                                answer: "Our AI uses advanced language models to generate realistic interview questions, analyze your responses, and provide detailed feedback on your performance."
                            },
                            {
                                question: "Can I upgrade or downgrade my plan?",
                                answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {faq.question}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Section */}
                <div className="mt-16 text-center">
                    <p className="text-gray-600 dark:text-gray-300">
                        Need help choosing the right plan? 
                        <a href="mailto:support@aiinterviewmocker.com" className="text-blue-500 hover:text-blue-600 ml-1">
                            Contact our team
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
