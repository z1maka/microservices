import nats, { Stan } from "node-nats-streaming";

class NatsClient {
  private _client?: Stan;

  get client(): Stan {
    if (!this._client)
      throw new Error("Cannot access NATS client before connecting!");
    return this._client;
  }

  connect = (
    clusterId: string,
    clientId: string,
    url: string
  ): Promise<void> => {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this._client!.on("connect", () => {
        console.log("[NATS]: Connected");
        resolve();
      });

      this._client!.on("error", (err) => {
        console.log("[NATS]: Error occurred", err);
        reject(err);
      });
    });
  };
}

export const natsClient = new NatsClient();
