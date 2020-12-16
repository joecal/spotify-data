import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Playlist } from 'src/app/models/playlist.model';
import { LoadingService } from 'src/app/services/loading.service';
import { GetPlaylists } from 'src/app/store/actions/playlists.actions';
import { PlaylistsState } from 'src/app/store/state/playlists.state';
import { List } from 'immutable';

@Component({
  selector: 'spotify-data-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss'],
})
export class PlaylistsComponent implements OnInit, OnDestroy {
  @Select(PlaylistsState.playlists) playlists$: Observable<
    Playlist[]
  >;
  loading: boolean;
  playlists: List<Playlist>;

  private subscription: Subscription;

  constructor(
    private router: Router,
    private store: Store,
    public loadingService: LoadingService,
  ) {
    this.loadingService.startLoading();
    this.subscription = new Subscription();
    this.playlists = List([]);
  }

  ngOnInit() {
    this.setSubscription();
    this.loadData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private setSubscription() {
    this.subscription.add(
      this.playlists$.subscribe((playlists: Playlist[]) => {
        if (playlists.length) {
          this.playlists = List(playlists);
          this.loadingService.stopLoading();
          console.log('this.playlists: ', this.playlists);
        } else {
          this.loadingService.stopLoadingTimeout(5000);
        }
      }),
    );
  }

  private loadData() {
    this.store.dispatch(new GetPlaylists());
  }

  goToPlaylist(playlist: Playlist) {
    this.router.navigateByUrl(`/playlist/${playlist.id}`);
  }
}
