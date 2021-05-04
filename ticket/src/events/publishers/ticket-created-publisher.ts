import { Publisher, Subjects, TicketCreatedEvent } from "@z1maka-common/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
