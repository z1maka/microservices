import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@z1maka-common/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findByEvent(data);
    if (!ticket) throw new Error("Ticket not found");

    const { price, title } = data;
    ticket.set({ price, title });
    await ticket.save();

    msg.ack();
  }
}
