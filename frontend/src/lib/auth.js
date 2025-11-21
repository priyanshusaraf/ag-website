import api from './utils';

export async function register({ name, email, password }) {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data;
}

export async function login({ email, password }) {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export async function adminLogin({ username, password }) {
  const res = await api.post('/auth/admin-login', { username, password });
  return res.data;
}

// Example: fetch user profile (requires token in headers)
export async function fetchUserProfile(token) {
  const res = await api.get('/user/profile', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

// Example: update user profile (requires token in headers)
export async function updateUserProfile(token, data) {
  const res = await api.put('/user/profile', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
} 