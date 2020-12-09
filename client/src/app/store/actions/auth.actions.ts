export class LogIn {
  static readonly type = '[Auth] LogIn';
}
export class LogOut {
  static readonly type = '[Auth] LogOut';
}
export class GetAccessAndRefreshTokens {
  static readonly type = '[Auth] Get Access And Refresh Tokens';
  constructor(public code: string) {}
}
export class RefreshAccessToken {
  static readonly type = '[Auth] Refres hAccess Token';
  constructor(public refreshToken: string) {}
}
