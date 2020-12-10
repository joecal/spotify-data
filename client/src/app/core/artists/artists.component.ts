import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Artist } from 'src/app/models/artist.model';
import { GetUsersFollowedArtists } from 'src/app/store/actions/user.actions';
import { UserState } from 'src/app/store/state/user.state';

@Component({
  selector: 'spotify-data-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss'],
})
export class ArtistsComponent implements OnInit, OnDestroy {
  @Select(UserState.followedArtists) artists$: Observable<Artist[]>;
  loading: boolean;
  artists: Artist[];

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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private setSubscription() {
    this.subscription.add(
      this.artists$.subscribe((artists: Artist[]) => {
        this.artists = artists;
        this.changeDetectorRef.detectChanges();
        if (this.loading && this.artists.length > 0) {
          this.loading = false;
        } else if (this.loading && this.artists.length === 0) {
          setTimeout(() => {
            if (this.loading) {
              this.loading = false;
            }
          }, 5000);
        }
        console.log('this.artists: ', this.artists);
      }),
    );
  }

  private loadData() {
    this.store.dispatch(new GetUsersFollowedArtists());
  }

  isTextOverflowing(element: HTMLElement): boolean {
    if (element.scrollWidth > element.clientWidth) {
      return true;
    } else {
      return false;
    }
  }

  goToArtist(artist: Artist) {
    this.router.navigateByUrl(`/artist/${artist.id}`);
  }
}
