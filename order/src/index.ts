import mongoose from "mongoose";
import { natsClient } from "./nats-client";
import { app } from "./app";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";

const start = async () => {
  if (!process.env.JWT_KEY)
    throw new Error("You should provide JWT_KEY in process.env");
  if (!process.env.MONGO_URI)
    throw new Error("You should provide MONGO_URI in process.env");
  if (!process.env.NATS_URI)
    throw new Error("You should provide NATS_URI in process.env");
  if (!process.env.NATS_CLUSTER_ID)
    throw new Error("You should provide NATS_CLUSTER_ID in process.env");
  if (!process.env.NATS_CLIENT_ID)
    throw new Error("You should provide NATS_CLIENT_ID in process.env");

  try {
    await natsClient.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URI
    );

    natsClient.client.on("close", () => {
      console.log("[NATS]: Connection closed");
      process.exit();
    });

    process.on("SIGINT", () => natsClient.client.close());
    process.on("SIGTERM", () => natsClient.client.close());

    new TicketCreatedListener(natsClient.client).listen();
    new TicketUpdatedListener(natsClient.client).listen();
    new ExpirationCompleteListener(natsClient.client).listen();

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
