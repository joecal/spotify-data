import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Album, AlbumItem } from 'src/app/models/album.model';
import { Artist } from 'src/app/models/artist.model';
import { LoadingService } from 'src/app/services/loading.service';
import { GetUsersSavedAlbums } from 'src/app/store/actions/user.actions';
import { UserState } from 'src/app/store/state/user.state';

@Component({
  selector: 'spotify-data-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
})
export class AlbumsComponent implements OnInit, OnDestroy {
  @Select(UserState.savedAlbums) albumItems$: Observable<AlbumItem[]>;
  albumItems: AlbumItem[];

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
      this.albumItems$.subscribe((albumItems: AlbumItem[]) => {
        this.albumItems = albumItems;
        this.changeDetectorRef.detectChanges();
        if (
          this.loadingService.loading &&
          this.albumItems.length > 0
        ) {
          this.loadingService.loading = false;
        } else if (
          this.loadingService.loading &&
          this.albumItems.length === 0
        ) {
          setTimeout(() => {
            if (this.loadingService.loading) {
              this.loadingService.loading = false;
            }
          }, 5000);
        }
        console.log('this.albumItems: ', this.albumItems);
      }),
    );
  }

  private loadData() {
    this.store.dispatch(new GetUsersSavedAlbums());
  }

  isTextOverflowing(element: HTMLElement): boolean {
    if (element.scrollWidth > element.clientWidth) {
      return true;
    } else {
      return false;
    }
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
