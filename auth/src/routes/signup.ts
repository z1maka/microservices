import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { body } from "express-validator";

import { validateRequest } from "../middleware/validate-request";
import { User } from "../models/user";
import { BadRequestError } from "../utils/errors/bad-request";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Предоставьте валидный почтовый ящик"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Пароль должен быть между 4 и 20 символами"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("User already exists!");
    }

    const user = User.build({ email, password });
    await user.save();

    // create jwt
    const userJWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );
    // store jwt to cookie
    req.session = {
      jwt: userJWT,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
