import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductImage } from '../class/dto/product-image';

@Injectable({
  providedIn: 'root',
})
export class ProductImageService {
  private readonly productImageApi = 'http://localhost:8080/api/product-images';

  constructor(private readonly http: HttpClient) {}

  getProductImagesById(idProduct: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.productImageApi}/${idProduct}`, {
      headers: header,
    });
  }

  createProductImages(productImage: ProductImage): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post(`${this.productImageApi}`, productImage, {
      headers: header,
    });
  }

  deleteProductImageByIdProduct(idProduct: string): Observable<void> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.delete<void>(`${this.productImageApi}/${idProduct}`, { headers: header });
  }
}
