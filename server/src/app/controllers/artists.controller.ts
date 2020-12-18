import { Router, Request, Response } from "express";
import server from "../../index";
import { Controller } from "../models/controller.model";
import Artist from "../models/artist.model";
import AuditEvent from "../models/audit-event.model";
import mongoose from "mongoose";

export default class ArtistsController implements Controller {
  router: Router = Router();

  constructor() {
    this.init();
  }

  private init(): void {
    this.watchArtistsCollection();
    this.getArtists();
  }

  private watchArtistsCollection(): void {
    const artistsEvents = Artist.watch();
    artistsEvents.on("change", (change) => {
      console.log("change", JSON.stringify(change));
    });
  }

  private getArtists(): void {
    setTimeout(() => {
      const artist = new Artist({
        external_urls: {
          spotify: "test",
        },
        followers: {
          href: "test",
          total: 1,
        },
        genres: ["test"],
        href: "test",
        id: "test",
        images: [
          {
            height: 1,
            width: 1,
            url: "test",
          },
        ],
        name: "test",
        popularity: 1,
        type: "test",
        uri: "test",
      });
      artist.save((err) => {
        if (err) {
          console.log("err: ", err);
        }
        console.log("saved!");
        // saved!
      });
    }, 5000);
    this.router.get("/artists", (request: Request, response: Response) => {
      const db = server.database.getDB();
      return response.json("artists");
    });
  }

  private createArtist() {}

  private createArtists() {}
}
