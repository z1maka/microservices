import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from "@z1maka-common/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
