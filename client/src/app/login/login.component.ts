import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'spotify-data-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {
    if (this.route.snapshot.queryParams.code) {
      const code = this.route.snapshot.queryParams.code;
      this.authService.getAccessAndRefreshTokens(code);
    }
  }

  logIn(): void {
    this.authService.logIn();
  }
}
