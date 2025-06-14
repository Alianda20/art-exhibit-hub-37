export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
}

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  price: number;
  imageUrl: string;
  dimensions?: string;
  medium?: string;
  year?: number;
  status: 'available' | 'sold';
}

export interface Exhibition {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  ticketPrice: number;
  imageUrl: string;
  totalSlots: number;
  availableSlots: number;
  status: 'upcoming' | 'ongoing' | 'past';
}

export interface ArtworkOrder {
  id: string;
  userId: string;
  artworkId: string;
  name: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  paymentMethod: 'mpesa';
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderDate: string;
  totalAmount: number;
}

export interface ExhibitionBooking {
  id: string;
  userId: string;
  exhibitionId: string;
  name: string;
  email: string;
  phone: string;
  slots: number;
  paymentMethod: 'mpesa';
  paymentStatus: 'pending' | 'completed' | 'failed';
  bookingDate: string;
  totalAmount: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied';
}

// M-Pesa API response types
export interface STKPushResponse {
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  MerchantRequestID: string;
  error?: string;
}

export interface TransactionStatusResponse {
  ResultCode: string;
  ResultDesc: string;
  MpesaReceiptNumber?: string;
  Amount?: number;
  TransactionDate?: string;
  errorCode?: string;
}

export interface FinalizeOrderResponse {
  success: boolean;
  orderId?: string;
  message?: string;
  error?: string;
}
