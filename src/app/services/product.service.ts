import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductRequest } from '../class/request/product-request';
import { FilterProduct } from '../class/request/filter-product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productApi = 'http://localhost:8080/api/products';

  constructor(private readonly http: HttpClient) {}

  getAllProducts(page: number, size: number, filter?: FilterProduct): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
      page: page.toString(),
      size: size.toString(),

    });
    let params = new HttpParams({});

    if (filter) {
      if (filter.productName) {
          params = params.append('productName', filter.productName);
      }
      if (filter.idBrand) {
          params = params.append('idBrand', filter.idBrand);
      }
      if (filter.idCategory) {
          params = params.append('idCategory', filter.idCategory);
      }
      if (filter.idMaterial) {
          params = params.append('idMaterial', filter.idMaterial);
      }
      if (filter.idSole) {
          params = params.append('idSole', filter.idSole);
      }
      if (filter.min !== undefined) {
          params = params.append('min', filter.min.toString());
      }
      if (filter.max !== undefined) {
          params = params.append('max', filter.max.toString());
      }
  }
    return this.http.get(this.productApi, { headers: header, params: params });
  }

  getProductEditById(id: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.productApi}/edit/${id}`, { headers: header });
  }

  getProductById(id: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.productApi}/${id}`, { headers: header });
  }

  createProduct(product: ProductRequest): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post(this.productApi, product, { headers: header });
  }

  updateProduct(product: ProductRequest): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.put(`${this.productApi}/${product.id}`, product, {
      headers: header,
    });
  }

  deleteProduct(id: string): Observable<void> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.delete<void>(`${this.productApi}/${id}`, { headers: header });
  }

  checkExistsProductCode(productCode: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    let params = new HttpParams({});
    params = params.append("productCode", productCode);

    return this.http.get(`${this.productApi}/check-exists-product-code`, {headers: header, params: params});
  }

  checkExistsProductName(productName: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    let params = new HttpParams({});
    params = params.append("productName", productName);

    return this.http.get(`${this.productApi}/check-exists-product-name`, {headers: header, params: params});
  }

  getByProductCode(productCode: any): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    let params = new HttpParams({});
    params = params.append("productCode", productCode);

    return this.http.get(`${this.productApi}/get-by-product-code`, {headers: header, params: params});
  }

}
