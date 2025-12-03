const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Helper function to get token from localStorage
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to make API calls
async function fetchAPI(endpoint, options = {}) {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// Auth APIs
export const authAPI = {
  register: (data) => fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
    skipAuth: true,
  }),
  
  login: (data) => fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
    skipAuth: true,
  }),
  
  getProfile: () => fetchAPI('/auth/profile'),
};

// Books APIs
export const booksAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/books?${query}`, { skipAuth: true });
  },
  
  getById: (id) => fetchAPI(`/books/${id}`, { skipAuth: true }),
  
  getCategories: () => fetchAPI('/books/categories', { skipAuth: true }),
  
  getPopular: (limit = 10) => fetchAPI(`/books/popular?limit=${limit}`, { skipAuth: true }),
  
  addReview: (bookId, data) => fetchAPI(`/books/${bookId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Rentals APIs
export const rentalsAPI = {
  create: (data) => fetchAPI('/rentals', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getActive: () => fetchAPI('/rentals/active'),
  
  getHistory: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/rentals/history?${query}`);
  },
  
  getStats: () => fetchAPI('/rentals/stats'),
  
  extend: (rentalId, data) => fetchAPI(`/rentals/${rentalId}/extend`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

export default { authAPI, booksAPI, rentalsAPI };