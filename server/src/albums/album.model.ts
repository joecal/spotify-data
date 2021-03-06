import { IArtist } from "../artists/artist.model";
import { Copyright, ExternalId, ExternalUrl, Image } from "../spotify-api/spotify-api.model";
import { Track } from "../track/track.model";

export interface AlbumItem {
  added_at: string;
  album: Album;
}

export interface AlbumTrack {
  href: string;
  items: Track[];
  limit: number;
  next: string | null;
  offset: number;
  previous: null | null;
  total: number;
}

export interface Album {
  album_type: string;
  artists: IArtist[];
  available_markets: string[];
  copyrights: Copyright[];
  external_ids: ExternalId;
  external_urls: ExternalUrl;
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  release_date: string;
  release_date_precision: string;
  tracks: AlbumTrack;
  type: string;
  uri: string;
}
