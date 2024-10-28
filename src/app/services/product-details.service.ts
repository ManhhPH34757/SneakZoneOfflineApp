import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailsService {

  private readonly productDetailsApi = 'http://localhost:8080/api/product-details';

  constructor(private readonly http: HttpClient) { }

  checkExists(idProduct: string, idColor: string, idSize: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });

    let params = new HttpParams({});
    params = params.append('idProduct', idProduct);
    params = params.append('idColor', idColor);
    params = params.append('idSize', idSize);
    return this.http.get(`${this.productDetailsApi}/${idProduct}/check`,  { headers: header, params: params });
  }

  getAllProductDetailsByIdProduct(idProduct: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.productDetailsApi}/${idProduct}`, { headers: header });
  }

  createProductDetails(product: any): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return  this.http.post(`${this.productDetailsApi}/${product.idProduct}`, product, { headers: header });
  }

  updateProductDetails(product: any): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return  this.http.put(`${this.productDetailsApi}/${product.idProduct}/${product.id}`, product, { headers: header });
  }

  checkExistsByIdProduct(idProduct: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });

    let params = new HttpParams({});
    params = params.append('idProduct', idProduct);

    return this.http.get(`${this.productDetailsApi}/exists-products`,  { headers: header, params: params });
  }


  // findTop5ProductsByPeriod(priod: string): Observable<any> {
  //   const access_token = localStorage.getItem('access_token');
  //   const header = new HttpHeaders({
  //     Authorization: `Bearer ${access_token}`,
  //     'Content-Type': 'application/json',
  //   });

  //   let params = new HttpParams({});
  //   params = params.append('priod', priod);

  //   return this.http.get(`${this.productDetailsApi}/top5p`, {
  //     headers: header,
  //     params: params,
  //   });
  // }

  // findRevenueByPeriod(priod: string): Observable<any> {
  //   const access_token = localStorage.getItem('access_token');
  //   const header = new HttpHeaders({
  //     Authorization: `Bearer ${access_token}`,
  //     'Content-Type': 'application/json',
  //   });

  //   let params = new HttpParams({});
  //   params = params.append('priod', priod);

  //   return this.http.get(`${this.productDetailsApi}/revenue`, {
  //     headers: header,
  //     params: params,
  //   });
  // }
}

