import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Album } from 'src/app/models/album.model';
import { Artist } from 'src/app/models/artist.model';
import {
  GetUsersFollowedArtists,
  GetUsersSavedAlbums,
} from 'src/app/store/actions/user.actions';
import { UserState } from 'src/app/store/state/user.state';

interface ResponsiveOption {
  breakpoint: string;
  numVisible: number;
  numScroll: number;
}

@Component({
  selector: 'spotify-data-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @Select(UserState.followedArtists) followedArtists$: Observable<
    Artist[]
  >;
  @Select(UserState.savedAlbums) savedAlbums$: Observable<Album[]>;
  followedArtists: Artist[];
  savedAlbums: Album[];
  responsiveOptions: ResponsiveOption[];
  loading: boolean;

  private subscription: Subscription;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private store: Store,
  ) {
    this.loading = true;
    this.subscription = new Subscription();
    this.followedArtists = [];
    this.savedAlbums = [];
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
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
      this.followedArtists$.subscribe((followedArtists: Artist[]) => {
        this.followedArtists = followedArtists;
        this.changeDetectorRef.detectChanges();

        console.log('this.followedArtists: ', this.followedArtists);
      }),
    );
    this.subscription.add(
      this.savedAlbums$.subscribe((savedAlbums: Album[]) => {
        this.savedAlbums = savedAlbums;
        this.changeDetectorRef.detectChanges();

        console.log('this.savedAlbums: ', this.savedAlbums);
        if (this.loading && this.savedAlbums.length > 0) {
          this.loading = false;
        } else if (this.loading && this.savedAlbums.length === 0) {
          setTimeout(() => {
            if (this.loading) {
              this.loading = false;
            }
          }, 5000);
        }
      }),
    );
  }

  private loadData() {
    this.store.dispatch(new GetUsersFollowedArtists());
    this.store.dispatch(new GetUsersSavedAlbums());
  }

  isTextOverflowing(element: HTMLElement): boolean {
    if (element.scrollWidth > element.clientWidth) {
      return true;
    } else {
      return false;
    }
  }
}
