const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { app } = require("../src/index");

test("GET / returns the API status", async () => {
    const response = await request(app).get("/");

    assert.equal(response.status, 200);
    assert.equal(response.body.message, "HttpOnly Cookie Auth API is running");
});

test("GET /health returns an ok status", async () => {
    const response = await request(app).get("/health");

    assert.equal(response.status, 200);
    assert.equal(response.body.status, "ok");
});

test("protected route rejects requests without a cookie", async () => {
    const response = await request(app).get("/api/auth/me");

    assert.equal(response.status, 401);
    assert.equal(response.body.message, "Authentication required");
});

test("register validates short passwords before database access", async () => {
    const response = await request(app).post("/api/auth/register").send({
        name: "Ashish",
        email: "ashish@example.com",
        password: "short",
    });

    assert.equal(response.status, 422);
    assert.match(response.body.message, /8 characters/);
});

test("login validates malformed email before database access", async () => {
    const response = await request(app).post("/api/auth/login").send({
        email: "not-an-email",
        password: "password123",
    });

    assert.equal(response.status, 422);
    assert.match(response.body.message, /valid email/);
});
