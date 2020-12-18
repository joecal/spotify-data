import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { UserProfile } from '../models/user.model';
import { UserService } from './user.service';

@Injectable()
export class SocketService {
  socket: any;

  constructor(private userService: UserService) {
    this.userService
      .getCurrentUserProfile()
      .then((userProfile: UserProfile) => {
        this.socket = io(environment.socketBaseUrl, {
          transports: ['websocket', 'polling'],
          query: `user-id=${userProfile.id}`,
        });
        this.initSocketListeners();
      });
  }

  private initSocketListeners(): void {
    this.socket.on('connect', () => {
      console.info('Socket connected!');
    });
    this.socket.on('reconnect_attempt', (attemptCount: number) => {
      console.log('Socket reconnect attempt count: ', attemptCount);
    });
    this.socket.on('disconnect', () => {
      console.error('Socket disconnected!');
    });
  }
}
