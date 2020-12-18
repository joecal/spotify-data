import { Router } from "express";
import AlbumsController from "./albums.controller";
import ArtistsController from "./artists.controller";
import PlaylistsController from "./playlists.controller";
import { Controller } from "../models/controller.model";

export default class Api {
  router: Router;
  controllers: Controller[];

  constructor() {
    this.router = Router();
    this.controllers = [new AlbumsController(), new ArtistsController(), new PlaylistsController()];
    this.init();
  }

  private init(): void {
    this.routes();
  }

  private routes(): void {
    this.controllers.forEach((controller: any) => {
      this.router.use("/", controller.router);
    });
  }
}
