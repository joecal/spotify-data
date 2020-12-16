import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { List } from 'immutable';
import { Observable, Subscription } from 'rxjs';
import { Artist } from 'src/app/models/artist.model';
import { LoadingService } from 'src/app/services/loading.service';
import { GetUsersFollowedArtists } from 'src/app/store/actions/user.actions';
import { UserState } from 'src/app/store/state/user.state';

@Component({
  selector: 'spotify-data-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss'],
})
export class ArtistsComponent implements OnInit, OnDestroy {
  @Select(UserState.followedArtists) artists$: Observable<Artist[]>;
  artists: List<Artist>;

  private subscription: Subscription;

  constructor(
    private router: Router,
    private store: Store,
    public loadingService: LoadingService,
  ) {
    this.loadingService.startLoading();
    this.subscription = new Subscription();
    this.artists = List([]);
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
      this.artists$.subscribe((artists: Artist[]) => {
        if (artists.length) {
          this.artists = List(artists);
          this.loadingService.stopLoading();
          console.log('this.artists: ', this.artists);
        } else {
          this.loadingService.stopLoadingTimeout(5000);
        }
      }),
    );
  }

  private loadData() {
    this.store.dispatch(new GetUsersFollowedArtists());
  }

  goToArtist(artist: Artist) {
    this.router.navigateByUrl(`/artist/${artist.id}`);
  }
}
