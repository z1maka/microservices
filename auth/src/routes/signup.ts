import express, { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../models/user";
import { RequestValidatorError } from "../utils/errors/request-validation-error";

const router = express.Router();

router.get(
  "/api/users/signup",
  // [
  //   body("email").isEmail().withMessage("Предоставьте валидный почтовый ящик"),
  //   body("password")
  //     .trim()
  //     .isLength({ min: 4, max: 20 })
  //     .withMessage("Пароль должен быть между 4 и 20 символами"),
  // ],
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("signup");
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   throw new RequestValidatorError(errors.array());
    // }
    // const { email, password } = req.body;
    // const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //   return res.send({ existingUser });
    // }
    //
    // const user = User.build({ email, password });
    // await user.save();
    // res.send({ success: "ok", user });
  }
);

export { router as signupRouter };
