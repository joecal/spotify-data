import { ExternalUrl, Image } from './spotify-api.model';

export interface Playlist {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrl;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: PlaylistOwner;
  primary_color: string;
  public: boolean;
  snapshot_id: string;
  tracks: PlaylistTrackItem;
  type: string;
  uri: string;
}

interface PlaylistOwner {
  display_name: string;
  external_urls: ExternalUrl;
  href: string;
  id: string;
  type: string;
  uri: string;
}

interface PlaylistTrackItem {
  href: string;
  total: number;
}

export interface PlaylistsDict {
  [key: string]: Playlist;
}
