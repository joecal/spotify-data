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
  tracks: PlaylistTrackOne;
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

interface PlaylistTrackOne {
  href: string;
  total: number;
}

export interface PlaylistsDict {
  [key: string]: Playlist;
}

interface PlaylistTrackAddedBy {
  external_urls: ExternalUrl;
  href: string;
  id: string;
  type: string;
  uri: string;
}

interface PlaylistTrackArtist {
  external_urls: ExternalUrl;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

interface PlaylistExternalIds {
  isrc: string;
}

interface PlaylistTrackTwo {
  album: PlaylistTrackAlbum;
  artists: PlaylistTrackArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  episode: boolean;
  explicit: boolean;
  external_ids: PlaylistExternalIds;
  external_urls: ExternalUrl;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track: boolean;
  track_number: number;
  type: string;
  uri: string;
}

interface PlaylistTrackAlbum {
  album_type: string;
  artists: PlaylistTrackArtist[];
  available_markets: string[];
  external_urls: ExternalUrl;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

interface PlaylistTrackVideoThumbnail {
  url: string;
}

export interface PlaylistTrack {
  added_at: string;
  added_by: PlaylistTrackAddedBy;
  is_local: boolean;
  primary_color: string;
  track: PlaylistTrackTwo;
  video_thumbnail: PlaylistTrackVideoThumbnail;

  acousticness?: number;
  analysis_url?: string;
  danceability?: number;
  duration_ms?: number;
  energy?: number;
  instrumentalness?: number;
  key?: number;
  liveness?: number;
  loudness?: number;
  mode?: number;
  speechiness?: number;
  tempo?: number;
  time_signature?: number;
  track_href?: string;
  type?: string;
  uri?: string;
  valence?: number;
  audioFeatureAverage?: number;
}
