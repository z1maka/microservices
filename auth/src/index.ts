import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY)
    throw new Error("You should provide JWT_KEY in process.env");
  if (!process.env.MONGO_URI)
    throw new Error("You should provide MONGO_URI in process.env");

  try {
    await mongoose
      .connect(process.env.MONGO_URI, {
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
