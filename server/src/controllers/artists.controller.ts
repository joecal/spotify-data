import { Router, Request, Response } from "express";

export default class ArtistsController {
  router: Router = Router();

  constructor() {
    this.init();
  }

  private init(): void {
    this.getArtists();
  }

  private getArtists(): void {
    this.router.get("/artists", (request: Request, response: Response) => {
      return response.json("artists");
    });
  }
}
