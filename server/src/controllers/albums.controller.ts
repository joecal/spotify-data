import { Router, Request, Response } from "express";

export default class AlbumsController {
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
