document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.token) {
                localStorage.setItem('token', data.token);

                // Redirect based on user type
                if (data.user_type === 'landlord') {
                    window.location.href = 'landlord_dashboard.html';
                } else if (data.user_type === 'tenant') {
                    window.location.href = 'tenant_dashboard.html';
                } else {
                    document.getElementById('error').textContent = 'Invalid user type!';
                }
            } else {
                document.getElementById('error').textContent = data.message || 'Invalid credentials.';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            document.getElementById('error').textContent = 'An error occurred. Please try again.';
        });
});
