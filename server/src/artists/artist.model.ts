import mongoose, { Schema } from "mongoose";
import { Cursors, ExternalUrl, Followers, Image } from "../spotify-api/spotify-api.model";

export interface IArtist {
  external_urls: ExternalUrl;
  followers: Followers;
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface FollowedArtists {
  artists: FollowedArtistsItems;
}

export interface FollowedArtistsItems {
  cursors: Cursors;
  href: string;
  items: IArtist[];
  limit: number;
  next: number | null;
  total: number;
}

const Artist: Schema = new Schema({
  external_urls: {
    spotify: String,
  },
  followers: {
    href: String,
    total: Number,
  },
  genres: [String],
  href: String,
  id: { type: String, required: true, unique: true },
  images: [
    {
      height: Number,
      width: Number,
      url: String,
    },
  ],
  name: String,
  popularity: Number,
  type: String,
  uri: String,
});

export default mongoose.model("Artist", Artist);
