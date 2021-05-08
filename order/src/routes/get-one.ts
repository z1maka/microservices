import { Request, Response, Router } from "express";

const router = Router();

router.get("/api/order/:id", async (req: Request, res: Response) => {
  res.send({ message: "get one", id: req.params.id });
});

export { router };
