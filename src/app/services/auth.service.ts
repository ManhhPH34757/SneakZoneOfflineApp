import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '../class/request/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authApi = 'http://localhost:8080/api/auth/token';

  constructor(private http: HttpClient) { }

  authorization(request: Auth): Observable<any> {
    return this.http.post(this.authApi, request);
  }

}
