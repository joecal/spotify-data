import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Action, NgxsOnInit, State, StateContext } from '@ngxs/store';
import {
  GetAccessAndRefreshTokens,
  LogIn,
  LogOut,
  RefreshAccessToken,
} from '../actions/auth.actions';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

export interface AuthStateModel {
  accessToken: string;
  accessTokenSetDate: Date;
  accessTokenExpirationDate: Date;
  accessTokenExpirationSeconds: number;
  refreshToken: string;
}

interface AuthTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    accessToken: '',
    accessTokenSetDate: new Date(),
    accessTokenExpirationDate: new Date(),
    accessTokenExpirationSeconds: null!,
    refreshToken: '',
  },
})
@Injectable()
export class AuthState implements NgxsOnInit {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone,
  ) {
    this.clientId = environment.clientId;
    this.clientSecret = environment.clientSecret;
    this.redirectUri = encodeURIComponent(environment.redirectUri);
  }

  ngxsOnInit(context: StateContext<AuthStateModel>) {
    this.checkLocalStorage(context);
  }

  @Action(LogIn)
  logIn(): void {
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${this.redirectUri}&scope=playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative&show_dialog=false`;
  }

  @Action(LogOut)
  logOut(context: StateContext<AuthStateModel>): void {
    const state = context.getState();
    state.accessToken = null!;
    state.refreshToken = null!;
    state.accessTokenExpirationDate = null!;
    context.patchState(state);
    localStorage.clear();
    this.ngZone.run(() => this.router.navigateByUrl('/login'));
  }

  @Action(GetAccessAndRefreshTokens)
  getAccessAndRefreshTokens(
    context: StateContext<AuthStateModel>,
    action: GetAccessAndRefreshTokens,
  ) {
    const body = `grant_type=authorization_code&code=${action.code}&redirect_uri=${this.redirectUri}`;
    const base64Creds = btoa(`${this.clientId}:${this.clientSecret}`);
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${base64Creds}`,
      }),
    };
    this.http
      .post('https://accounts.spotify.com/api/token', body, options)
      .toPromise()
      .then((response: AuthTokenResponse | any) => {
        this.setAccessToken(context, response.access_token);
        this.setAccessTokenSetDate(context, new Date());
        this.setAccessTokenExpirationDate(
          context,
          response.expires_in,
        );
        this.setAccessTokenExpirationSeconds(
          context,
          response.expires_in,
        );
        this.setRefreshToken(context, response.refresh_token);
        this.ngZone.run(() => this.router.navigateByUrl('/'));
      });
  }

  private checkLocalStorage(context: StateContext<AuthStateModel>) {
    const accessToken: string =
      localStorage.getItem('access_token') || '';
    const refreshToken: string =
      localStorage.getItem('refresh_token') || '';
    let accessTokenSetDate: Date;
    let accessTokenExpirationDate: Date;
    let accessTokenExpirationSeconds: number;
    if (accessToken && refreshToken) {
      accessTokenSetDate = new Date(
        localStorage.getItem('access_token_set_date') || '',
      );
      accessTokenExpirationDate = new Date(
        localStorage.getItem('access_token_expiration_date') || '',
      );
      accessTokenExpirationSeconds = Number(
        localStorage.getItem('access_token_expiration_seconds'),
      );
      this.setAccessToken(context, accessToken);
      this.setAccessTokenSetDate(context, accessTokenSetDate);
      this.setRefreshToken(context, refreshToken);
      this.setAccessTokenExpirationDate(
        context,
        accessTokenExpirationSeconds,
        accessTokenExpirationDate,
      );
    }
  }

  private setAccessToken(
    context: StateContext<AuthStateModel>,
    accessToken: string,
  ): void {
    const state = context.getState();
    state.accessToken = accessToken;
    context.patchState(state);
    localStorage.setItem('access_token', state.accessToken);
  }

  private setAccessTokenSetDate(
    context: StateContext<AuthStateModel>,
    date: Date,
  ) {
    const state = context.getState();
    const now = date;
    state.accessTokenSetDate = now;
    context.patchState(state);
    localStorage.setItem('access_token_set_date', now.toString());
  }

  private setAccessTokenExpirationDate(
    context: StateContext<AuthStateModel>,
    expiresInSeconds: number,
    localStorageDate?: Date,
  ) {
    const state = context.getState();
    let now: Date;
    if (localStorageDate) {
      now = localStorageDate;
    } else {
      now = new Date();
    }
    localStorage.setItem(
      'access_token_expiration_date',
      now.toString(),
    );
    state.accessTokenSetDate = new Date();
    state.accessTokenExpirationDate = new Date(
      now.setSeconds(now.getSeconds() + expiresInSeconds),
    );
  }

  private setAccessTokenExpirationSeconds(
    context: StateContext<AuthStateModel>,
    expiresInSeconds: number,
  ) {
    const state = context.getState();
    state.accessTokenExpirationSeconds = expiresInSeconds;
    context.patchState(state);
    localStorage.setItem(
      'access_token_expiration_seconds',
      expiresInSeconds.toString(),
    );
  }

  private setRefreshToken(
    context: StateContext<AuthStateModel>,
    refreshToken: string,
  ): void {
    const state = context.getState();
    state.refreshToken = refreshToken;
    context.patchState(state);
    localStorage.setItem('refresh_token', state.refreshToken);
  }

  @Action(RefreshAccessToken)
  refreshAccessToken(
    context: StateContext<AuthStateModel>,
    action: RefreshAccessToken,
  ): void {
    const body = `grant_type=refresh_token&refresh_token=${action.refreshToken}`;
    const base64Creds = btoa(`${this.clientId}:${this.clientSecret}`);
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${base64Creds}`,
      }),
    };
    this.http
      .post('https://accounts.spotify.com/api/token', body, options)
      .toPromise()
      .then((response: AuthTokenResponse | any) => {
        this.setAccessToken(context, response.access_token);
        this.setAccessTokenExpirationDate(
          context,
          response.expires_in,
        );
        this.setAccessTokenExpirationSeconds(
          context,
          response.expires_in,
        );
      });
  }
}
