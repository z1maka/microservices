import request from "supertest";
import { app } from "../../app";

it("should fail when a email that doesn't exist is supplied", async function () {
  return request(app)
    .post("/api/users/signin")
    .send({ email: "test.test@gmail.com", password: "1234567" })
    .expect(400);
});

it("should fail when an incorrect password is supplied", async function () {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test.test@gmail.com", password: "1234567" })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({ email: "test.test@gmail.com", password: "1234" })
    .expect(400);
});

it("should response with a cookie", async function () {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test.test@gmail.com", password: "1234567" })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({ email: "test.test@gmail.com", password: "1234567" })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
