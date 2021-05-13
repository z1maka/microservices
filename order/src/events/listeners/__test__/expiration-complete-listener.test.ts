import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsClient } from "../../../nats-client";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { Order } from "../../../models/order";
import { ExpirationCompleteEvent, OrderStatus } from "@z1maka-common/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsClient.client);

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "title",
    price: 10,
  });
  await ticket.save();

  const order = Order.build({
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const eventData: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { order, msg, listener, ticket, data: eventData };
};

it("should update the order status to cancelled", async function () {
  const { listener, msg, order, data, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("should emit order:cancelled event", async function () {
  const { listener, msg, order, data, ticket } = await setup();

  await listener.onMessage(data, msg);
  expect(natsClient.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsClient.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

it("should ack the message", async function () {
  const { listener, msg, order, data, ticket } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
