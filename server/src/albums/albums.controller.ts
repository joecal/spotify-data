import { Router, Request, Response } from "express";
import { Controller } from "../controller/controller.model";

export default class AlbumsController implements Controller {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  private init(): void {
    this.routes();
  }

  private routes(): void {
    this.getAlbums();
  }

  private getAlbums(): void {
    this.router.get("/albums", (request: Request, response: Response) => {
      return response.json("albums");
    });
  }
}
