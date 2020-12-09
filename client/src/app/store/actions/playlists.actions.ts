import { PlaylistTrack } from 'src/app/models/playlist.model';

export class GetPlaylists {
  static readonly type = '[Playlists] Get Playlists';
}
export class GetPlaylistTracks {
  static readonly type = '[Playlists] Get Playlist Tracks';
  constructor(public playlistId: string) {}
}
export class LazyLoadPlaylistTracks {
  static readonly type = '[Playlists] Lazy Load Playlist Tracks';
  constructor(public playlistTracks: PlaylistTrack[]) {}
}
export class ClearPlaylistTracks {
  static readonly type = '[Playlists] Clear Playlist Tracks';
}
export class CreatePlaylist {
  static readonly type = '[Playlists] Create Playlist';
  constructor(
    public userId: string,
    public body: any,
    public options: any,
  ) {}
}
