import { Router, Request, Response } from "express";
import { Controller } from "../controller/controller.model";

export default class PlaylistsController implements Controller {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  private init(): void {
    this.routes();
  }

  private routes(): void {
    this.getPlaylists();
  }

  private getPlaylists(): void {
    this.router.get("/playlists", (request: Request, response: Response) => {
      return response.json("playlists");
    });
  }
}
