import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@z1maka-common/common";

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
