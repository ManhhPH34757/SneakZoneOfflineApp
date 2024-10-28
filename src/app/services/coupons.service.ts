import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coupons } from '../class/dto/coupons';
import { FilterCoupon } from '../class/request/filter-coupons';

@Injectable({
  providedIn: 'root'
})
export class CouponsService {

  private couponAPI ='http://localhost:8080/api/coupons';
  constructor(private readonly http: HttpClient){}

  getAll(filter?: FilterCoupon): Observable<any>{
    const access_token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type':'application/json',
    });
    let params = new HttpParams({})

    if(filter){
      if(filter.couponsCode){
        params = params.append('couponsCode', filter.couponsCode);
      }
      if(filter.couponsName){
        params = params.append('couponsName', filter.couponsName);
      }
      if(filter.startDate){
        params = params.append('startDate', filter.startDate);
      }
      if(filter.endDate){
        params = params.append('endDate', filter.endDate);
      }
    }
    return this.http.get(`${this.couponAPI}`, {headers : headers, params});
  }

  createCoupon( coupon: Coupons): Observable<any>{
    const access_token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type':'application/json',
    })
    return this.http.post(`${this.couponAPI}`,coupon, {headers : headers})
  }

  getCouponById(id: string): Observable<any>{
    const access_token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type':'application/json',
    })
    return this.http.get(`${this.couponAPI}/${id}`, {headers : headers})
  }

  updateCoupon( coupon: Coupons): Observable<any>{
    const access_token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type':'application/json',
    })
    return this.http.put(`${this.couponAPI}/${coupon.id}`,coupon, {headers : headers})
  }

  delete(id: string): Observable<any>{
    const access_token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type':'application/json',
    })
    return this.http.delete(`${this.couponAPI}/${id}`, {headers : headers})
  }
}
