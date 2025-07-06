import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Debug environment variables
console.log('Environment check:', {
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ? 'Present' : 'Missing',
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET ? 'Present' : 'Missing',
    NODE_ENV: process.env.NODE_ENV,
});

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('Missing Razorpay environment variables');
}

// Initialize Razorpay instance with error handling
let razorpay = null;
try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.error('Missing Razorpay environment variables');
        throw new Error('Razorpay configuration is missing');
    }
    
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('Razorpay instance created successfully');
} catch (error) {
    console.error('Error creating Razorpay instance:', error);
}

export async function POST(req) {
    try {
        console.log('POST /api/payment/create-order called');
        
        // Check if Razorpay instance is available
        if (!razorpay) {
            console.error('Razorpay instance not available');
            return NextResponse.json(
                { error: 'Payment service not available. Please check Razorpay configuration.' },
                { status: 500 }
            );
        }
        
        console.log('Request headers:', Object.fromEntries(req.headers.entries()));
        
        // Debug: Check request body
        const body = await req.text();
        console.log('Raw request body:', body);
        console.log('Body length:', body.length);
        console.log('Body type:', typeof body);
        
        if (!body || body.trim() === '') {
            console.log('Empty request body');
            return NextResponse.json(
                { error: 'Empty request body' },
                { status: 400 }
            );
        }
        
        let parsedData;
        try {
            parsedData = JSON.parse(body);
            console.log('Successfully parsed JSON:', parsedData);
        } catch (parseError) {
            console.log('JSON parse error:', parseError.message);
            console.log('Parse error details:', parseError);
            return NextResponse.json(
                { error: 'Invalid JSON in request body', details: parseError.message },
                { status: 400 }
            );
        }
        
        const { amount, planId, userId } = parsedData;
        console.log('Request data:', { amount, planId, userId });
        console.log('Data types:', { 
            amount: typeof amount, 
            planId: typeof planId, 
            userId: typeof userId 
        });

        // Validate input
        if (!amount || !planId || !userId) {
            console.log('Missing required fields');
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate amount (should be in paise for Razorpay)
        const amountInPaise = Math.round(amount * 100);
        console.log('Amount in paise:', amountInPaise);
        
        if (amountInPaise < 100) { // Minimum 1 rupee
            console.log('Invalid amount');
            return NextResponse.json(
                { error: 'Invalid amount' },
                { status: 400 }
            );
        }

        // Create order options
        const timestamp = Date.now();
        const shortUserId = userId.slice(-8); // Take last 8 chars of userId
        const receipt = `${planId}_${shortUserId}_${timestamp}`.slice(0, 40); // Ensure max 40 chars
        
        const options = {
            amount: amountInPaise,
            currency: 'INR',
            receipt: receipt,
            notes: {
                planId,
                userId,
                timestamp: new Date().toISOString(),
            },
        };

        console.log('Creating Razorpay order with options:', options);

        // Create order with Razorpay
        const order = await razorpay.orders.create(options);
        console.log('Razorpay order created successfully:', order);

        // Return order details
        return NextResponse.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            status: order.status,
        });

    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        
        return NextResponse.json(
            { 
                error: 'Failed to create payment order',
                details: error.message 
            },
            { status: 500 }
        );
    }
}

// Handle payment verification (optional - for webhook)
export async function PUT(req) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        // Verify payment signature
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment is verified
            // Here you can update user subscription in database
            
            return NextResponse.json({
                success: true,
                message: 'Payment verified successfully'
            });
        } else {
            return NextResponse.json(
                { error: 'Payment verification failed' },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error('Error verifying payment:', error);
        
        return NextResponse.json(
            { 
                error: 'Payment verification failed',
                details: error.message 
            },
            { status: 500 }
        );
    }
}
