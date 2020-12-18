import Api from "./controllers";
import config from "../config";
import Socket from "./socket";
import SocketService from "./services/socket.service";

import express, { Application, NextFunction, Request, Response } from "express";
import compression from "compression";
import nocache from "nocache";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";

export default class App {
  app: Application;
  socketInstance: any;
  socketService: any;

  private middleWareList: any[];

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
    this.errorStatusResponse();
    this.routes();
  }

  private middleWare(middleWareList: any): void {
    middleWareList.forEach((eachMiddleWare: any) => {
      this.app.use(eachMiddleWare);
    });
  }

  private errorStatusResponse(): void {
    this.app.use((error: any, request: Request, response: Response, next: NextFunction) => {
      response.status(error.status).json({
        error: {
          message: error.message,
        },
      });
    });
  }

  private routes(): void {
    this.app.use(config.apiBaseRoute, new Api().router);
  }

  listen(): void {
    const httpServer = http.createServer(this.app).listen(config.port, "localhost", () => {
      console.log(`Server listening at http://localhost:${config.port}`);
      console.log(`Api listening at http://localhost:${config.port}/api`);
      this.socketInstance = new Socket(httpServer);
      this.socketService = new SocketService(this.socketInstance.socket);
    });
  }
}
