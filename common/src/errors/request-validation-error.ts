import { CustomError } from "./custom-error";
import { ValidationError } from "express-validator";

export class RequestValidatorError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters");
    Object.setPrototypeOf(this, RequestValidatorError.prototype);
  }

  public serializeErrors = () => {
    return this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
  };
}
