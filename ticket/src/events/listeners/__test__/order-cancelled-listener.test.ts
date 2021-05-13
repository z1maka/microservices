import mongoose from "mongoose";
import { OrderCancelledEvent } from "@z1maka-common/common";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Ticket } from "../../../models/ticket";
import { natsClient } from "../../../nats-client";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new OrderCancelledListener(natsClient.client);

  const orderId = mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({
    title: "title",
    price: 10,
    userId: mongoose.Types.ObjectId().toHexString(),
  });
  ticket.set({ orderId });
  await ticket.save();

  const eventData: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data: eventData, ticket, listener };
};

it("should update the ticket, publish an event and ack the message", async function () {
  const { msg, listener, data, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();

  expect(msg.ack).toHaveBeenCalled();
  expect(natsClient.client.publish).toHaveBeenCalled();
});
