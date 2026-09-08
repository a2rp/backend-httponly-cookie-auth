# HttpOnly Cookie Auth API

## Purpose

This service demonstrates session-style authentication backed by a signed JWT stored in an HttpOnly cookie. The browser sends the cookie automatically, while frontend JavaScript cannot read the token.

## Authentication flow

1. Register or log in with email and password.
2. The API signs a seven-day JWT and sets it as the `token` cookie.
3. Protected requests send that cookie with `credentials: include`.
4. The auth middleware verifies the token and loads the user without the password field.
5. Logout clears the cookie using the same path and security attributes.

## Environment

Copy `.env.example` to `.env` and provide a real MongoDB connection string and a random `JWT_SECRET` with at least 32 characters. Never commit `.env`.

`CLIENT_ORIGINS` accepts a comma-separated list of trusted frontend origins. In production, use HTTPS and set `NODE_ENV=production`; cookies then receive the `Secure` attribute.

## Endpoints

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/` | No | API status |
| GET | `/health` | No | Health response |
| POST | `/api/auth/register` | No | Create a user and set cookie |
| POST | `/api/auth/login` | No | Authenticate and set cookie |
| POST | `/api/auth/logout` | No | Clear the auth cookie |
| GET | `/api/auth/me` | Cookie | Return the current user |

Authentication endpoints have a rate limit of 30 requests per 15 minutes per client. Request bodies are limited to 10 KB.

## Security decisions

- Passwords are hashed with bcrypt before persistence.
- JWTs are stored in an HttpOnly cookie instead of local storage.
- Production cookies are Secure and use a configurable SameSite policy.
- CORS allows only configured origins and credentials.
- Helmet provides baseline security headers.
- Internal errors and token verification details are not returned to clients.
- Validation rejects malformed emails and passwords shorter than eight characters.

## Local setup

```bash
npm install
copy .env.example .env
npm run dev
```

The default server port is `1198`.

## Frontend request example

```js
await fetch("http://localhost:1198/api/auth/me", {
    credentials: "include",
});
```

## License

MIT. See [LICENSE](./LICENSE).
