import { CanActivateFn } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';


export const authGuard: CanActivateFn = (route, state ) => {
  const token = localStorage.getItem('access_token');

  const jwtHelper = new JwtHelperService();
  if (token && !jwtHelper.isTokenExpired(token)) {
    return true;
  }

  //ToDo: check if we can recieve new token with refresh token

  return false;
};
