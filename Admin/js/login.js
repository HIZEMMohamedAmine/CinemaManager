document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    var username = document.getElementById('username').value.trim();
    var password = document.getElementById('password').value;
    var errorBox = document.getElementById('error');

    errorBox.style.display = 'none';

    if (!username || !password) {
        errorBox.textContent = 'Username and password are required';
        errorBox.style.display = 'block';
        return;
    }

    try {
        var response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        });

        var payload = await response.json();

        if (!response.ok) {
            throw new Error(payload.error || 'Invalid credentials');
        }

        localStorage.setItem('adminUser', JSON.stringify(payload.user));
        window.location.href = 'main.html';
    } catch (error) {
        errorBox.textContent = error.message || 'Login failed';
        errorBox.style.display = 'block';
    }
});