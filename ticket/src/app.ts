import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { json } from "body-parser";

import {
  errorHandler,
  currentUser,
  NotFoundError,
} from "@z1maka-common/common";
import { router as createTicket } from "./routes/create";
import { router as getOneTicket } from "./routes/get-one";
import { router as getList } from "./routes/get-list";
import { router as updateTicket } from "./routes/update";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);
// routes
app.use(createTicket);
app.use(getOneTicket);
app.use(getList);
app.use(updateTicket);

app.all("*", async (req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundError();
});
// error handler
app.use(errorHandler);

export { app };
