import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  Playlist,
  PlaylistsDict,
  PlaylistTrack,
} from 'src/app/models/playlist.model';
import {
  ClearPlaylistTracks,
  CreatePlaylist,
  GetPlaylists,
  GetPlaylistTracks,
  LazyLoadPlaylistTracks,
} from '../actions/playlists.actions';
import { PlaylistsService } from 'src/app/services/playlists.service';

export interface PlaylistsStateModel {
  playlists: Playlist[];
  playlistsDict: PlaylistsDict;
  playlistTracks: PlaylistTrack[];
}

@State<PlaylistsStateModel>({
  name: 'playlists',
  defaults: {
    playlists: [],
    playlistsDict: {},
    playlistTracks: [],
  },
})
@Injectable()
export class PlaylistsState {
  constructor(private playlistsService: PlaylistsService) {}

  @Selector()
  static playlistTracks(playlistsState: PlaylistsStateModel) {
    return playlistsState.playlistTracks;
  }

  @Selector()
  static playlists(playlistsState: PlaylistsStateModel) {
    return playlistsState.playlists;
  }

  @Action(GetPlaylists)
  async getPlaylists(context: StateContext<PlaylistsStateModel>) {
    let state = context.getState();
    if (state.playlists.length === 0) {
      this.setPlaylistsState(context);
    } else if (state.playlists.length > 0) {
      this.checkToUpdatePlaylist(context, state);
    }
  }

  private async setPlaylistsState(
    context: StateContext<PlaylistsStateModel>,
    playlists?: Playlist[],
  ) {
    playlists = playlists
      ? playlists
      : await this.playlistsService.getPlaylists();
    const state = context.getState();
    state.playlists = playlists;
    state.playlists.forEach((playlist: Playlist) => {
      state.playlistsDict[playlist.id] = playlist;
    });
    context.patchState(state);
  }

  private async checkToUpdatePlaylist(
    context: StateContext<PlaylistsStateModel>,
    state: PlaylistsStateModel,
  ) {
    const playlists = await this.playlistsService.getPlaylists();
    for (let i = 0; i < playlists.length; i++) {
      if (!state.playlistsDict[playlists[i].id]) {
        this.setPlaylistsState(context, playlists);
        break;
      }
    }
  }

  @Action(GetPlaylistTracks)
  async getPlaylistTracks(
    context: StateContext<PlaylistsStateModel>,
    action: GetPlaylistTracks,
  ) {
    const playlistsTracks = await this.playlistsService.getPlaylistTracks(
      action.playlistId,
    );
    const state = context.getState();
    state.playlistTracks = playlistsTracks;
    context.patchState(state);
  }

  @Action(LazyLoadPlaylistTracks)
  lazyLoadPlaylistTracks(
    context: StateContext<PlaylistsStateModel>,
    action: LazyLoadPlaylistTracks,
  ) {
    const state = context.getState();
    state.playlistTracks = state.playlistTracks.concat(
      action.playlistTracks,
    );
    context.patchState(state);
  }

  @Action(ClearPlaylistTracks)
  clearPlaylistTracks(context: StateContext<PlaylistsStateModel>) {
    const state = context.getState();
    state.playlistTracks = [];
    context.patchState(state);
  }

  @Action(CreatePlaylist)
  async createPlaylist(
    context: StateContext<PlaylistsStateModel>,
    action: CreatePlaylist,
  ) {
    const playlist = await this.playlistsService.createPlaylist(
      action.userId,
      action.body,
      action.options,
    );
    const state = context.getState();
    state.playlists.push(playlist);
    state.playlistsDict[playlist.id] = playlist;
    context.patchState(state);
  }
}
