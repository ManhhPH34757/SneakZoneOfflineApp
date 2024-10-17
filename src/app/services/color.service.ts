import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Color } from '../class/dto/color';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  private readonly colorApi = 'http://localhost:8080/api/colors';

  constructor(private readonly http: HttpClient) { }

  getAllColor(): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.colorApi}`, { headers: header });
  }

  getColorById(id: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.colorApi}/${id}`, { headers: header });
  }

  createColor(color: Color): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<Color>(this.colorApi, color, { headers: header });
  }

  updateColor(color: Color): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.put(`${this.colorApi}/${color.id}`, color, {
      headers: header,
    });
  }

  deleteColor(id: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.delete<void>(`${this.colorApi}/${id}`, {
      headers: header,
    });
  }

  getColorByName(colorName: any): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    let params = new HttpParams({});
    params = params.append('name', colorName);
    return  this.http.get(`${this.colorApi}/findByName`, { headers: header, params: params });
  }
  
}
