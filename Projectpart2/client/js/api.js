const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : '/api';

function getToken() {
    return localStorage.getItem('wc_token');
}

function getCurrentUser() {
    const user = localStorage.getItem('wc_user');
    return user ? JSON.parse(user) : null;
}

function setSession(token, user) {
    localStorage.setItem('wc_token', token);
    localStorage.setItem('wc_user', JSON.stringify(user));
}

function clearSession() {
    localStorage.removeItem('wc_token');
    localStorage.removeItem('wc_user');
}

async function apiRequest(path, options = {}) {
    const headers = options.headers || {};
    const token = getToken();

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || 'Request failed');
    }

    return data;
}

function showMessage(id, text, type = 'info') {
    const box = document.getElementById(id);
    if (!box) return;
    box.className = `message ${type}`;
    box.textContent = text;
}

function hideMessage(id) {
    const box = document.getElementById(id);
    if (!box) return;
    box.className = 'message';
    box.textContent = '';
}
