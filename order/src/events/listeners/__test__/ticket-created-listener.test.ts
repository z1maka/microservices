import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "@z1maka-common/common";
import { TicketCreatedListener } from "../ticket-created-listener";
import { natsClient } from "../../../nats-client";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  const listener = new TicketCreatedListener(natsClient.client);
  const fakeEventData: TicketCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, msg, data: fakeEventData };
};

it("should create and save a ticket", async function () {
  const { listener, msg, data } = await setup();

  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("should ack the message ", async function () {
  const { listener, msg, data } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
