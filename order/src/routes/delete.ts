import { Request, Response, Router } from "express";
import {
  requireAuth,
  OrderStatus,
  NotFoundError,
  NotAuthorizedError,
} from "@z1maka-common/common";
import { Order } from "../models/order";

const router = Router();

router.patch(
  "/api/order/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);
    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    order.status = OrderStatus.Cancelled;
    await order.save();

    res.status(204).send(order);
  }
);

export { router };
