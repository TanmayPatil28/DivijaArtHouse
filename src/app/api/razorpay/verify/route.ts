import { NextRequest, NextResponse } from 'next/server';
import { verifyPayment } from '@/actions/payment';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await verifyPayment(body);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('API Razorpay verify error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error verifying payment',
      },
      { status: 500 }
    );
  }
}
