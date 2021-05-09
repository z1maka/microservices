import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("should fetch order", async function () {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = global.signin();
  const { body: order } = await request(app)
    .post("/api/order")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/order/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  await request(app)
    .get(`/api/order/${order.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(401);

  expect(fetchedOrder.id).toEqual(order.id);
});
