import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../class/dto/brand';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private readonly brandApi = 'http://localhost:8080/api/brands';

  constructor(private readonly http: HttpClient) { }

  getAllBrands(): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.brandApi}`, { headers: header });
  }

  getBrandById(id: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.brandApi}/${id}`, { headers: header });
  }
  createBrand(brand: Brand): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<Brand>(this.brandApi, brand, { headers: header });
  }

  updateBrand(brand: Brand): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.put(`${this.brandApi}/${brand.id}`, brand, {
      headers: header,
    });
  }
  deleteBrand(id: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.delete<void>(`${this.brandApi}/${id}`, {
      headers: header,
    });
  }
  getBrandByName(brandName: any): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    let params = new HttpParams({});
    params = params.append('name', brandName);
    return this.http.get(`${this.brandApi}/findByName`, { headers: header, params: params });
  }
}

