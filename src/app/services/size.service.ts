
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Size } from '../class/dto/size';

@Injectable({
  providedIn: 'root'
})
export class SizeService {

  private readonly sizeApi = 'http://localhost:8080/api/sizes';

  constructor(private readonly http: HttpClient) { }

  getAllSize(): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.sizeApi}`, { headers: header });
  }
  createSize(size: Size): Observable<any>{
    const access_token: any = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<Size>(this.sizeApi,size,{headers: headers});
  }
  getSizeById(id: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.sizeApi}/${id}`, { headers: header });
  }
  updateSize(size : Size): Observable<any>{
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.put(`${this.sizeApi}/${size.id}`, size, { headers: header });
  }
  deleteSize(id:string): Observable<any>{
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.delete<void>(`${this.sizeApi}/${id}`,{
      headers: header,
    });
  }
}
