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
    public loadingService: LoadingService,
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
        console.log('this.playlists: ', this.playlists);
        this.loadingService.loading = false;
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
