import { Router, Request, Response } from "express";
import { NotFoundError, requireAuth } from "@z1maka-common/common";
import { Ticket } from "../models/ticket";

const router = Router();

router.get(
  "/api/ticket/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) throw new NotFoundError();

    res.send(ticket);
  }
);

export { router };
