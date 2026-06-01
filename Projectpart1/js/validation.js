// Automatically reset cart on load for the signup page (new session)
window.onload = function() {
    // 1. Reset the cart memory to 0
    localStorage.setItem('cartCount', '0');
    
    // 2. Hide the red badge on the UI
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.style.display = 'none';
        badge.innerText = '0';
    }
};

function handleSignup() {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    const msgBox = document.getElementById('authMessage');

    // Display the box and set default error styling
    msgBox.style.display = 'block';
    msgBox.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
    msgBox.style.color = '#ff6b6b';
    msgBox.style.border = '1px solid #ff6b6b';

    // Validation Rules
    if (!username || !email || !password || !confirm) {
        msgBox.innerText = 'Failure: All fields are required.';
        return;
    }

    if (!email.includes('@')) {
        msgBox.innerText = 'Failure: Please enter a valid email containing "@"';
        return;
    }

    if (password.length < 8) {
        msgBox.innerText = 'Failure: Password must be at least 8 characters.';
        return;
    }

    if (password !== confirm) {
        msgBox.innerText = 'Failure: Passwords do not match.';
        return;
    }

    // Success State
    msgBox.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
    msgBox.style.color = '#4ade80';
    msgBox.style.border = '1px solid #4ade80';
    msgBox.innerText = 'Success! Account created. Redirecting...';

    // Redirect to features after 1.5 seconds
    setTimeout(() => {
        window.location.href = 'features.html';
    }, 1500);
}