# backend-httponly-cookie-auth

Backend authentication API using HttpOnly cookies (no localStorage tokens).

## Features

- Register user
- Login user
- Logout user
- Protected route (get current user)
- JWT authentication
- HttpOnly cookie based auth
- Password hashing using bcrypt
- MongoDB with Mongoose

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- cookie-parser

## Environment Variables

Create a `.env` file:

```bash
PORT=1198
MONGO_URI=mongodb://127.0.0.1:27017/backend_httponly_cookie_auth
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

## API Endpoints

### Register

POST /api/auth/register

```json
{
    "name": "Ashish",
    "email": "ashish@example.com
    ",
    "password": "123456"
}
```

### Login

POST /api/auth/login

```json
{
    "email": "ashish@example.com",
    "password": "123456"
}
```

### Logout

POST /api/auth/logout

### Get Current User (Protected)

GET /api/auth/me

## Notes

- Uses HttpOnly cookies for authentication
- Cookies are automatically handled by browser
- Use `withCredentials: true` in frontend

## Follow Me

- GitHub: https://github.com/a2rp
- Portfolio: https://www.ashishranjan.net
- LinkedIn: https://www.linkedin.com/in/aashishranjan
- Facebook: https://www.facebook.com/theash.ashish/
- YouTube: https://www.youtube.com/@ashishranjan-ashz
