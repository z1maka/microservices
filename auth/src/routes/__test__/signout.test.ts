import request from "supertest";
import { app } from "../../app";

it("should clear cookie after singing out", async function () {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test.test@gmail.com", password: "1234567" })
    .expect(201);

  const response = await request(app).get("/api/users/signout").expect(200);

  expect(response.get("Set-Cookie")[0]).toEqual(
    "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
