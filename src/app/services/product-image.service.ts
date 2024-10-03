import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductImageService {

  private readonly productImageApi = 'http://localhost:8080/api/product-images';

  constructor(private readonly http: HttpClient) { }

  getProductImagesById(idProduct: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return  this.http.get(`${this.productImageApi}/${idProduct}`, { headers: header });

  }

}
