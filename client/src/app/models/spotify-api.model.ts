import { AlbumItem } from './album.model';
import { Artist } from './artist.model';
import { Playlist } from './playlist.model';
import { Track } from './track.model';

export interface SpotifyGetApiResponse {
  href: string;
  items: Playlist[] | Artist[] | Track[] | AlbumItem[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
}

export interface SpotifyGetApiAudioFeaturesResponse {
  audio_features: AudioFeature[];
}

export interface AudioFeature {
  acousticness: number;
  analysis_url: string;
  danceability: number;
  duration_ms: number;
  energy: number;
  id: string;
  instrumentalness: number;
  key: number;
  liveness: number;
  loudness: number;
  mode: number;
  speechiness: number;
  tempo: number;
  time_signature: number;
  track_href: string;
  type: string;
  uri: string;
  valence: number;
}

export interface ExternalUrl {
  spotify: string;
}

export interface Image {
  height: number;
  width: number;
  url: string;
}

export interface Followers {
  href: string;
  total: number;
}

export interface Copyright {
  text: string;
  type: string;
}

export interface ExternalId {
  [key: string]: string;
}

export interface AddedBy {
  external_urls: ExternalUrl;
  href: string;
  id: string;
  type: string;
  uri: string;
}

export interface TrackVideoThumbnail {
  url: string;
}

export interface Cursors {
  after: number | null;
}
