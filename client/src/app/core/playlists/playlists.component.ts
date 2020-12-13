import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Playlist } from 'src/app/models/playlist.model';
import { LoadingService } from 'src/app/services/loading.service';
import { GetPlaylists } from 'src/app/store/actions/playlists.actions';
import { PlaylistsState } from 'src/app/store/state/playlists.state';

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
  playlists: Playlist[];

  private subscription: Subscription;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private store: Store,
    private loadingService: LoadingService,
  ) {
    this.loadingService.loading = true;
    this.subscription = new Subscription();
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
        this.playlists = playlists;
        this.changeDetectorRef.detectChanges();
        if (
          this.loadingService.loading &&
          this.playlists.length > 0
        ) {
          this.loadingService.loading = false;
        } else if (
          this.loadingService.loading &&
          this.playlists.length === 0
        ) {
          setTimeout(() => {
            if (this.loadingService.loading) {
              this.loadingService.loading = false;
            }
          }, 5000);
        }
        console.log('this.playlists: ', this.playlists);
      }),
    );
  }

  private loadData() {
    this.store.dispatch(new GetPlaylists());
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
