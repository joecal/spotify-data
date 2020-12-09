import { AuthStateModel } from '../store/state/auth.state';
import { PlaylistsStateModel } from '../store/state/playlists.state';

export interface AppState {
  auth: AuthStateModel;
  playlists: PlaylistsStateModel;
}
