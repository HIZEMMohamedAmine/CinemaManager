document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    
    if(username && password) {
        window.location.href = 'main.html';
    } else {
        document.getElementById('error').style.display = 'block';
    }
});