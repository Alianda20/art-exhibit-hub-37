
// API service to connect to the Python backend

// Base URL for the API
const API_URL = 'http://localhost:8000';

// Interface for auth responses
interface AuthResponse {
  token?: string;
  user_id?: number;
  admin_id?: number;
  name?: string;
  error?: string;
}

// Interface for registration data
interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

// Interface for login data
interface LoginData {
  email: string;
  password: string;
}

// Interface for artwork data
export interface ArtworkData {
  id?: string;
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

// Interface for exhibition data
export interface ExhibitionData {
  id?: string;
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

// Interface for contact message
interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

// Helper function to store auth data
const storeAuthData = (data: AuthResponse, isAdmin: boolean) => {
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('userName', data.name || '');
    localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
    
    // Store user or admin ID
    if (data.user_id) {
      localStorage.setItem('userId', data.user_id.toString());
    } else if (data.admin_id) {
      localStorage.setItem('adminId', data.admin_id.toString());
    }
    
    return true;
  }
  
  return false;
};

// Register a new user
export const registerUser = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const data = await response.json();
    
    if (response.ok) {
      storeAuthData(data, false);
    }
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { error: 'Connection timeout. Server may be down or unreachable.' };
    }
    return { error: 'Network error. Please try again.' };
  }
};

// Login a user
export const loginUser = async (credentials: LoginData): Promise<AuthResponse> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const data = await response.json();
    
    if (response.ok) {
      storeAuthData(data, false);
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { error: 'Connection timeout. Server may be down or unreachable.' };
    }
    return { error: 'Network error. Please try again.' };
  }
};

// Login as admin
export const loginAdmin = async (credentials: LoginData): Promise<AuthResponse> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${API_URL}/admin-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const data = await response.json();
    
    if (response.ok) {
      storeAuthData(data, true);
    }
    
    return data;
  } catch (error) {
    console.error('Admin login error:', error);
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { error: 'Connection timeout. Server may be down or unreachable.' };
    }
    return { error: 'Network error. Please try again.' };
  }
};

// Get the auth token
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Check if user is an admin
export const isAdmin = (): boolean => {
  return localStorage.getItem('isAdmin') === 'true';
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('userId');
  localStorage.removeItem('adminId');
};

// API request with authentication
export const authFetch = async (url: string, options: RequestInit = {}): Promise<any> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const headers = {
    ...(options.headers || {}),
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    console.log(`Making authenticated request to: ${API_URL}${url}`);
    console.log('Using token:', token);
    console.log('Request options:', { ...options, headers });
    
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.status === 401) {
      // Token expired or invalid
      logout();
      throw new Error('Session expired. Please login again.');
    }
    
    if (response.status === 403) {
      console.log('403 Forbidden error - Access denied');
      // Get more details from the response
      const errorData = await response.json();
      throw new Error(errorData.error || 'Access denied. Please check your permissions.');
    }
    
    const data = await response.json();
    
    // Log response for debugging
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API request error:', error);
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Connection timeout. Server may be down or unreachable.');
    }
    throw error;
  }
};

// Get all artworks
export const getAllArtworks = async () => {
  try {
    const response = await fetch(`${API_URL}/artworks`);
    if (!response.ok) {
      throw new Error('Failed to fetch artworks');
    }
    const data = await response.json();
    return data.artworks || [];
  } catch (error) {
    console.error('Error fetching artworks:', error);
    throw error;
  }
};

// Get a single artwork
export const getArtwork = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/artworks/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch artwork');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching artwork:', error);
    throw error;
  }
};

// Create a new artwork (admin only)
export const createArtwork = async (artworkData: ArtworkData) => {
  console.log('Creating artwork with data:', artworkData);
  return await authFetch('/artworks', {
    method: 'POST',
    body: JSON.stringify(artworkData),
  });
};

// Update an existing artwork (admin only)
export const updateArtwork = async (id: string, artworkData: ArtworkData) => {
  return await authFetch(`/artworks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(artworkData),
  });
};

// Delete an artwork (admin only)
export const deleteArtwork = async (id: string) => {
  return await authFetch(`/artworks/${id}`, {
    method: 'DELETE',
  });
};

// Get all exhibitions
export const getAllExhibitions = async () => {
  try {
    const response = await fetch(`${API_URL}/exhibitions`);
    if (!response.ok) {
      throw new Error('Failed to fetch exhibitions');
    }
    const data = await response.json();
    return data.exhibitions || [];
  } catch (error) {
    console.error('Error fetching exhibitions:', error);
    throw error;
  }
};

// Get a single exhibition
export const getExhibition = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/exhibitions/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch exhibition');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching exhibition:', error);
    throw error;
  }
};

// Create a new exhibition (admin only)
export const createExhibition = async (exhibitionData: ExhibitionData) => {
  console.log('Creating exhibition with data:', exhibitionData);
  return await authFetch('/exhibitions', {
    method: 'POST',
    body: JSON.stringify(exhibitionData),
  });
};

// Update an existing exhibition (admin only)
export const updateExhibition = async (id: string, exhibitionData: ExhibitionData) => {
  return await authFetch(`/exhibitions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(exhibitionData),
  });
};

// Delete an exhibition (admin only)
export const deleteExhibition = async (id: string) => {
  return await authFetch(`/exhibitions/${id}`, {
    method: 'DELETE',
  });
};

// Submit a contact message
export const submitContactMessage = async (messageData: ContactMessage) => {
  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit contact message');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting contact message:', error);
    throw error;
  }
};

// Get all contact messages (admin only)
export const getAllContactMessages = async () => {
  return await authFetch('/messages');
};

// Update message status (admin only)
export const updateMessageStatus = async (id: string, status: 'new' | 'read' | 'replied') => {
  return await authFetch(`/messages/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
};

// Get all tickets (admin only)
export const getAllTickets = async () => {
  return await authFetch('/tickets');
};

// Generate exhibition ticket
export const generateExhibitionTicket = async (bookingId: string) => {
  try {
    const response = await fetch(`${API_URL}/tickets/generate/${bookingId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate ticket');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ticket generation error:', error);
    throw error;
  }
};

// Get user tickets
export const getUserTickets = async (userId: string) => {
  return await authFetch(`/tickets/user/${userId}`);
};

// Get user orders
export const getUserOrders = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/orders/user/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user orders');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get user orders error:', error);
    throw error;
  }
};
