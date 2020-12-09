export interface SpotifyGetApiResponse {
  href: string;
  items: any;
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
