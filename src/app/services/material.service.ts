import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Material } from '../class/dto/material';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  private readonly materialApi = 'http://localhost:8080/api/materials';

  constructor(private readonly http: HttpClient) {}

  getAllMaterials(): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.materialApi}`, { headers: header });
  }
  createMaterials(material: Material): Observable<any>{
    const access_token: any = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post(this.materialApi,material,{headers: headers});
  }
  getMaterialById(id: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return  this.http.get(`${this.materialApi}/${id}`, { headers: header });
  }

  getMaterialByName(materialName: any): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    let params = new HttpParams({});
    params = params.append('name', materialName);
    return  this.http.get(`${this.materialApi}/findByName`, { headers: header, params: params });
  }
  updateMaterial(material: Material): Observable<any>{
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.put(`${this.materialApi}/${material.id}`, material, { headers: header });
  }
  deleteMaterial(id:string): Observable<any>{
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.delete<void>(`${this.materialApi}/${id}`,{
      headers: header,
    });
  }
}
