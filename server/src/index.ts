import Api from "./api";
import config from "./config";
import SocketService from "./socket/socket.service";
import Database from "./database";

import express, { Application, NextFunction, Request, Response } from "express";
import compression from "compression";
import nocache from "nocache";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";

class App {
  socketService: SocketService;

  private app: Application;
  private middleWareList: any[];
  private database: Database;

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
    this.database = new Database();
    this.intit();
  }

  private async intit(): Promise<void> {
    this.middleWare(this.middleWareList);
    this.errorStatusResponse();
    this.routes();
    await this.connectToDb();
    this.listen();
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

  private async connectToDb(): Promise<void> {
    try {
      await this.database.connect();
    } catch (error) {
      process.exit(1);
    }
  }

  private listen(): void {
    const httpServer: http.Server = http.createServer(this.app).listen(config.port, "localhost", () => {
      console.log(`Server listening at http://localhost:${config.port}`);
      console.log(`Api listening at http://localhost:${config.port}/api`);
      this.socketService = new SocketService(httpServer);
    });
  }
}

export const app = new App();
