import mongoose from "mongoose";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import {
  OrderStatus,
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@z1maka-common/common";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";

const router = Router();
const EXPIRATION_WINDOW_SECONDS = 60 * 15; // 15 minutes

router.post(
  "/api/order",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError();

    const existingOrder = await ticket.isReserved();
    if (existingOrder) throw new BadRequestError("Ticket is already reserved");

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    // Publish an event

    res.status(201).send(order);
  }
);

export { router };
