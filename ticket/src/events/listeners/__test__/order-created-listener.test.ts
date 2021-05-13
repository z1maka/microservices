import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@z1maka-common/common";
import { Message } from "node-nats-streaming";
import { natsClient } from "../../../nats-client";
import { OrderCreatedListener } from "../order-created-listener";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  const listener = new OrderCreatedListener(natsClient.client);

  const ticket = Ticket.build({
    title: "concert",
    price: 10,
    userId: mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const eventData: OrderCreatedEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: mongoose.Types.ObjectId().toHexString(),
    expiresAt: Date.now().toLocaleString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, msg, ticket, data: eventData };
};

it("should set orderId of the ticket", async function () {
  const { listener, msg, ticket, data } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("should call the ack message", async function () {
  const { listener, msg, data } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("should publish ticket updated event", async function () {
  const { listener, msg, data, ticket } = await setup();

  await listener.onMessage(data, msg);

  expect(natsClient.client.publish).toHaveBeenCalled();

  // arguments in publish function
  const ticketUpdatedData = JSON.parse(
    (natsClient.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(ticketUpdatedData.orderId).toEqual(data.id);
});
