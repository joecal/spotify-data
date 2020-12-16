import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { List } from 'immutable';

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
    private store: Store,
    private router: Router,
    private loadingService: LoadingService,
  ) {
    this.loadingService.startLoading();
    this.subscription = new Subscription();
    this.followedArtists = List([]).toArray();
    this.savedAlbums = List([]).toArray();
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
        if (followedArtists.length) {
          this.followedArtists = List(followedArtists).toArray();
          this.loadingService.stopLoading();
          console.log('this.followedArtists: ', this.followedArtists);
        } else {
          this.loadingService.stopLoadingTimeout(5000);
        }
      }),
    );
    this.subscription.add(
      this.savedAlbums$.subscribe((savedAlbums: Album[]) => {
        if (savedAlbums.length) {
          this.savedAlbums = List(savedAlbums).toArray();
          this.loadingService.stopLoading();
          console.log('this.savedAlbums: ', this.savedAlbums);
        } else {
          this.loadingService.stopLoadingTimeout(5000);
        }
      }),
    );
  }

  private loadData() {
    this.store.dispatch(new GetUsersFollowedArtists());
    this.store.dispatch(new GetUsersSavedAlbums());
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
