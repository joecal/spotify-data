import { Router } from "express";
import AlbumsController from "../albums/albums.controller";
import ArtistsController from "../artists/artists.controller";
import PlaylistsController from "../playlists/playlists.controller";
import { Controller } from "../controller/controller.model";

export default class Api {
  router: Router;

  private controllers: Controller[];

  constructor() {
    this.router = Router();
    this.controllers = [new AlbumsController(), new ArtistsController(), new PlaylistsController()];
    this.init();
  }

  private init(): void {
    this.routes();
  }

  private routes(): void {
    this.controllers.forEach((controller: Controller) => {
      this.router.use("/", controller.router);
    });
  }
}
