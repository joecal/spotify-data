import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CoreComponent } from './core.component';
import { CoreRoutingModule } from './core-routing.module';
import { HomeComponent } from './home/home.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { PlaylistsService } from '../services/playlists.service';
import { ArtistsComponent } from './artists/artists.component';
import { AlbumsComponent } from './albums/albums.component';

@NgModule({
  declarations: [
    CoreComponent,
    HomeComponent,
    PlaylistsComponent,
    PlaylistComponent,
    ArtistsComponent,
    AlbumsComponent,
  ],
  imports: [SharedModule, CoreRoutingModule],
  providers: [PlaylistsService],
})
export class CoreModule {}
