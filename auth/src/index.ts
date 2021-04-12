import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user";
import { signupRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { errorHandler } from "./middleware/errorHandler";
import { NotFoundError } from "./utils/errors/not-found-error";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

// routes
app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.all("*", async (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError());
});
// error handler
app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("You should provide JWT_KEY in process.env");
  }

  try {
    await mongoose
      .connect("mongodb://auth-mongo-srv:27017/auth", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then(() => {
        console.log("[MONGODB]: Connected");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (e) {
    console.error(e);
  }

  app.listen(3000, () => {
    console.log(`[APP]: Server is listening on http://localhost:3000`);
  });
};

start();
