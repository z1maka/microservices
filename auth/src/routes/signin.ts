import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { body } from "express-validator";

import { PasswordService } from "../services/password";
import { User } from "../models/user";
import { validateRequest } from "../../../common/src/middleware/validate-request";
import { BadRequestError } from "../../../common/src/errors/bad-request";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError("Invalid credentials!");
    }

    const passwordMatch = await PasswordService.compare(
      user.password,
      password
    );
    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials!");
    }

    const userJWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJWT,
    };

    res.send(user);
  }
);

export { router as signinRouter };
