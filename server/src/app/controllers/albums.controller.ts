import { Router, Request, Response } from "express";
import { Controller } from "../models/controller.model";

export default class AlbumsController implements Controller {
  router: Router = Router();

  constructor() {
    this.init();
  }

  private init(): void {
    this.getAlbums();
  }

  private getAlbums(): void {
    this.router.get("/albums", (request: Request, response: Response) => {
      return response.json("albums");
    });
  }
}
