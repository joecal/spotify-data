import { Router, Request, Response } from "express";

export default class PlaylistsController {
  router: Router = Router();

  constructor() {
    this.init();
  }

  private init(): void {
    this.getPlaylists();
  }

  private getPlaylists(): void {
    this.router.get("/playlists", (request: Request, response: Response) => {
      return response.json("playlists");
    });
  }
}
