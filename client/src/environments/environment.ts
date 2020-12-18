// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  clientId: 'e7e21464ea47408db0b4b5e2862b828e',
  clientSecret: 'd5f8eda9add94a5d824abceeefd24ce6',
  redirectUri: 'http://localhost:4200/login',
  spotifyApiBaseUrl: 'https://api.spotify.com/v1',
  socketBaseUrl: 'http://localhost:8080',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
