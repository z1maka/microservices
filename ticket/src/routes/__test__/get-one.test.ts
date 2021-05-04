import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("should return a 404 if ticket is not found", async function () {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get(`/api/ticket/${id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(404);
});

it("should return a ticket if it is found", async function () {
  const response = await request(app)
    .post("/api/ticket")
    .set("Cookie", global.signin())
    .send({
      title: "title",
      price: 20,
    })
    .expect(201);

  const response2 = await request(app)
    .get(`/api/ticket/${response.body.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(200);

  expect(response.body).toEqual(response2.body);
});
