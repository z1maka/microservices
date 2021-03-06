import express, { NextFunction, Request, Response } from "express";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import "express-async-errors";
import { currentUserRouter } from "./routes/current-user";
import { signupRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { errorHandler, NotFoundError } from "@z1maka-common/common";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

// routes
app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.all("*", async (req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundError();
});
// error handler
app.use(errorHandler);

export { app };
