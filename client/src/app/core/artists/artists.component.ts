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
  artists: Artist[];

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
      this.artists$.subscribe((artists: Artist[]) => {
        this.artists = artists;
        this.changeDetectorRef.detectChanges();
        console.log('this.artists: ', this.artists);
        this.loadingService.loading = false;
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
