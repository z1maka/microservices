import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { body } from "express-validator";

import { PasswordService } from "../services/password";
import { User } from "../models/user";
import { validateRequest } from "../middleware/validate-request";
import { BadRequestError } from "../utils/errors/bad-request";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return next(new BadRequestError("Invalid credentials!"));
      }

      const passwordMatch = await PasswordService.compare(
        user.password,
        password
      );
      if (!passwordMatch) {
        return next(new BadRequestError("Invalid credentials!"));
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
    } catch (err) {
      return next(err);
    }
  }
);

export { router as signinRouter };
