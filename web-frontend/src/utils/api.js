import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:5000/api'; // Or your actual backend URL

export const fetchWithAuth = async (endpoint, options = {}) => {
  const user = auth.currentUser;
  let token = '';
  
  if (user) {
    token = await user.getIdToken();
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed');
  }

  return response.json();
};

export const syncUserWithBackend = async () => {
  try {
    const data = await fetchWithAuth('/auth/login', {
      method: 'POST',
    });
    return data;
  } catch (error) {
    console.error('Failed to sync user with backend:', error);
    throw error;
  }
};
