import { NextResponse } from 'next/server';

export async function GET() {
    try {
        console.log('Testing Razorpay environment variables...');
        console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'Present' : 'Missing');
        console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'Present' : 'Missing');
        
        // Try importing Razorpay
        const Razorpay = await import('razorpay');
        console.log('Razorpay import successful');
        
        // Try creating an instance
        const razorpay = new Razorpay.default({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        
        console.log('Razorpay instance created successfully');
        
        return NextResponse.json({
            success: true,
            envVars: {
                RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ? 'Present' : 'Missing',
                RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET ? 'Present' : 'Missing',
            }
        });
    } catch (error) {
        console.error('Test error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
