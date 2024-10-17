import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SoleService {
  private readonly soleApi = 'http://localhost:8080/api/soles';

  constructor(private readonly http: HttpClient) {}

  getAllSoles(): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.soleApi}`, { headers: header });
  }

  getSoleByName(soleName: any): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    let params = new HttpParams({});
    params = params.append('name', soleName);
    return  this.http.get(`${this.soleApi}/findByName`, { headers: header, params: params });
  }
}
