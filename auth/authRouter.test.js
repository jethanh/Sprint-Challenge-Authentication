const request = require("supertest");
const server = require("../api/server");
const db = require("../database/dbConfig");

beforeEach(() => {
  return db.migrate
    .rollback()
    .then(() => db.migrate.latest())
    .then(() => db.seed.run());
});

test("POST /api/auth/register to be successful", async () => {
  const res = await request(server)
    .post("/api/auth/register")
    .send({ username: "test12", password: "pogchamp" });
  expect(res.status).toBe(200)
  expect(res.body).toHaveProperty("message");
});

test("POST /api/auth/login to be successful", async () => {
  const register = await request(server)
    .post("/api/auth/register")
    .send({ username: "test12", password: "pogchamp" });
  const res = await request(server)
    .post("/api/auth/login")
    .send({ username: "test12", password: "pogchamp" });
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("token");
});

test("GET /api/jokes to get jokes", async () => {
  const register = await request(server)
    .post("/api/auth/register")
    .send({ username: "test12", password: "pogchamp" });
  const login = await request(server)
    .post("/api/auth/login")
    .send({ username: "test12", password: "pogchamp" });
  const res = await request(server)
    .get("/api/jokes")
    .set("authorization", login.body.token);
  expect(res.body).toHaveLength(20);
  expect(res.body[0]).toHaveProperty("id");
});