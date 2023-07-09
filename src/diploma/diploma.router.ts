import * as express from "express";
import { AuthenticationMiddleware } from "../authentication/middlewares/authentication.middleware";
import { DiplomaController } from "./controllers/diploma.controller";
import { UploadMiddleware } from "../file/middleware/file.middleware";

export class DiplomaRouter {
  static configRoutes = (app: express.Application) => {
    app.post("/diplomas", [
      AuthenticationMiddleware.checkAzureToken,
      UploadMiddleware.validateFileUpload("file", ["pdf"], 1),

      DiplomaController.create,
    ]);
    app.get("/diplomas", [AuthenticationMiddleware.checkAzureToken, DiplomaController.get]);
    app.get("/diplomas-for-teachers", [AuthenticationMiddleware.checkAzureToken, DiplomaController.getForTeachers]);
  };
}
