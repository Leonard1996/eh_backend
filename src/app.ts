import "reflect-metadata";
require("dotenv").config();
import express = require("express");
import * as cors from "cors";
import * as bodyParser from "body-parser";
import { UserRouter } from "./user/user.router";
import { createConnection } from "typeorm";
import { AuthenticationRouter } from "./authentication/authentication.router";
import { DiplomaRouter } from "./diploma/diploma.router";
import { join } from "path";

const app = express();
app.use(express.static(join(__dirname, "..", "public")));

createConnection()
  .then(async (connection) => {
    app.use(cors());
    app.use(bodyParser.json({ limit: "200mb" }));
    app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));

    AuthenticationRouter.configRoutes(app);

    UserRouter.configRoutes(app);
    DiplomaRouter.configRoutes(app);

    const port = process.env.PORT || 3001;

    app.listen(port, () => {
      return console.log(`server is listening on ${port}`);
    });
  })
  .catch((error) => console.log(error));
