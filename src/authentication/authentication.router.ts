import * as express from "express";
import { AuthenticationMiddleware } from "./middlewares/authentication.middleware";
import { AuthenticationController } from "./controllers/authentication.controller";

export class AuthenticationRouter {
  static configRoutes = (app: express.Application) => {
    app.get("/azure-login", [AuthenticationMiddleware.checkAzureToken, AuthenticationController.azureLogin]);
  };
}
