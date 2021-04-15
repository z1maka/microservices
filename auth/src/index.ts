import mongoose from "mongoose";
import { app } from "./app";

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
