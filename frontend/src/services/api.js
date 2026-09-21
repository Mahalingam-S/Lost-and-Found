const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const sendOTP = async (phone) => {
  const res = await fetch(`${API_BASE}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });
  return res.json();
};

export const verifyOTP = async (phone, otp) => {
  const res = await fetch(`${API_BASE}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp })
  });
  return res.json();
};

export const getMe = async () => {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getHeaders()
  });
  return res.json();
};

export const updateProfile = async (profileData) => {
  const res = await fetch(`${API_BASE}/auth/profile`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(profileData)
  });
  return res.json();
};

export const getItems = async ({ search = '', type = '', category = '', status = '' } = {}) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (type) params.append('type', type);
  if (category) params.append('category', category);
  if (status) params.append('status', status);

  const res = await fetch(`${API_BASE}/items?${params.toString()}`);
  return res.json();
};

export const getItemById = async (id) => {
  const res = await fetch(`${API_BASE}/items/${id}`);
  return res.json();
};

export const getMyPosts = async () => {
  const res = await fetch(`${API_BASE}/items/my-posts`, {
    headers: getHeaders()
  });
  return res.json();
};

export const createItem = async (itemData) => {
  const res = await fetch(`${API_BASE}/items`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(itemData)
  });
  return res.json();
};

export const updateItem = async (id, itemData) => {
  const res = await fetch(`${API_BASE}/items/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(itemData)
  });
  return res.json();
};

export const deleteItem = async (id) => {
  const res = await fetch(`${API_BASE}/items/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return res.json();
};
