import request from "supertest";
import { app } from "../../app";

it("should return 201 status on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "zhenya.masnyy@gmail.com", password: "1234567" })
    .expect(201);
});

it("should return 400 status with invalid email", async function () {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "asdasdasd", password: "1234567" })
    .expect(400);
});

it("should return 400 status with invalid password", async function () {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "zhenya.masnyy@gmail.com", password: "1" })
    .expect(400);
});

it("should return 400 status with missing email and password", async function () {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "zhenya.masnyy@gmail.com",
    })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({
      password: "234234234",
    })
    .expect(400);
});

it("should disallow duplicate email", async function () {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "zhenya.masnyy@gmail.com",
      password: "1234567",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "zhenya.masnyy@gmail.com",
      password: "1234567",
    })
    .expect(400);
});

it("should set a cookie after successful signup", async function () {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "zhenya.masnyy@gmail.com",
      password: "1234567",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
