export interface RazorpayPaymentSuccess {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export interface RazorpayCheckoutOptions {
  amountINR: number;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  orderDescription?: string;
}

const RAZORPAY_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_RAZORPAY_KEY_ID) ||
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_RAZORPAY_KEY_ID) ||
  'rzp_test_TaEMJlWBKV8rky';

/**
 * Dynamically loads Razorpay checkout.js script if not present
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Initiates Razorpay test checkout and returns payment details
 */
export const initiateRazorpayPayment = async (
  options: RazorpayCheckoutOptions
): Promise<RazorpayPaymentSuccess> => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !(window as any).Razorpay) {
    throw new Error('Could not load Razorpay payment gateway. Please check your internet connection.');
  }

  // Amount in paise (1 INR = 100 paise)
  const amountPaise = Math.round(options.amountINR * 100);

  return new Promise((resolve, reject) => {
    const rzpOptions = {
      key: RAZORPAY_KEY,
      amount: amountPaise,
      currency: 'INR',
      name: 'काय Jevnar? Canteen',
      description: options.orderDescription || 'Campus Pure Veg Meal Tray',
      image: '/logo.png',
      prefill: {
        name: options.studentName || 'Campus Student',
        email: options.studentEmail || 'student@campus.edu',
        contact: options.studentPhone || '9876543210'
      },
      notes: {
        canteen_outpost: 'Pune Outpost Campus Canteen',
        dietary: '100% Pure Veg'
      },
      theme: {
        color: '#BA2424' // Signature काय Jevnar? Crimson
      },
      handler: function (response: RazorpayPaymentSuccess) {
        if (response && response.razorpay_payment_id) {
          resolve(response);
        } else {
          reject(new Error('Payment failed or cancelled.'));
        }
      },
      modal: {
        ondismiss: function () {
          reject(new Error('Payment cancelled by student.'));
        },
        escape: true,
        backdropclose: false
      }
    };

    try {
      const rzp = new (window as any).Razorpay(rzpOptions);
      rzp.on('payment.failed', function (response: any) {
        reject(new Error(response.error?.description || 'Payment transaction failed.'));
      });
      rzp.open();
    } catch (err: any) {
      reject(new Error('Failed to open Razorpay checkout: ' + (err.message || 'Unknown error')));
    }
  });
};
