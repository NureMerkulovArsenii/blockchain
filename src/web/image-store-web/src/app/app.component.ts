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
    const email = localStorage.getItem('user_email');
    return email ? email : '';
  }

  logout = (): void => {
    localStorage.removeItem('access_token');
    window.location.reload();
  }
}
