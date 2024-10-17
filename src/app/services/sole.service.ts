import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sole } from '../class/dto/sole';

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

  createSoles(sole: Sole): Observable<any>{
    const access_token: any = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<Sole>(this.soleApi,sole,{headers: headers});
  }

  getSoleById(id: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return  this.http.get(`${this.soleApi}/${id}`, { headers: header });
  }

  updateSole(sole : Sole): Observable<any>{
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.put(`${this.soleApi}/${sole.id}`, sole, { headers: header });
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

  deleteSole(id:string): Observable<any>{
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.delete<void>(`${this.soleApi}/${id}`,{
      headers: header,
    });
  }
  
}
