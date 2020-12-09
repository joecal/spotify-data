import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Playlist } from 'src/app/models/playlist.model';
import { GetPlaylists } from 'src/app/store/actions/playlists.actions';
import { PlaylistsState } from 'src/app/store/state/playlists.state';

@Component({
  selector: 'spotify-data-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss'],
})
export class PlaylistsComponent implements OnInit {
  @Select(PlaylistsState.playlists) playlists$: Observable<
    Playlist[]
  >;

  loading: boolean;
  playlists: Playlist[];

  private subscription: Subscription;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private store: Store,
  ) {
    this.loading = true;
    this.subscription = new Subscription();
  }

  ngOnInit() {
    this.setSubscription();
    this.loadData();
  }

  private setSubscription() {
    this.subscription.add(
      this.playlists$.subscribe((playlists: Playlist[]) => {
        this.playlists = playlists;
        this.changeDetectorRef.detectChanges();
        if (this.loading && this.playlists.length > 0) {
          this.loading = false;
        } else if (this.loading && this.playlists.length === 0) {
          setTimeout(() => {
            if (this.loading) {
              this.loading = false;
            }
          }, 5000);
        }
        console.log('this.playlists: ', this.playlists);
      }),
    );
  }

  private async loadData() {
    try {
      this.store.dispatch(new GetPlaylists());
    } catch (error) {
      console.error(error);
    }
  }

  isTextOverflowing(element: HTMLElement): boolean {
    if (element.scrollWidth > element.clientWidth) {
      return true;
    } else {
      return false;
    }
  }

  goToPlaylist(playlist: Playlist) {
    this.router.navigateByUrl(`/playlist/${playlist.id}`);
  }
}
