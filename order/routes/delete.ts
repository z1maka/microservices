import { Request, Response, Router } from "express";

const router = Router();

router.delete("/api/order/:id", async (req: Request, res: Response) => {
  res.send({ message: "deleting", id: req.params.id });
});

export { router };
