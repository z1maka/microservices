import mongoose from "mongoose";
import { TicketUpdatedEvent } from "@z1maka-common/common";
import { natsClient } from "../../../nats-client";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { Ticket } from "../../../models/ticket";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new TicketUpdatedListener(natsClient.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 10,
  });

  await ticket.save();

  const fakeEventData: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "updated-title",
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { data: fakeEventData, msg, listener, ticket };
};

it("should find, update and save a ticket", async function () {
  const { msg, ticket, listener, data } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("should ack the message", async function () {
  const { msg, listener, data } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("should not call ack if the event has a skipped version number", async function () {
  const { msg, listener, data } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
