import { Ticket } from "../ticket";

it("should implement optimistic concurrency control", async function (done) {
  const ticket = Ticket.build({
    title: "title",
    price: 50,
    userId: "123",
  });
  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make two separate changes to ticket
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 50 });

  // save fest fetched ticket
  await firstInstance!.save();

  // save second ticket

  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }

  throw new Error("Should not reached this line");
});

it("should increment the version number on multiple saves", async function () {
  const ticket = Ticket.build({
    title: "title",
    price: 50,
    userId: "123",
  });
  await ticket.save();

  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
