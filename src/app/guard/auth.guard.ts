import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const access_token: any = localStorage.getItem('access_token');

  if (!access_token || !isTokenValid(access_token)) {
    router.navigate(['/login']);
    return false;
  }

  const expectedRole: any = route.data['expectedRole'];
  const decodedToken: any = jwtDecode(access_token);
  if (expectedRole && decodedToken.scope !== expectedRole) {
    router.navigate(['/unauthorized']);
    return false;
  }

  // if (state.url.includes('delete-sale') && decodedToken.scope !== 'admin') {
  //   router.navigate(['/unauthorized']);
  //   return false;
  // }

  return true;
};

function isTokenValid (token: string): boolean {
  const decoded: any = jwtDecode(token);
  return decoded.exp > Date.now() / 1000;
}

// function canDeleteSale(decodedToken: any): boolean {
//   return decodedToken.scope === 'admin';
// }



