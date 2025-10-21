# Authentication API Documentation

## Overview

This API provides secure authentication functionality with JWT tokens, bcrypt password hashing, and role-based access control.

## Base URL

```
http://localhost:3000/api/auth
```

## Features

- ✅ User registration with validation
- ✅ User login with JWT token generation
- ✅ Password hashing using bcrypt
- ✅ JWT token validation
- ✅ Role-based access control (admin/user)
- ✅ Secure responses with proper HTTP status codes
- ✅ Comprehensive error handling

---

## Authentication Routes

### 1. Register New User

**Endpoint:** `POST /auth/register`  
**Access:** Public

**Description:** Register a new user with username, email, and password. Passwords are automatically hashed using bcrypt.

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user", // Optional: "user" or "admin" (default: "user")
  "avatar_url": "https://example.com/avatar.jpg" // Optional
}
```

**Validation Rules:**

- `username`: Required, 3-50 characters, must be unique
- `email`: Required, valid email format, must be unique
- `password`: Required, minimum 6 characters
- `role`: Optional, must be "user" or "admin"
- `avatar_url`: Optional, max 255 characters

**Success Response (201 Created):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "avatar_url": "https://example.com/avatar.jpg",
      "createdAt": "2025-10-21T10:30:00.000Z",
      "updatedAt": "2025-10-21T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

**400 Bad Request - Missing Fields:**

```json
{
  "success": false,
  "message": "Please provide username, email, and password"
}
```

**400 Bad Request - Invalid Email:**

```json
{
  "success": false,
  "message": "Please provide a valid email address"
}
```

**400 Bad Request - Short Password:**

```json
{
  "success": false,
  "message": "Password must be at least 6 characters long"
}
```

**400 Bad Request - Email Exists:**

```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

**400 Bad Request - Username Taken:**

```json
{
  "success": false,
  "message": "Username is already taken"
}
```

---

### 2. Login User

**Endpoint:** `POST /auth/login`  
**Access:** Public

**Description:** Login with email and password. Returns JWT token for authenticated requests.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "avatar_url": "https://example.com/avatar.jpg",
      "createdAt": "2025-10-21T10:30:00.000Z",
      "updatedAt": "2025-10-21T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

**400 Bad Request - Missing Credentials:**

```json
{
  "success": false,
  "message": "Please provide email and password"
}
```

**401 Unauthorized - Invalid Credentials:**

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3. Get Current User

**Endpoint:** `GET /auth/me`  
**Access:** Private (requires authentication)

**Description:** Get information about the currently logged-in user.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "avatar_url": "https://example.com/avatar.jpg",
    "createdAt": "2025-10-21T10:30:00.000Z",
    "updatedAt": "2025-10-21T10:30:00.000Z"
  }
}
```

**Error Responses:**

**401 Unauthorized - No Token:**

```json
{
  "success": false,
  "message": "Not authorized, no token provided"
}
```

**401 Unauthorized - Invalid Token:**

```json
{
  "success": false,
  "message": "Invalid token"
}
```

**401 Unauthorized - Expired Token:**

```json
{
  "success": false,
  "message": "Token expired"
}
```

**404 Not Found:**

```json
{
  "success": false,
  "message": "User not found"
}
```

---

## Role-Based Access Control

### Available Roles

- `user` - Standard user (default)
- `admin` - Administrator with elevated privileges

### Middleware Functions

#### 1. `protect`

Verifies JWT token and attaches user to request.

**Usage:**

```javascript
router.get("/protected-route", protect, controller);
```

#### 2. `authorize(...roles)`

Restricts access to specific roles.

**Usage:**

```javascript
// Only users
router.get("/user-only", protect, authorize("user"), controller);

// Only admins
router.get("/admin-only", protect, authorize("admin"), controller);

// Both users and admins
router.get("/both", protect, authorize("user", "admin"), controller);
```

#### 3. `adminOnly`

Shortcut for admin-only routes.

**Usage:**

```javascript
router.delete("/admin-route", protect, adminOnly, controller);
```

**Error Response (403 Forbidden):**

```json
{
  "success": false,
  "message": "Access denied. Admin privileges required"
}
```

---

## Security Features

### Password Hashing

- Passwords are hashed using **bcrypt** with 10 salt rounds
- Hashing happens automatically via Sequelize hooks
- Plain text passwords are never stored

### JWT Tokens

- Tokens are signed with a secret key
- Default expiration: 7 days (configurable)
- Tokens include user ID in payload

### Validation

- Email format validation
- Password length validation (min 6 characters)
- Username length validation (3-50 characters)
- Unique constraints on email and username

---

## Example Usage

### JavaScript/Fetch Example

**Register:**

```javascript
const register = async () => {
  const response = await fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "johndoe",
      email: "john@example.com",
      password: "securePassword123",
    }),
  });

  const data = await response.json();
  console.log(data);

  // Store token for authenticated requests
  localStorage.setItem("token", data.data.token);
};
```

**Login:**

```javascript
const login = async () => {
  const response = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "john@example.com",
      password: "securePassword123",
    }),
  });

  const data = await response.json();
  localStorage.setItem("token", data.data.token);
};
```

**Get Current User:**

```javascript
const getMe = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:3000/api/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  console.log(data);
};
```

---

## Environment Variables

Required environment variables in `.env`:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=questify_db
DB_PORT=3306

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Client
CLIENT_URL=http://localhost:5173
```

---

## HTTP Status Codes

| Code | Meaning                              |
| ---- | ------------------------------------ |
| 200  | Success                              |
| 201  | Created (registration successful)    |
| 400  | Bad Request (validation error)       |
| 401  | Unauthorized (authentication failed) |
| 403  | Forbidden (insufficient permissions) |
| 404  | Not Found                            |
| 500  | Internal Server Error                |

---

## Testing the API

### Using cURL

**Register:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Get Current User:**

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## Notes

1. **Password Security**: Passwords are automatically hashed before storing. Never send or store plain text passwords.

2. **Token Storage**: Store JWT tokens securely (localStorage for web, secure storage for mobile).

3. **Token Expiration**: Tokens expire after 7 days by default. Implement token refresh if needed.

4. **CORS**: The API is configured to accept requests from `http://localhost:5173`. Update `CLIENT_URL` in `.env` for production.

5. **Error Handling**: All endpoints return consistent JSON responses with `success` boolean and appropriate `message`.

6. **Role Assignment**: By default, new users get the "user" role. Only existing admins should be able to create new admin accounts.
