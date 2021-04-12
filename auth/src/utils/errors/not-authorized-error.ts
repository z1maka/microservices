import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
  statusCode = 401;
  constructor(public message: string = "Not Authorized") {
    super(message);
    Object.setPrototypeOf(this, NotAuthorizedError);
  }

  serializeErrors = (): { message: string; field?: string }[] => {
    return [{ message: this.message }];
  };
}
