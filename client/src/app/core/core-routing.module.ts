import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../services/auth-guard.service';
import { AlbumsComponent } from './albums/albums.component';
import { ArtistsComponent } from './artists/artists.component';
import { CoreComponent } from './core.component';
import { HomeComponent } from './home/home.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { PlaylistsComponent } from './playlists/playlists.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: CoreComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivateChild: [AuthGuardService],
      },
      {
        path: 'artists',
        component: ArtistsComponent,
        canActivateChild: [AuthGuardService],
      },
      {
        path: 'albums',
        component: AlbumsComponent,
        canActivateChild: [AuthGuardService],
      },
      {
        path: 'playlists',
        component: PlaylistsComponent,
        canActivateChild: [AuthGuardService],
      },
      {
        path: 'playlist/:id',
        component: PlaylistComponent,
        canActivateChild: [AuthGuardService],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
