let currentRole = 'user';

function setRole(role) {
  currentRole = role;
  const isAdmin = role === 'admin';

  document.getElementById('btn-user').classList.toggle('active', !isAdmin);
  document.getElementById('btn-admin').classList.toggle('active', isAdmin);

  const adminKeyGroup = document.getElementById('admin-key-group');
  const adminBadge    = document.getElementById('admin-badge');
  const submitBtn     = document.getElementById('submit-btn');
  const title         = document.getElementById('card-title');
  const sub           = document.getElementById('card-sub');

  adminKeyGroup.style.display = isAdmin ? 'block' : 'none';
  document.getElementById('admin-key').required = isAdmin;

  adminBadge.classList.toggle('show', isAdmin);
  submitBtn.classList.toggle('admin-mode', isAdmin);

  title.textContent = isAdmin ? 'Espace Admin' : 'Bienvenue';
  sub.textContent   = isAdmin
    ? 'Accès réservé aux administrateurs'
    : 'Connectez-vous à votre espace';
}

function togglePwd() {
  const pwd = document.getElementById('password');
  const icon = document.getElementById('eye-icon');
  if (pwd.type === 'password') {
    pwd.type = 'text';
    icon.innerHTML = `
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>`;
  } else {
    pwd.type = 'password';
    icon.innerHTML = `
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>`;
  }
}

function showToast(msg, duration = 3000) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

function handleSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const btn   = document.getElementById('submit-btn');

  btn.textContent = 'Connexion…';
  btn.disabled = true;

  // Prepare login data
  const loginData = {
    email: email,
    password: password,
    role: currentRole
  };

  // If admin, include admin key
  if (currentRole === 'admin') {
    const adminKey = document.getElementById('admin-key').value;
    if (!adminKey) {
      btn.textContent = 'Se connecter';
      btn.disabled = false;
      showToast('⚠ Clé d\'accès administrateur requise', 3000);
      return;
    }
    loginData.adminKey = adminKey;
  }

  // Send login request
  fetch('./api-login.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData)
  })
  .then(response => response.json())
  .then(data => {
    btn.textContent = 'Se connecter';
    btn.disabled = false;

    if (data.success) {
      const role = currentRole === 'admin' ? 'Administrateur' : 'Utilisateur';
      showToast(`✓ Connecté en tant que ${role}`, 2000);
      
      // Redirect based on role
      setTimeout(() => {
        if (currentRole === 'admin') {
          window.location.href = './admin-dashboard.html';
        } else {
          window.location.href = './user-dashboard.html';
        }
      }, 2000);
    } else {
      showToast(`✗ ${data.message || 'Erreur de connexion'}`, 3000);
    }
  })
  .catch(error => {
    btn.textContent = 'Se connecter';
    btn.disabled = false;
    console.error('Error:', error);
    showToast('✗ Erreur réseau', 3000);
  });
}
