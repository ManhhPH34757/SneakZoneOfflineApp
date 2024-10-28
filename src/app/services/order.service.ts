import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../class/dto/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly orderApi = 'http://localhost:8080/api/orders';

  constructor(private readonly http: HttpClient) { }

  getOrdersInStoreUnpaid(idStaff: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    let param = new HttpParams({});
    param = param.append('idStaff', idStaff);
    return this.http.get(`${this.orderApi}/orders-instore-unpaid`, { headers: header, params: param });
  }

  createOrder(order: Order): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post(`${this.orderApi}`, order, { headers: header });
  }

  updateOrder(order: Order): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.put(`${this.orderApi}/${order.id}`, order, { headers: header });
  }

  getById(id: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.orderApi}/${id}`, { headers: header });
  }

  deleteById(id: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.delete(`${this.orderApi}/${id}`, { headers: header });
  }

}
