import { Response, Request } from "express";
import { getRepository } from "typeorm";
import { User } from "../../user/entities/user.entity";
import * as jwt from "jsonwebtoken";

export class AuthenticationController {
  static azureLogin = async (req: Request, res: Response) => {
    const userRepository = getRepository(User);
    const payload = res.locals.jwt;

    let existingUser = await userRepository
      .createQueryBuilder("user")
      .where("user.email = :email", { email: payload.payload.unique_name })
      .getOne();

    if (!existingUser) {
      const newUser = new User();
      newUser.name = payload.payload.name;
      newUser.email = payload.payload.unique_name;
      newUser.uniqueName = payload.payload.unique_name;
      existingUser = await userRepository.save(newUser);
    }

    const accessToken = jwt.sign({ userId: existingUser.id, email: existingUser.email }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.ACCESS_TOKEN_LIFETIME_MS,
    });

    return res.status(200).json({ user: existingUser, accessToken });
  };
}
