import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { AppState } from '../models/app-state.model';
import { Playlist, PlaylistsDict } from '../models/playlist.model';
import { TrackItem } from '../models/track.model';
import {
  AudioFeature,
  SpotifyGetApiAudioFeaturesResponse,
  SpotifyGetApiResponse,
} from '../models/spotify-api.model';
import {
  GetPlaylists,
  LazyLoadPlaylistTracks,
} from '../store/actions/playlists.actions';
import { ApiService } from './api.service';

@Injectable()
export class PlaylistsService {
  constructor(private store: Store, private apiService: ApiService) {}

  async getPlaylists(): Promise<Playlist[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let playlists: Playlist[];
        const response: SpotifyGetApiResponse = await this.apiService.get(
          'https://api.spotify.com/v1/me/playlists',
        );
        playlists = response.items as Playlist[];
        if (response.next) {
          const tracksToAdd = await this.apiService.getNext(
            response.next,
          );
          playlists = playlists.concat(tracksToAdd);
        }
        resolve(playlists);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getPlaylist(playlistId: string): Promise<Playlist> {
    return new Promise(async (resolve, reject) => {
      try {
        const playlist: Playlist = await this.apiService.get(
          `https://api.spotify.com/v1/playlists/${playlistId}`,
        );
        resolve(playlist);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getPlaylistTracks(playlistId: string): Promise<TrackItem[]> {
    return new Promise(async (resolve, reject) => {
      try {
        // let playlistTracks: PlaylistTrack[];
        const playlistTracks = await this.apiService.get(
          './assets/liked-songs.json',
        );
        // const response: SpotifyGetApiResponse = await this.apiService.get(
        //   `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        // );
        // playlistTracks = response.items as PlaylistTrack[];
        // let audioFeatures = await this.getPlaylistTracksAudioFeatures(
        //   playlistTracks,
        //   [],
        // );
        // playlistTracks = this.setAudioFeatures(
        //   playlistTracks,
        //   audioFeatures,
        // );
        playlistTracks.forEach((track: any) => {
          let average = 0;
          Object.keys(track).forEach((key) => {
            if (
              key === 'acousticness' ||
              key === 'danceability' ||
              key === 'energy' ||
              key === 'instrumentalness' ||
              key === 'liveness' ||
              key === 'speechiness' ||
              key === 'valence'
            ) {
              average = average + track[key];
            }
            // if (
            //   typeof track[key] === 'number' &&
            //   !Number.isInteger(track[key])
            // ) {
            //   track[key] = Number(parseFloat(track[key]).toFixed(1));
            // }
          });
          track.audioFeatureAverage = Number(
            (average / 7).toFixed(3),
          );
        });
        console.log('playlistTracks: ', playlistTracks);

        resolve(playlistTracks);
        // if (response.next) {
        //   let tracksToAdd = await this.apiService.getNext(
        //     response.next,
        //   );
        //   audioFeatures = await this.getPlaylistTracksAudioFeatures(
        //     tracksToAdd,
        //     [],
        //   );
        //   tracksToAdd = this.setAudioFeatures(
        //     tracksToAdd,
        //     audioFeatures,
        //   );
        //   this.store.dispatch(
        //     new LazyLoadPlaylistTracks(tracksToAdd),
        //   );
        // }
      } catch (error) {
        reject(error);
      }
    });
  }

  run(data: any) {
    const result = data.reduce(function (r: any, a: any) {
      r[a.danceability] = r[a.danceability] || [];
      r[a.danceability].push(a);
      return r;
    }, Object.create(null));
    return result;
  }

  // run(data) {
  //   // UNION-FIND structure, with path comression and union by rank

  //   const UNIONFIND = (function () {
  //     function _find(n) {
  //       if (n.parent == n) return n;
  //       n.parent = _find(n.parent);
  //       return n.parent;
  //     }

  //     return {
  //       makeset: function (id) {
  //         const newnode = {
  //           parent: null,
  //           id: id,
  //           rank: 0,
  //         };
  //         newnode.parent = newnode;
  //         return newnode;
  //       },

  //       find: _find,

  //       combine: function (n1, n2) {
  //         n1 = _find(n1);
  //         n2 = _find(n2);

  //         if (n1 == n2) return;

  //         if (n1.rank < n2.rank) {
  //           n2.parent = n2;
  //           return n2;
  //         } else if (n2.rank < n1.rank) {
  //           n2.parent = n1;
  //           return n1;
  //         } else {
  //           n2.parent = n1;
  //           n1.rank += 1;
  //           return n1;
  //         }
  //       },
  //     };
  //   })();

  //   // const groupHash = { name: {}, phone: {}, email: {} }
  //   const groupHash = { acousticness: {} };
  //   const groupNodes = [];

  //   data.forEach(function (contact) {
  //     const group = UNIONFIND.makeset(contact.id);
  //     let groups: any = new Set();

  //     ['acousticness'].forEach(function (attr) {
  //       // ["name", "phone", "email"].forEach(function (attr) {
  //       if (groupHash[attr].hasOwnProperty(contact[attr])) {
  //         groups.add(groupHash[attr][contact[attr]]);
  //       }
  //     });

  //     groups = Array.from(groups);
  //     groups.push(group);
  //     groupNodes.push(group);

  //     for (let i = 1; i < groups.length; i++) {
  //       UNIONFIND.combine(groups[0], groups[i]);
  //     }

  //     ['acousticness'].forEach(function (attr) {
  //       // ["name", "phone", "email"].forEach(function (attr) {
  //       groupHash[attr][contact[attr]] = groups[0];
  //     });
  //   });

  //   const contactsInGroup = {};

  //   groupNodes.forEach(function (group) {
  //     const groupId = UNIONFIND.find(group).id;

  //     if (contactsInGroup.hasOwnProperty(groupId) == false) {
  //       contactsInGroup[groupId] = [];
  //     }

  //     const found = data.find((track) => track.id === group.id);

  //     // contactsInGroup[groupId].push(group.id);
  //     contactsInGroup[groupId].push(found);
  //   });

  //   const result = Object.values(contactsInGroup).filter(function (
  //     list: any,
  //   ) {
  //     return list.length > 1;
  //   });

  //   // console.log(result)
  //   return result;
  // }

  private setAudioFeatures(
    playlistTracks: TrackItem[],
    audioFeatures: AudioFeature[],
  ): TrackItem[] {
    playlistTracks.forEach((playlistTrack: TrackItem) => {
      audioFeatures.forEach((audioFeature: AudioFeature) => {
        if (playlistTrack.track.id === audioFeature.id) {
          playlistTrack.acousticness = audioFeature.acousticness;
          playlistTrack.analysis_url = audioFeature.analysis_url;
          playlistTrack.danceability = audioFeature.danceability;
          playlistTrack.duration_ms = audioFeature.duration_ms;
          playlistTrack.energy = audioFeature.energy;
          playlistTrack.instrumentalness =
            audioFeature.instrumentalness;
          playlistTrack.key = audioFeature.key;
          playlistTrack.liveness = audioFeature.liveness;
          playlistTrack.loudness = audioFeature.loudness;
          playlistTrack.mode = audioFeature.mode;
          playlistTrack.speechiness = audioFeature.speechiness;
          playlistTrack.tempo = audioFeature.tempo;
          playlistTrack.time_signature = audioFeature.time_signature;
          playlistTrack.track_href = audioFeature.track_href;
          playlistTrack.type = audioFeature.type;
          playlistTrack.uri = audioFeature.uri;
          playlistTrack.valence = audioFeature.valence;
        }
      });
    });
    return playlistTracks;
  }

  async getPlaylistTracksAudioFeatures(
    playlistTracks: TrackItem[],
    collected: AudioFeature[],
  ): Promise<AudioFeature[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let features: AudioFeature[];
        if (playlistTracks.length > 100) {
          const size = 100;
          const playlistTracksCopy = JSON.parse(
            JSON.stringify(playlistTracks),
          );
          const items = playlistTracksCopy
            .slice(0, size)
            .map((i: any) => i);
          features = await this.getAudioFeatures(items);
          items.forEach((track: TrackItem) => {
            const index = playlistTracksCopy.indexOf(track);
            if (index > -1) {
              playlistTracksCopy.splice(index, 1);
            }
          });

          collected = collected.concat(features);

          if (playlistTracksCopy.length > 100) {
            resolve(
              this.getPlaylistTracksAudioFeatures(
                playlistTracksCopy,
                collected,
              ),
            );
          } else {
            features = await this.getAudioFeatures(
              playlistTracksCopy,
            );
            collected = collected.concat(features);
            resolve(collected);
          }
        } else {
          features = await this.getAudioFeatures(playlistTracks);
          resolve(features);
        }
      } catch (caughtError) {
        console.error(caughtError);
        reject(caughtError);
      }
    });
  }

  async getAudioFeatures(
    playlistTracks: TrackItem[],
  ): Promise<AudioFeature[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let ids = playlistTracks.map(
          (playlistTrack: TrackItem) => playlistTrack.track.id,
        );
        ids = ids.reduce(function (a: any, b: any) {
          if (a.indexOf(b) < 0) a.push(b);
          return a;
        }, []);
        let idsString: string = '';
        ids.forEach((id: string) => {
          idsString = idsString + id + ',';
        });
        const response: SpotifyGetApiAudioFeaturesResponse = await this.apiService.get(
          `https://api.spotify.com/v1/audio-features?ids=${idsString}`,
        );
        resolve(response.audio_features);
      } catch (caughtError) {
        console.error(caughtError);
        reject(caughtError);
      }
    });
  }

  async createPlaylist(
    userId: string,
    body: any,
    options: any,
  ): Promise<Playlist> {
    return new Promise(async (resolve, reject) => {
      try {
        const playlist: Playlist = await this.apiService.post(
          `https://api.spotify.com/v1/users/${userId}/playlists`,
          body,
          options,
        );
        resolve(playlist);
      } catch (error) {
        reject(error);
      }
    });
  }
}
