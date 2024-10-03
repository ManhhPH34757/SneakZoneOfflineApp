import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '../class/request/auth';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authApi = 'http://localhost:8080/api/auth/token';

  constructor(private readonly http: HttpClient) {}

  authorization(request: Auth): Observable<any> {
    return this.http.post(this.authApi, request);
  }

  getRole(): string {
    const token: any = localStorage.getItem('access_token');
    const decoded: any = jwtDecode(token);
    return decoded.scope;
  }
}
