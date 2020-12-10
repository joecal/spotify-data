import {
  Cursors,
  ExternalUrl,
  Followers,
  Image,
} from './spotify-api.model';

export interface Artist {
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
  items: Artist[];
  limit: number;
  next: number | null;
  total: number;
}
