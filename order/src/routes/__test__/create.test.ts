import mongoose from "mongoose";
import request from "supertest";
import { OrderStatus } from "@z1maka-common/common";

import { natsClient } from "../../nats-client";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";

it("should return an error if the ticket doesnt exist ", async function () {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post("/api/order")
    .set("Cookie", global.signin())
    .send({ ticketId })
    .expect(404);
});

it("should return an error if the ticket is already reserved", async function () {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: "12312asd",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/order")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("should  reserve the ticket", async function () {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/order")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("should publish order created event", async function () {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/order")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsClient.client.publish).toHaveBeenCalled();
});
