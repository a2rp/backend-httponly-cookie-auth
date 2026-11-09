# backend-httponly-cookie-auth

Secure JWT authentication API using HttpOnly cookies, bcrypt password hashing, MongoDB, and Express.

## Features

- User registration, login, logout, and current-user endpoints
- JWT stored in an HttpOnly cookie
- Secure production cookie configuration
- Bcrypt password hashing
- Configurable CORS with credentials
- Helmet security headers
- Authentication rate limiting
- Request validation and safe error responses
- MongoDB persistence through Mongoose

## Stack

- Node.js and Express
- MongoDB and Mongoose
- JSON Web Token
- bcryptjs
- cookie-parser
- Helmet
- express-rate-limit

## Setup

```bash
npm install
copy .env.example .env
```

Replace the `JWT_SECRET` placeholder with a unique random value of at least 32 characters. In production, set `NODE_ENV=production` and provide the exact trusted frontend origins in `CLIENT_ORIGINS`.

Start the development server:

```bash
npm run dev
```

The default port is `1198`.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | Server port, defaults to `1198` |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Unique random signing secret, minimum 32 characters |
| `NODE_ENV` | No | Use `production` to enable Secure cookies |
| `CLIENT_ORIGINS` | No | Comma-separated trusted frontend origins |
| `COOKIE_SAME_SITE` | No | `strict`, `lax`, or `none`; defaults to `lax`. `none` requires production Secure cookies. |

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/` | API status |
| GET | `/health` | Health response |
| POST | `/api/auth/register` | Register and authenticate a user |
| POST | `/api/auth/login` | Login and set the auth cookie |
| POST | `/api/auth/logout` | Clear the auth cookie |
| GET | `/api/auth/me` | Get the authenticated user |

Use `credentials: "include"` from a browser frontend so cookies are sent with requests.

Passwords must contain at least 8 characters and no more than 72 UTF-8 bytes. They are hashed with bcrypt before storage. Authentication routes are limited to 30 requests per IP every 15 minutes; this in-memory limit is per server process, so multi-instance deployments need a shared rate-limit store.

The JWT and cookie expire after seven days. Logging out clears the browser cookie; it does not revoke a copied token before expiry.


## License

MIT. See [LICENSE](./LICENSE).

## Author

Ashish Ranjan, Full-Stack Web Developer

- Portfolio: https://ashishranjan.in/
- GitHub: https://github.com/a2rp
- LinkedIn: https://www.linkedin.com/in/aashishranjan
- Email: mailto:ash.ranjan09@gmail.com

## Support

- Support page: https://a2rp-donation-page.netlify.app/
- Buy Me a Coffee: https://buymeacoffee.com/a2rp
- Patreon: https://www.patreon.com/a2rp
