import { Controller } from "../controller/controller.model";
import { Router, Request, Response } from "express";

export default class AuditEventController implements Controller {
  router: Router;

  constructor() {
    this.router = Router();
    this.intit();
  }

  private intit(): void {
    this.routes();
  }

  private routes(): void {
    this.getAuditEvents();
  }

  private getAuditEvents(): void {
    this.router.get("/audit-events", (request: Request, response: Response) => {
      return response.json("audit-events");
    });
  }
}
