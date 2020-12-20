import Api from "./api";
import config from "./config";
import SocketService from "./socket/socket.service";
import { AuditEventService } from "./audit-event/audit-event.service";
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
  auditEventService: AuditEventService;

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
    try {
      this.middleWare(this.middleWareList);
      this.errorStatusResponse();
      this.routes();
      await this.connectToDb();
      const httpServer: http.Server = await this.createServer();
      this.socketService = new SocketService(httpServer);
    } catch (error) {
      // TODO: setup error handler to check if process needs to be exited or not
      process.exit(1);
    }
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
      throw error;
    }
  }

  private createServer(): Promise<http.Server> {
    return new Promise((resolve, reject) => {
      try {
        const httpServer: http.Server = http.createServer(this.app).listen(config.port, "localhost", () => {
          console.log(`Server listening at http://localhost:${config.port}`);
          console.log(`Api listening at http://localhost:${config.port}/api`);
          resolve(httpServer);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

export const app = new App();
