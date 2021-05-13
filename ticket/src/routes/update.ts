import { Router, Request, Response } from "express";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@z1maka-common/common";
import { Ticket } from "../models/ticket";
import { body } from "express-validator";
import { natsClient } from "../nats-client";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";

const router = Router();

router.put(
  "/api/ticket/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than zero"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) throw new NotFoundError();

    if (ticket.orderId)
      throw new BadRequestError("Cannot edit a reserved ticket!");

    if (ticket.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    const { title, price } = req.body;

    ticket.set({ title, price });
    await ticket.save();

    new TicketUpdatedPublisher(natsClient.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.send(ticket);
  }
);

export { router };
