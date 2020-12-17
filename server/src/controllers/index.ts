import { Router } from "express";
import AlbumsController from "./albums.controller";
import ArtistsController from "./artists.controller";
import PlaylistsController from "./playlists.controller";
import config from "../config";

export default class Api {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  private init(): void {
    this.router.use(config.apiBaseRoute, new AlbumsController().router);
    this.router.use(config.apiBaseRoute, new ArtistsController().router);
    this.router.use(config.apiBaseRoute, new PlaylistsController().router);
  }
}
