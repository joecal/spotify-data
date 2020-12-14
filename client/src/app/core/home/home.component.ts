import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Album } from 'src/app/models/album.model';
import { Artist } from 'src/app/models/artist.model';
import { LoadingService } from 'src/app/services/loading.service';
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

  private subscription: Subscription;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private store: Store,
    private router: Router,
    public loadingService: LoadingService,
  ) {
    this.loadingService.loading = true;
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
        this.loadingService.loading = false;
        console.log('this.followedArtists: ', this.followedArtists);
      }),
    );
    this.subscription.add(
      this.savedAlbums$.subscribe((savedAlbums: Album[]) => {
        this.savedAlbums = savedAlbums;
        this.changeDetectorRef.detectChanges();
        console.log('this.savedAlbums: ', this.savedAlbums);
        this.loadingService.loading = false;
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

  goToArtist(artist: Artist) {
    // this.router.navigateByUrl(`/artist/${artist.id}`);
  }

  getArtistNames(artists: Artist[]) {
    let name: string = '';
    artists.forEach((artist: Artist) => {
      name = name + artist.name + ', ';
    });
    name = name.substring(0, name.length - 2);
    return name;
  }
}
