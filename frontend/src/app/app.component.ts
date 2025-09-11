import { Component, Inject, OnInit } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService } from './auth/auth.service';
import { MenuComponent } from './shared/components/menu/menu.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSlideToggleModule, MenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'angular-docker';

  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    @Inject(TranslateService) private translate: TranslateService,
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.authService.loggedChanged$.subscribe((isLogged) => (this.isLoggedIn = isLogged));

    this.isLoggedIn = this.authService.isLogged();
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }
}
