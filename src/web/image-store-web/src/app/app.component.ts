import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AccountService } from './core/services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'image-store-web';

  @ViewChild(MatSidenav)
  isMobile = true;
  isCollapsed = false;
  currentLanguage: string = '';
  isAuthenticated: boolean = false;

  protected selected: number = -1;

  constructor(
    private accountService: AccountService,
  ) {
    this.isUserAuthenticated();

  }

  isUserAuthenticated(): boolean {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      this.isAuthenticated = false;
      return false;
    }

    this.isAuthenticated = true;

    return true;
  }

  getCurrentUserName(): string {
    const email = localStorage.getItem('username');
    return email ? email : '';
  }

  logout = (): void => {
    localStorage.removeItem('access_token');
    this.accountService.logout().subscribe({
      next: () => {
        window.location.reload();
      }
    });

  }
}
