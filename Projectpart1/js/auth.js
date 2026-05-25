function handleSignup() {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    const msgBox = document.getElementById('authMessage');

    // Reset message box to default error style
    msgBox.style.display = 'block';
    msgBox.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'; 
    msgBox.style.color = '#ff6b6b';
    msgBox.style.border = '1px solid #ff6b6b';

    // 1. Check for empty fields
    if (!username || !email || !password || !confirm) {
        msgBox.innerText = 'Failure: All fields are required.';
        return;
    }

    // 2. Check for the '@' symbol in the email
    if (!email.includes('@')) {
        msgBox.innerText = 'Failure: Please enter a valid email containing "@"';
        return;
    }

    // 3. Check password length
    if (password.length < 8) {
        msgBox.innerText = 'Failure: Password must be at least 8 characters.';
        return;
    }

    // 4. Check if passwords match
    if (password !== confirm) {
        msgBox.innerText = 'Failure: Passwords do not match.';
        return;
    }

    // 5. Success State
    // If it passes all checks, change the styling to green and show success
    msgBox.style.backgroundColor = 'rgba(16, 185, 129, 0.2)'; 
    msgBox.style.color = '#4ade80';
    msgBox.style.border = '1px solid #4ade80';
    msgBox.innerText = 'Success! Account created. Redirecting...';

    // Simulate network delay, then redirect to fixtures page
    setTimeout(() => {
        window.location.href = 'fixtures.html';
    }, 1500);
}