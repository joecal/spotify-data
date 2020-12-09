import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import {
  Playlist,
  PlaylistTrack,
} from 'src/app/models/playlist.model';
import { PlaylistsService } from 'src/app/services/playlists.service';
import {
  ClearPlaylistTracks,
  GetPlaylistTracks,
  CreatePlaylist,
} from 'src/app/store/actions/playlists.actions';
import { PlaylistsState } from 'src/app/store/state/playlists.state';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { MatSort } from '@angular/material/sort';
import { HttpHeaders } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'spotify-data-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @Select(PlaylistsState.playlistTracks) playlistTracks$: Observable<
    PlaylistTrack[]
  >;
  tvsItemSize: number;
  headerHeight: number;
  bufferMultiplier: number;
  playlist: Playlist;
  playlistTracks: PlaylistTrack[];
  tableDataSource: TableVirtualScrollDataSource<PlaylistTrack>;
  tableColumns: string[];
  loading: boolean;
  sortedBy: string;

  private playlistId: string;
  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private playlistsService: PlaylistsService,
    private store: Store,
    private userService: UserService,
  ) {
    this.tvsItemSize = 48;
    this.headerHeight = 56;
    this.bufferMultiplier = 1;
    this.loading = true;
    this.subscription = new Subscription();
    this.tableColumns = [
      'name',
      'artist',
      'albumm',

      'acousticness',
      // 'analysis_url',
      'danceability',
      'duration_ms',
      'energy',
      'instrumentalness',
      'key',
      'liveness',
      'loudness',
      'mode',
      'speechiness',
      'tempo',
      // 'time_signature',
      // 'track_href',
      // 'type',
      // 'uri',
      'valence',
      // 'audioFeatureAverage',
    ];
    this.tableDataSource = new TableVirtualScrollDataSource();
  }

  ngOnInit() {
    this.setSubscription();
    this.loadData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ClearPlaylistTracks());
  }

  private setSubscription() {
    this.subscription.add(
      this.route.params.subscribe((params: any) => {
        this.playlistId = params.id;
      }),
    );
    this.subscription.add(
      this.playlistTracks$.subscribe(
        (playlistTracks: PlaylistTrack[]) => {
          this.playlistTracks = playlistTracks;
          // console.log(
          //   'this.playlistTracks: ',
          //   JSON.stringify(this.playlistTracks),
          // );
          if (
            this.playlist &&
            this.playlist.tracks.total === this.playlistTracks.length
          ) {
            this.loading = false;
          }
          this.tableDataSource = new TableVirtualScrollDataSource(
            this.playlistTracks,
          );
          this.tableDataSource.sort = this.sort;
          if (
            this.sort &&
            this.subscription['_subscriptions'].length === 2
          ) {
            this.subscription.add(
              this.sort.sortChange.subscribe((sortChange: any) => {
                if (sortChange.direction) {
                  this.sortedBy = sortChange.active;
                } else if (this.sortedBy && !sortChange.direction) {
                  this.sortedBy = null!;
                }
              }),
            );
          }
          this.tableDataSource.sortingDataAccessor = (
            playlistTrack: PlaylistTrack | any,
            property: string,
          ) => {
            switch (property) {
              case 'name':
                return playlistTrack.track.name;
              case 'artist':
                return this.getArtistNames(
                  playlistTrack.track.artists,
                );
              case 'albumm':
                return playlistTrack.track.album.name;
              default:
                return playlistTrack[property];
            }
          };
        },
      ),
    );
  }

  private async loadData() {
    try {
      this.playlist = await this.playlistsService.getPlaylist(
        this.playlistId,
      );

      if (this.playlist && this.playlist.tracks.total <= 100) {
        this.loading = false;
      }
      this.store.dispatch(new GetPlaylistTracks(this.playlist.id));
      console.log('this.playlist: ', this.playlist);
    } catch (error) {
      console.error(error);
    }
  }

  getArtistNames(artists: any) {
    let name: string = '';
    artists.forEach((artist: any) => {
      name = name + artist.name + ', ';
    });
    name = name.substring(0, name.length - 2);
    return name;
  }

  async createPlaylist() {
    const currentUser = await this.userService.getCurrentUserProfile();
    const body = {
      name: `${this.playlist.name} sorted by ${this.sortedBy}`,
      public: true,
      collaborative: false,
      description: 'Created with test app',
    };
    const options = {
      headers: new HttpHeaders().set(
        'Content-type',
        'application/json',
      ),
    };
    this.store.dispatch(
      new CreatePlaylist(currentUser.id, body, options),
    );
  }
}
