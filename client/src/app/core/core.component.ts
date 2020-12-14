import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { LoadingPipePipe } from './pipes/loading-pipe.pipe';

@Component({
  selector: 'spotify-data-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss'],
  providers: [LoadingPipePipe],
})
export class CoreComponent implements OnInit, OnDestroy {
  toolBarTitle: string;
  mobileQuery: MediaQueryList;
  loading: boolean;

  private subscription: Subscription;
  private mobileQueryListener: () => void;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    public loadingService: LoadingService,
  ) {
    this.subscription = new Subscription();
    this.toolBarTitle = this.setToolbarTitle(this.router.url);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () =>
      changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener(
      'change',
      this.mobileQueryListener,
    );
  }

  ngOnInit() {
    this.subscription.add(
      this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          this.toolBarTitle = this.setToolbarTitle(event.url);
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.mobileQuery.removeEventListener(
      'change',
      this.mobileQueryListener,
    );
  }

  setToolbarTitle(url: string): string {
    switch (url) {
      case '/home':
        return 'Home';
      case '/artists':
        return 'Artists';
      case '/albums':
        return 'Albums';
      case '/playlists':
        return 'Playlists';
      default:
        return '';
    }
  }

  logOut() {
    this.authService.logOut();
  }
}
