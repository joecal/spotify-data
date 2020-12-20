import { Router, Request, Response } from "express";
import { Controller } from "../controller/controller.model";

export default class ArtistsController implements Controller {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  private init(): void {
    this.routes();
  }

  private routes(): void {
    this.getArtists();
    this.createArtist();
    this.createArtists();
  }

  private getArtists(): void {
    this.router.get("/artists", (request: Request, response: Response) => {
      return response.json("get artists");
    });
  }

  private createArtist() {
    this.router.post("/artist", (request: Request, response: Response) => {
      console.log("createArtist body: ", request.body);
      return response.json("post artist");
    });
  }

  private createArtists() {
    this.router.post("/artists", (request: Request, response: Response) => {
      console.log("createArtists body: ", request.body);
      return response.json("post artists");
    });
  }
}
