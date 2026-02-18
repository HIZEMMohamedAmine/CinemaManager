document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
        link.addEventListener('click', function() {
            links.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

logout = function() {
    window.top.location.href = 'login.html';
}