import Api from "./controllers";
import config from "./config";

import express, { Application } from "express";
import compression from "compression";
import nocache from "nocache";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";

export default class App {
  app: Application;

  private middleWareList: any;

  constructor() {
    this.app = express();
    this.middleWareList = [
      compression(),
      nocache(),
      helmet(),
      helmet.frameguard({
        action: "deny",
      }),
      helmet.referrerPolicy({
        policy: "no-referrer",
      }),
      cors(),
      bodyParser.urlencoded({ extended: false }),
      bodyParser.json(),
    ];
    this.intit();
  }

  private intit(): void {
    this.middleWare(this.middleWareList);
    this.routes();
  }

  private middleWare(middleWare: any): void {
    middleWare.forEach((eachMiddleWare: any) => {
      this.app.use(eachMiddleWare);
    });
  }

  private routes(): void {
    this.app.use("/", new Api().router);
  }

  listen(): void {
    this.app.listen(config.port, () => {
      console.log(`Server listening at http://localhost:${config.port}`);
    });
  }
}
