import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'image-store-web';

  @ViewChild(MatSidenav)
  //sidenav!: MatSidenav;
  isMobile = true;
  isCollapsed = false;
  currentLanguage: string = '';
  isAuthenticated: boolean = false;

  //protected menuItems$!: Observable<MenuNodeResponse[]>;

  protected selected: number = -1;

  constructor(
  ) {

  }

  isUserAuthenticated(): boolean {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      this.isAuthenticated = false;
      return false;
    }

    const expiration = localStorage.getItem("expires_in");
    const isoLoginTime = localStorage.getItem("login_time");

    if (!expiration || !isoLoginTime) {
      return false;
    }

    const expiresIn = parseInt(expiration);
    const loginTime = new Date(isoLoginTime);
    const now = new Date();
    const diff = now.getTime() - loginTime.getTime();
    const diffInSeconds = diff / 1000;

    if (diffInSeconds > expiresIn) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('expires_in');
      localStorage.removeItem('login_time');
      this.isAuthenticated = false;
      return false;
    }

    this.isAuthenticated = true;

    return true;
  }

  getCurrentUserName(): string {
    const email = localStorage.getItem('user_email');
    return email ? email : '';
  }

  logout = (): void => {
    localStorage.removeItem('access_token');
    window.location.reload();
  }
}
