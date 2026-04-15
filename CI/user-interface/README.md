# Login Page - Dual Role Authentication

## Overview

The login page now supports **two distinct user roles** with different access levels:

1. **User Login** - For regular cinema-goers
2. **Admin Login** - For administrators with elevated privileges

---

## Features

### User Login

- **Email**: `user@cinema.com`
- **Password**: `user123`
- Access: Regular booking, viewing movies, manage reservations
- Redirects to: User dashboard

### Admin Login

- **Email**: `admin@cinema.com`
- **Password**: `admin123`
- **Admin Key**: `SECRET_ADMIN_2024`
- Access: Full admin privileges, manage content, view statistics
- Redirects to: Admin dashboard
- **Note**: Requires a secret admin key for security

---

## UI Components

### Role Toggle Buttons

Located at the top of the login card, users can easily switch between:

- 👤 **Utilisateur** (User) - Default role
- 🛡️ **Administrateur** (Admin) - Requires admin key

### Dynamic Form Fields

- **Email & Password**: Always visible
- **Admin Key**: Only appears when Admin role is selected
- All fields are required for their respective roles

### Visual Indicators

- **Active role** button is highlighted with blue gradient
- **Admin mode** changes the submit button to a darker blue
- **Admin badge** appears below the form showing "🔒 Mode Administrateur"

---

## File Structure

```
login page/
├── index.html          # Login form UI
├── style.css           # Styling and animations
├── script.js           # Frontend logic and form handling
└── api-login.php       # Backend authentication API
```

---

## Backend API

### Endpoint: `api-login.php`

**Request** (POST):

```json
{
  "email": "user@cinema.com",
  "password": "user123",
  "role": "user"
}
```

For admin login, add the admin key:

```json
{
  "email": "admin@cinema.com",
  "password": "admin123",
  "role": "admin",
  "adminKey": "SECRET_ADMIN_2024"
}
```

**Response** (Success):

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "admin@cinema.com",
    "role": "admin",
    "login_time": 1234567890
  },
  "token": "a1b2c3d4e5f6..."
}
```

**Response** (Error):

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

## Styling Highlights

### Color Scheme

- **User Mode**: Blue gradients (default)
- **Admin Mode**: Darker blue (#0047b3)
- Glowing effects and animations for modern feel

### Responsive Design

- Mobile-friendly (94vw width, minimum 440px)
- Touch-friendly buttons and inputs
- Animated transitions and hover effects

---

## Security Considerations

⚠️ **Important**: The current implementation uses demo credentials for demonstration purposes.

### For Production:

1. Replace hardcoded credentials with a database query
2. Use bcrypt or similar for password hashing
3. Implement rate limiting to prevent brute force
4. Use HTTPS only
5. Store admin key securely (environment variable)
6. Implement JWT tokens for session management
7. Add CSRF protection
8. Validate and sanitize all inputs

---

## Testing

### Test User Login:

1. Click on **Utilisateur** (User) button
2. Enter email: `user@cinema.com`
3. Enter password: `user123`
4. Click "Se connecter"

### Test Admin Login:

1. Click on **Administrateur** (Admin) button
2. Enter email: `admin@cinema.com`
3. Enter password: `admin123`
4. Enter admin key: `SECRET_ADMIN_2024`
5. Click "Se connecter"

---

## Future Enhancements

- [ ] Social login integration (Google, Facebook)
- [ ] Two-factor authentication
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Remember me functionality (currently UI only)
- [ ] Login history and activity logs
- [ ] Role-based redirects after login
- [ ] Database integration for user management

---

## Support

For issues or questions about the dual authentication system, please contact the development team.
