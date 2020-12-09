import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { AppState } from '../models/app-state.model';
import {
  GetAccessAndRefreshTokens,
  LogIn,
  LogOut,
  RefreshAccessToken,
} from '../store/actions/auth.actions';

@Injectable()
export class AuthService {
  private refreshingToken: boolean;

  constructor(private store: Store) {
    this.refreshingToken = false;
  }

  logIn(): void {
    this.store.dispatch(new LogIn());
  }

  logOut(): void {
    this.store.dispatch(new LogOut());
  }

  getAccessAndRefreshTokens(code: string): void {
    this.store.dispatch(new GetAccessAndRefreshTokens(code));
  }

  getAccessToken(): string {
    const accessToken = this.store.selectSnapshot<string>(
      (state: AppState) => state.auth.accessToken,
    );
    return accessToken;
  }

  getRefreshToken(): string {
    const refreshToken = this.store.selectSnapshot<string>(
      (state: AppState) => state.auth.refreshToken,
    );
    return refreshToken;
  }

  async refreshAccessToken(): Promise<string | any> {
    if (!this.refreshingToken) {
      this.refreshingToken = true;
      return this.store
        .dispatch(new RefreshAccessToken(this.getRefreshToken()))
        .toPromise()
        .then((appState: AppState) => {
          this.refreshingToken = false;
          return appState.auth.accessToken;
        });
    }
  }

  isTokenExpired(): boolean {
    const accessTokenSetDate = this.store.selectSnapshot<Date>(
      (state: AppState) => state.auth.accessTokenSetDate,
    );
    const accessTokenExpirationDate = this.store.selectSnapshot<Date>(
      (state: AppState) => state.auth.accessTokenExpirationDate,
    );
    const now = new Date();
    const expirationDateCopy = new Date(
      JSON.parse(JSON.stringify(accessTokenExpirationDate)),
    );
    const oneMinuteBeforeExpiration = new Date(
      expirationDateCopy.setSeconds(
        expirationDateCopy.getSeconds() - 60,
      ),
    );
    if (now > accessTokenSetDate && now < oneMinuteBeforeExpiration) {
      return false;
    } else if (
      now < accessTokenSetDate ||
      now >= oneMinuteBeforeExpiration
    ) {
      return true;
    }
    return true;
  }
}
