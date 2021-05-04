import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsClient } from "../../nats-client";

it("should has a route handler listening to /api/ticket for post request", async function () {
  const response = await request(app).post("/api/ticket").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user signed in", async function () {
  await request(app).post("/api/ticket").send({}).expect(401);
});

it("should return a status other than 401 if user signed in", async function () {
  const response = await request(app)
    .post("/api/ticket")
    .set("Cookie", global.signin())
    .send({});
  expect(response.status).not.toEqual(401);
});

it("should return an error if invalid title is provided", async function () {
  await request(app)
    .post("/api/ticket")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post("/api/ticket")
    .set("Cookie", global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it("should return an error if invalid price is provided", async function () {
  await request(app)
    .post("/api/ticket")
    .set("Cookie", global.signin())
    .send({
      title: "title",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/ticket")
    .set("Cookie", global.signin())
    .send({
      title: "title",
    })
    .expect(400);
});

it("should create a ticket with valid input", async function () {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/ticket")
    .set("Cookie", global.signin())
    .send({
      title: "title",
      price: 20,
    })
    .expect(201);

  tickets = await Ticket.find({});

  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual("title");
});

it("should publish an event", async function () {
  await request(app)
    .post("/api/ticket")
    .set("Cookie", global.signin())
    .send({
      title: "title",
      price: 20,
    })
    .expect(201);

  expect(natsClient.client.publish).toHaveBeenCalled();
});
