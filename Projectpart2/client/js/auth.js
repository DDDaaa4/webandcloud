function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function handleSignup() {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!username || !email || !password || !confirmPassword) {
        showMessage('authMessage', 'All fields are required.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage('authMessage', 'Please enter a valid email address.', 'error');
        return;
    }

    if (password.length < 8) {
        showMessage('authMessage', 'Password must be at least 8 characters.', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showMessage('authMessage', 'Passwords do not match.', 'error');
        return;
    }

    try {
        showMessage('authMessage', 'Creating account...', 'info');
        const data = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });
        setSession(data.token, data.user);
        showMessage('authMessage', 'Account created successfully. Redirecting...', 'success');
        setTimeout(() => window.location.href = 'features.html', 900);
    } catch (error) {
        showMessage('authMessage', error.message, 'error');
    }
}

async function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showMessage('authMessage', 'Email and password are required.', 'error');
        return;
    }

    try {
        showMessage('authMessage', 'Logging in...', 'info');
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        setSession(data.token, data.user);
        showMessage('authMessage', 'Login successful. Redirecting...', 'success');
        setTimeout(() => window.location.href = 'features.html', 700);
    } catch (error) {
        showMessage('authMessage', error.message, 'error');
    }
}
