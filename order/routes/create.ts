import { Request, Response, Router } from "express";

const router = Router();

router.post("/api/order", async (req: Request, res: Response) => {
    res.send({ message: "create" });
});

export { router };
