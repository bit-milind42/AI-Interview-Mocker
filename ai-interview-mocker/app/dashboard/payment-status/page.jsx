"use client";
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const PaymentStatusPage = () => {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('loading');
    const [details, setDetails] = useState({});

    useEffect(() => {
        // Get payment status from URL parameters
        const paymentId = searchParams.get('payment_id');
        const orderId = searchParams.get('order_id');
        const success = searchParams.get('success');

        if (success === 'true' && paymentId && orderId) {
            setStatus('success');
            setDetails({ paymentId, orderId });
        } else if (success === 'false') {
            setStatus('failed');
        } else {
            setStatus('unknown');
        }
    }, [searchParams]);

    const StatusContent = {
        loading: {
            icon: <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>,
            title: 'Processing Payment...',
            message: 'Please wait while we verify your payment.',
            color: 'text-blue-600'
        },
        success: {
            icon: <CheckCircle className="h-16 w-16 text-green-500" />,
            title: 'Payment Successful!',
            message: 'Thank you for upgrading to our premium plan. Your account has been updated.',
            color: 'text-green-600'
        },
        failed: {
            icon: <XCircle className="h-16 w-16 text-red-500" />,
            title: 'Payment Failed',
            message: 'We encountered an issue processing your payment. Please try again.',
            color: 'text-red-600'
        },
        unknown: {
            icon: <XCircle className="h-16 w-16 text-gray-500" />,
            title: 'Payment Status Unknown',
            message: 'We could not determine the status of your payment. Please contact support.',
            color: 'text-gray-600'
        }
    };

    const currentStatus = StatusContent[status];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
                {/* Status Icon */}
                <div className="flex justify-center mb-6">
                    {currentStatus.icon}
                </div>

                {/* Title */}
                <h1 className={`text-2xl font-bold mb-4 ${currentStatus.color}`}>
                    {currentStatus.title}
                </h1>

                {/* Message */}
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {currentStatus.message}
                </p>

                {/* Payment Details */}
                {status === 'success' && details.paymentId && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                        <div className="text-sm text-green-800 dark:text-green-200">
                            <p><strong>Payment ID:</strong> {details.paymentId}</p>
                            <p><strong>Order ID:</strong> {details.orderId}</p>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                    {status === 'success' && (
                        <>
                            <Link 
                                href="/dashboard" 
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 inline-block"
                            >
                                Go to Dashboard
                            </Link>
                            <Link 
                                href="/dashboard/upgrade" 
                                className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-xl transition-all duration-300 inline-block"
                            >
                                View Plans
                            </Link>
                        </>
                    )}

                    {status === 'failed' && (
                        <>
                            <Link 
                                href="/dashboard/upgrade" 
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 inline-block"
                            >
                                Try Again
                            </Link>
                            <Link 
                                href="/dashboard" 
                                className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-xl transition-all duration-300 inline-block"
                            >
                                Go to Dashboard
                            </Link>
                        </>
                    )}

                    {(status === 'unknown' || status === 'loading') && (
                        <Link 
                            href="/dashboard" 
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 inline-block"
                        >
                            Go to Dashboard
                        </Link>
                    )}
                </div>

                {/* Back Link */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                    <Link 
                        href="/dashboard" 
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Link>
                </div>

                {/* Support Contact */}
                {(status === 'failed' || status === 'unknown') && (
                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        Need help? Contact us at{' '}
                        <a 
                            href="mailto:support@aiinterviewmocker.com" 
                            className="text-blue-500 hover:text-blue-600"
                        >
                            support@aiinterviewmocker.com
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentStatusPage;
