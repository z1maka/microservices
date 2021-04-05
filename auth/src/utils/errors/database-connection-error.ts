import {CustomError} from "./custom-error";

export class DatabaseConnectionError extends CustomError{
    statusCode = 500
    msg = 'Error connecting to database'
    constructor() {
      super("Error connecting to DB");
      Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
    public serializeErrors = () => {
        return [{ message: this.msg }]
    }
}