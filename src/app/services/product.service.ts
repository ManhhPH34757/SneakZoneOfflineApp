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

  constructor(private readonly http: HttpClient) { }

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

    return this.http.get(this.productApi, { headers: header, params });
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

  checkExistsByIdBrand(idBrand: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    let params = new HttpParams({});
    params = params.append('idBrand', idBrand);
    return this.http.get(`${this.productApi}/checkExistsByIdBrand`, { headers: header, params: params });
  }

  checkExistsByIdCategory(idCategory: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    let params = new HttpParams({});
    params = params.append('idCategory', idCategory);
    return this.http.get(`${this.productApi}/checkExistsByIdCategory`, { headers: header, params: params });
  }
}
