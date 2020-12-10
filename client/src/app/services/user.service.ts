import { Injectable } from '@angular/core';
import { AlbumItem } from '../models/album.model';
import {
  Artist,
  FollowedArtists,
  FollowedArtistsItems,
} from '../models/artist.model';
import { SpotifyGetApiResponse } from '../models/spotify-api.model';
import { UserProfile } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable()
export class UserService {
  constructor(private apiService: ApiService) {}

  async getCurrentUserProfile(): Promise<UserProfile> {
    return new Promise(async (resolve, reject) => {
      try {
        const userProfile: UserProfile = await this.apiService.get(
          'https://api.spotify.com/v1/me',
        );
        resolve(userProfile);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getUsersFollowedArtists(): Promise<Artist[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const followedArtistsObject: FollowedArtists = await this.apiService.get(
          'https://api.spotify.com/v1/me/following?type=artist',
        );
        const followedArtistsItems: FollowedArtistsItems =
          followedArtistsObject.artists;
        const followedArtists: Artist[] = followedArtistsItems.items;
        resolve(followedArtists);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getUsersSavedAlbums(): Promise<AlbumItem[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const response: SpotifyGetApiResponse = await this.apiService.get(
          'https://api.spotify.com/v1/me/albums',
        );
        const albumItems = response.items as AlbumItem[];
        resolve(albumItems);
      } catch (error) {
        reject(error);
      }
    });
  }
}
