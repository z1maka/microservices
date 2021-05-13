import { natsClient } from "./nats-client";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const start = async () => {
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

    new OrderCreatedListener(natsClient.client).listen();
  } catch (e) {
    console.error(e);
  }
};

start();
