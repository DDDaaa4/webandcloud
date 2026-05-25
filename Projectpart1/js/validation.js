document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Stop page reload

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const msgBox = document.getElementById('statusMessage');

    // Reset classes
    msgBox.className = 'message';

    // Validation Rules
    if (email === '' || password === '') {
        msgBox.textContent = 'All fields are required.';
        msgBox.classList.add('error');
        return;
    }

    if (!email.includes('@')) {
        msgBox.textContent = 'Please enter a valid email containing "@".';
        msgBox.classList.add('error');
        return;
    }

    if (password.length < 8) {
        msgBox.textContent = 'Password must be at least 8 characters long.';
        msgBox.classList.add('error');
        return;
    }

    // Success State
    msgBox.textContent = 'Account created successfully! Redirecting...';
    msgBox.classList.add('success');
    
    // Simulate redirection to fixtures page after 1.5 seconds
    setTimeout(() => {
        window.location.href = 'fixtures.html';
    }, 1500);
});