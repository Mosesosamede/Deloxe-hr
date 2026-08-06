import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transaction_id, tx_ref } = body;

    if (!transaction_id || !tx_ref) {
      return NextResponse.json(
        { success: false, error: 'Missing transaction_id or tx_ref in request body.' },
        { status: 400 }
      );
    }

    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    if (!secretKey) {
      console.error('FLUTTERWAVE_SECRET_KEY environment variable is not configured on the server.');
      return NextResponse.json(
        {
          success: false,
          error: 'Server misconfiguration: Flutterwave Secret Key is missing. Please configure FLUTTERWAVE_SECRET_KEY in the environment settings.',
        },
        { status: 500 }
      );
    }

    // 1. Retrieve the pending payment from Firestore to verify details and prevent tampering
    const pendingPaymentRef = doc(db, 'pending_payments', tx_ref);
    const pendingPaymentSnap = await getDoc(pendingPaymentRef);

    if (!pendingPaymentSnap.exists()) {
      return NextResponse.json(
        { success: false, error: 'No matching transaction reference found in our system.' },
        { status: 404 }
      );
    }

    const pendingData = pendingPaymentSnap.data();

    // 2. Fetch the verification details from Flutterwave API securely (Server-to-Server)
    const flutterwaveUrl = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`;
    const response = await fetch(flutterwaveUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Flutterwave API Verification HTTP Error:', response.status, errText);
      return NextResponse.json(
        { success: false, error: 'Failed to communicate with Flutterwave verification service.' },
        { status: response.status }
      );
    }

    const verificationResult = await response.json();

    if (verificationResult.status !== 'success' || !verificationResult.data) {
      return NextResponse.json(
        { success: false, error: verificationResult.message || 'Payment verification failed.' },
        { status: 400 }
      );
    }

    const paymentData = verificationResult.data;

    // 3. Security Audits:
    // A. Check status
    if (paymentData.status !== 'successful') {
      return NextResponse.json(
        { success: false, error: `Transaction is not successful. Status: ${paymentData.status}` },
        { status: 400 }
      );
    }

    // B. Check tx_ref matches
    if (paymentData.tx_ref !== tx_ref) {
      return NextResponse.json(
        { success: false, error: 'Transaction reference mismatch (spoofing attempt detected).' },
        { status: 400 }
      );
    }

    // C. Check amount (allowing slight floating point variation if any)
    const expectedAmount = Number(pendingData.amount);
    const receivedAmount = Number(paymentData.amount);
    if (Math.abs(receivedAmount - expectedAmount) > 1.0) {
      return NextResponse.json(
        {
          success: false,
          error: `Transaction amount mismatch. Expected: ${expectedAmount}, Received: ${receivedAmount}`,
        },
        { status: 400 }
      );
    }

    // D. Check currency
    if (paymentData.currency !== pendingData.currency) {
      return NextResponse.json(
        {
          success: false,
          error: `Transaction currency mismatch. Expected: ${pendingData.currency}, Received: ${paymentData.currency}`,
        },
        { status: 400 }
      );
    }

    // 4. Update the payment status in Firestore to Successful
    await updateDoc(pendingPaymentRef, {
      status: 'Successful',
      flutterwaveTransactionId: transaction_id,
      verifiedAt: Date.now(),
      paymentType: paymentData.payment_type || 'card',
      deviceType: paymentData.device_fingerprint || 'unknown',
    });

    // Optionally: If the user is authenticated, we could also log a subscription record
    if (pendingData.userId) {
      const subscriptionRef = doc(db, 'subscriptions', pendingData.userId);
      await updateDoc(subscriptionRef, {
        activePackage: pendingData.packageName,
        packageId: pendingData.packageId,
        billingCycle: pendingData.billingCycle,
        amount: pendingData.amount,
        currency: pendingData.currency,
        status: 'Active',
        updatedAt: Date.now(),
      }).catch(async () => {
        // Fallback to setDoc if update fails because the document doesn't exist yet
        const { setDoc } = await import('firebase/firestore');
        await setDoc(subscriptionRef, {
          userId: pendingData.userId,
          activePackage: pendingData.packageName,
          packageId: pendingData.packageId,
          billingCycle: pendingData.billingCycle,
          amount: pendingData.amount,
          currency: pendingData.currency,
          status: 'Active',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Transaction verified and successfully processed.',
      data: {
        amount: paymentData.amount,
        currency: paymentData.currency,
        customerName: paymentData.customer?.name,
        email: paymentData.customer?.email,
      },
    });
  } catch (error: any) {
    console.error('Unhandled payment verification error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred during verification.' },
      { status: 500 }
    );
  }
}
