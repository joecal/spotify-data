import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { AlbumItem } from 'src/app/models/album.model';
import { Artist } from 'src/app/models/artist.model';
import { LoadingService } from 'src/app/services/loading.service';
import { GetUsersSavedAlbums } from 'src/app/store/actions/user.actions';
import { UserState } from 'src/app/store/state/user.state';
import { List } from 'immutable';

@Component({
  selector: 'spotify-data-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
})
export class AlbumsComponent implements OnInit, OnDestroy {
  @Select(UserState.savedAlbums) albumItems$: Observable<AlbumItem[]>;
  albumItems: List<AlbumItem>;

  private subscription: Subscription;

  constructor(
    private router: Router,
    private store: Store,
    public loadingService: LoadingService,
  ) {
    this.loadingService.startLoading();
    this.subscription = new Subscription();
    this.albumItems = List([]);
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
      this.albumItems$.subscribe((albumItems: AlbumItem[]) => {
        if (albumItems.length) {
          this.albumItems = List(albumItems);
          this.loadingService.stopLoading();
          console.log('this.albumItems: ', this.albumItems);
        } else {
          this.loadingService.stopLoadingTimeout(5000);
        }
      }),
    );
  }

  private loadData() {
    this.store.dispatch(new GetUsersSavedAlbums());
  }

  goToAlbum(albumItem: AlbumItem) {
    this.router.navigateByUrl(`/album/${albumItem.album.id}`);
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
