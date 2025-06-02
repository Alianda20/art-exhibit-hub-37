
// Mock M-Pesa integration
// In a real application, you would integrate with the actual M-Pesa API

import { authFetch } from '@/services/api';

export interface MpesaPaymentData {
  amount: number;
  phoneNumber: string;
  accountReference: string;
  transactionDesc: string;
  userId: string;
  itemId: string;
  itemType: 'artwork' | 'exhibition';
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    deliveryAddress?: string;
    slots?: number;
  };
}

export const initiateMpesaPayment = async (paymentData: MpesaPaymentData) => {
  // Simulate M-Pesa STK push
  console.log('Initiating M-Pesa payment:', paymentData);
  
  // Mock successful payment response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: `MP${Date.now()}`,
        checkoutRequestId: `CHK${Date.now()}`,
        message: 'Payment initiated successfully'
      });
    }, 2000);
  });
};

// Function expected by Payment.tsx
export const initiateSTKPush = async (
  phoneNumber: string,
  amount: number,
  type: 'artwork' | 'exhibition',
  itemId: string,
  accountReference: string
) => {
  console.log('Initiating STK Push:', { phoneNumber, amount, type, itemId, accountReference });
  
  // Mock STK push response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        CheckoutRequestID: `CHK${Date.now()}`,
        ResponseCode: "0",
        ResponseDescription: "Success. Request accepted for processing",
        MerchantRequestID: `MR${Date.now()}`
      });
    }, 1000);
  });
};

export const checkPaymentStatus = async (checkoutRequestId: string) => {
  // Mock payment status check
  console.log('Checking payment status for:', checkoutRequestId);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        status: 'completed',
        transactionId: `MP${Date.now()}`,
        amount: 1000
      });
    }, 1000);
  });
};

// Function expected by Payment.tsx
export const checkTransactionStatus = async (checkoutRequestId: string) => {
  console.log('Checking transaction status for:', checkoutRequestId);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful payment
      resolve({
        ResultCode: "0",
        ResultDesc: "The service request is processed successfully.",
        MpesaReceiptNumber: `MP${Date.now()}`,
        Amount: 1000,
        TransactionDate: new Date().toISOString()
      });
    }, 1000);
  });
};

// Function expected by Payment.tsx
export const finalizeOrder = async (
  checkoutRequestId: string,
  type: 'artwork' | 'exhibition',
  orderData: any
) => {
  try {
    console.log('Finalizing order:', { checkoutRequestId, type, orderData });
    
    // Call the appropriate backend endpoint to save the order
    const endpoint = type === 'artwork' ? '/orders/artwork' : '/orders/exhibition';
    
    const response = await authFetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        checkoutRequestId,
        ...orderData
      })
    });
    
    return {
      success: true,
      orderId: response.id || checkoutRequestId,
      message: 'Order finalized successfully'
    };
  } catch (error) {
    console.error('Error finalizing order:', error);
    return {
      success: false,
      error: 'Failed to finalize order'
    };
  }
};

// Get user orders and bookings from the backend
export const getUserOrders = async (userId: string) => {
  try {
    return await authFetch(`/orders/user/${userId}`);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

// Generate exhibition ticket
export const generateExhibitionTicket = async (bookingId: string) => {
  try {
    return await authFetch(`/tickets/generate/${bookingId}`);
  } catch (error) {
    console.error('Error generating ticket:', error);
    throw error;
  }
};
