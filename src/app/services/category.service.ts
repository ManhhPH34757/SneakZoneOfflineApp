import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../class/dto/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly categoryApi = 'http://localhost:8080/api/categories';

  constructor(private readonly http: HttpClient) { }

  getAllCategories(): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.categoryApi}`, { headers: header });
  }
  getCategoryById(id: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.categoryApi}/${id}`, { headers: header });
  }
  createCategory(category: Category): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<Category>(this.categoryApi, category, { headers: header });
  }
  updateCategory(category: Category): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.put(`${this.categoryApi}/${category.id}`, category, {
      headers: header,
    });
  }

  deleteCategory(id: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.delete<void>(`${this.categoryApi}/${id}`, {
      headers: header,
    });
  }
  getCategoryByName(categoryName: any): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    let params = new HttpParams({});
    params = params.append('name', categoryName);
    return this.http.get(`${this.categoryApi}/findByName`, { headers: header, params: params });
  }
}
