import request from "supertest";
import { app } from "../../app";

const createOne = () => {
  return request(app)
    .post("/api/ticket")
    .set("Cookie", global.signin())
    .send({ title: "title", price: 20 });
};

it("should return a list of tickets", async function () {
  await createOne();
  await createOne();
  await createOne();

  const response = await request(app)
    .get("/api/tickets")
    .set("Cookie", global.signin())
    .send()
    .expect(200);

  expect(response.body.length).toEqual(3);
});
