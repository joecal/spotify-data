import { Album } from "../albums/album.model";
import { IArtist } from "../artists/artist.model";
import { AddedBy, TrackVideoThumbnail, ExternalId, ExternalUrl } from "../spotify-api/spotify-api.model";

export interface TrackItem {
  added_at: string;
  added_by: AddedBy;
  is_local: boolean;
  primary_color: string;
  track: Track;
  video_thumbnail: TrackVideoThumbnail;
  // optionals
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

export interface Track {
  artists: IArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrl;
  href: string;
  id: string;
  name: string;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
  // optionals
  album?: Album;
  episode?: boolean;
  external_ids?: ExternalId;
  is_local?: boolean;
  popularity?: number;
  track?: boolean;
}
