import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { natsClient } from "../../nats-client";

it("should return 404 if ticket does not exist", async function () {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/ticket/${id}`)
    .set("Cookie", global.signin())
    .send({ title: "title", price: 20 })
    .expect(404);
});

it("should return 401 if user is not authenticated", async function () {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/ticket/${id}`)
    .send({ title: "title", price: 20 })
    .expect(401);
});

it("should return 401 if user does not own the ticket", async function () {
  const response = await request(app)
    .post("/api/ticket")
    .set("Cookie", global.signin())
    .send({
      title: "title",
      price: 10,
    });

  await request(app)
    .put(`/api/ticket/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({ title: "new", price: 20 })
    .expect(401);
});

it("should return 400 if user provides an invalid title or price", async function () {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/ticket")
    .set("Cookie", cookie)
    .send({
      title: "title",
      price: 10,
    });

  await request(app)
    .put(`/api/ticket/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 20 })
    .expect(400);

  await request(app)
    .put(`/api/ticket/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "new", price: -20 })
    .expect(400);
});

it("should update the ticket if user provides valid inputs", async function () {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/ticket")
    .set("Cookie", cookie)
    .send({
      title: "title",
      price: 10,
    });

  await request(app)
    .put(`/api/ticket/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "new", price: 10 })
    .expect(200);

  const response2 = await request(app)
    .get(`/api/ticket/${response.body.id}`)
    .set("Cookie", cookie)
    .send();

  expect(response.body.id).toEqual(response2.body.id);
  expect(response2.body.title).toEqual("new");
  expect(response2.body.price).toEqual(10);
});

it("should publish an event", async function () {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/ticket")
    .set("Cookie", cookie)
    .send({
      title: "title",
      price: 10,
    });

  await request(app)
    .put(`/api/ticket/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "new", price: 10 })
    .expect(200);

  expect(natsClient.client.publish).toHaveBeenCalled();
});
