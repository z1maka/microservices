import { Router, Request, Response } from "express";
import { requireAuth } from "@z1maka-common/common";
import { Ticket } from "../models/ticket";

const router = Router();

router.get("/api/tickets", requireAuth, async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});

  res.send(tickets);
});

export { router };
