import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Album, AlbumItem } from 'src/app/models/album.model';
import { Artist } from 'src/app/models/artist.model';
import { UserService } from 'src/app/services/user.service';
import {
  GetUsersFollowedArtists,
  GetUsersSavedAlbums,
} from '../actions/user.actions';

export interface UserStateModel {
  followedArtists: Artist[];
  savedAlbums: AlbumItem[];
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    followedArtists: [],
    savedAlbums: [],
  },
})
@Injectable()
export class UserState {
  constructor(private userService: UserService) {}

  @Selector()
  static followedArtists(userState: UserStateModel) {
    return userState.followedArtists;
  }

  @Selector()
  static savedAlbums(userState: UserStateModel) {
    return userState.savedAlbums;
  }

  @Action(GetUsersFollowedArtists)
  async getUsersFollowedArtists(
    context: StateContext<UserStateModel>,
  ) {
    const followedArtists: Artist[] = await this.userService.getUsersFollowedArtists();
    const state = context.getState();
    state.followedArtists = followedArtists;
    context.patchState(state);
  }

  @Action(GetUsersSavedAlbums)
  async getUsersSavedGetUsersSavedAlbums(
    context: StateContext<UserStateModel>,
  ) {
    const savedAlbums: AlbumItem[] = await this.userService.getUsersSavedAlbums();
    const state = context.getState();
    state.savedAlbums = savedAlbums;
    context.patchState(state);
  }
}
