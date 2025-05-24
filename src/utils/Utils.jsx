import config from "../config/config";

// utils/auth.js
export async function checkAuth() {
  try {
    const res = await fetch(`${config.BASE_URL}/users/me`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await res.json();

    if (res.ok && data.acknowledge) {
      return data.data; // user data
    } else {
      return null;
    }
  } catch (err) {
    console.error('Auth check error:', err);
    return null;
  }
}
