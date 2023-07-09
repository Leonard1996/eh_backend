import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
const Joi = require("@hapi/joi");
const jwkToPem = require("jwk-to-pem");
const { decode, verify } = require("jsonwebtoken");
import * as jwks from "../../authentication/keys.json";

export class AuthenticationMiddleware {
  static checkJwtToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization");
    if (token) {
      try {
        const jwtPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        res.locals.jwt = jwtPayload;

        next();
      } catch (error) {
        console.log(error);
        return res.status(401).send("Access token invalid");
      }
    } else {
      return res.status(401).send("Not Authenticated");
    }
  };

  static checkAzureToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Ms-Authorization");
    const pems = {};
    const keys = jwks["keys"];
    for (let i = 0; i < keys.length; i++) {
      //Convert each key to PEM
      const key_id = keys[i].kid;
      const modulus = keys[i].n;
      const exponent = keys[i].e;
      const key_type = keys[i].kty;
      const jwk = { kty: key_type, n: modulus, e: exponent };
      const pem = jwkToPem(jwk);
      pems[key_id] = pem;
    }

    if (token) {
      const decodedJwt = decode(token, { complete: true });

      if (!decodedJwt) {
        return res.status(401).json("Not a valid JWT token");
      }

      // const kid = decodedJwt.header?.kid;
      // const pem = pems[kid];
      // if (!pem) {
      //   return res.status(401).json("Invalid token");
      // }
      res.locals.jwt = decodedJwt;
      next();
    }
  };
}
