import { Injectable } from '@angular/core';
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
}
