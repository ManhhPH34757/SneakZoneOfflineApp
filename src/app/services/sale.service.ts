import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sale } from '../class/dto/sale';
import { FilterSale } from '../class/request/filter-sale';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private saleAPI = 'http://localhost:8080/api/sales'

  constructor(private readonly http: HttpClient) { }

  getAll(filter?: FilterSale): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });

    let params = new HttpParams({})

    if(filter) {
      if(filter.saleCode) {
        params = params.append('saleCode', filter.saleCode);
      }
      if(filter.saleName) {
        params = params.append('saleName', filter.saleName);
      }
      if(filter.startDate) {
        params = params.append('startDate',filter.startDate);
      }  
      if(filter.endDate) {
        params = params.append('endDate',filter.endDate);
      }
    }

    return this.http.get(`${this.saleAPI}`,{headers:header,params});
  }

  create(sale: Sale): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post(`${this.saleAPI}`, sale, {headers:header})
  }

  getSaleById(id: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.saleAPI}/${id}`,{headers:header})
  }

  updateSale(sale: Sale):Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });

    return this.http.put(`${this.saleAPI}/${sale.id}`,sale,{headers: header})
  }

  delete(id: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });

    return this.http.delete(`${this.saleAPI}/${id}`,{headers:header});
  }

  checkexistsSaleCode(saleCode: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });

    let params = new HttpParams({})
    params = params.append('saleCode', saleCode)
    return this.http.get(`${this.saleAPI}/check-exists-sale-code`,{headers:header,params})
  }

}
