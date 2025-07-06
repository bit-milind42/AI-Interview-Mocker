import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req) {
    try {
        const body = await req.text();
        const signature = req.headers.get('x-razorpay-signature');

        // Verify webhook signature
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(body)
            .digest('hex');

        if (signature !== expectedSignature) {
            console.error('Invalid webhook signature');
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
        }

        const event = JSON.parse(body);
        
        // Handle different webhook events
        switch (event.event) {
            case 'payment.captured':
                await handlePaymentCaptured(event.payload.payment.entity);
                break;
            
            case 'payment.failed':
                await handlePaymentFailed(event.payload.payment.entity);
                break;
            
            case 'order.paid':
                await handleOrderPaid(event.payload.order.entity);
                break;
            
            default:
                console.log(`Unhandled event type: ${event.event}`);
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}

async function handlePaymentCaptured(payment) {
    try {
        console.log('Payment captured:', payment.id);
        
        // Extract user and plan information from payment notes or order
        const notes = payment.notes || {};
        const userId = notes.userId;
        const planId = notes.planId;

        if (userId && planId) {
            // Here you would typically:
            // 1. Update user subscription in database
            // 2. Send confirmation email
            // 3. Update user permissions
            
            console.log(`Updating subscription for user ${userId} to plan ${planId}`);
            
            // Example database update (implement based on your schema)
            // await updateUserSubscription(userId, planId, payment);
            
            // Send confirmation email (implement as needed)
            // await sendSubscriptionConfirmationEmail(userId, planId);
        }

    } catch (error) {
        console.error('Error handling payment captured:', error);
    }
}

async function handlePaymentFailed(payment) {
    try {
        console.log('Payment failed:', payment.id);
        
        // Handle failed payment
        // You might want to:
        // 1. Log the failure
        // 2. Send notification to user
        // 3. Update any relevant records
        
        const notes = payment.notes || {};
        const userId = notes.userId;
        
        if (userId) {
            console.log(`Payment failed for user ${userId}`);
            // Implement failure handling logic
        }

    } catch (error) {
        console.error('Error handling payment failed:', error);
    }
}

async function handleOrderPaid(order) {
    try {
        console.log('Order paid:', order.id);
        
        // Handle successful order payment
        // This is called when an order is fully paid
        
    } catch (error) {
        console.error('Error handling order paid:', error);
    }
}

// GET method to verify webhook endpoint is working
export async function GET() {
    return NextResponse.json({ 
        message: 'Razorpay webhook endpoint is active',
        timestamp: new Date().toISOString()
    });
}
