import { Publisher, Subjects, TicketUpdatedEvent } from "@z1maka-common/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
