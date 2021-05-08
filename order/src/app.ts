import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { json } from "body-parser";

import {
  errorHandler,
  currentUser,
  NotFoundError,
} from "@z1maka-common/common";
import { router as getOrderList } from "./routes/get-list";
import { router as getOrder } from "./routes/get-one";
import { router as createOrder } from "./routes/create";
import { router as deleteOrder } from "./routes/delete";

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
app.use(getOrderList);
app.use(createOrder);
app.use(deleteOrder);
app.use(getOrder);

app.all("*", async (req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundError();
});
// error handler
app.use(errorHandler);

export { app };
