import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderDetails } from '../class/dto/order-details';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailsService {

  private readonly orderDetailsApi = 'http://localhost:8080/api/order-details';

  constructor(private readonly http: HttpClient) { }

  getOrderDetailsByIdOrders(idOrder: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    let param = new HttpParams({});
    param = param.append('idOrder', idOrder);
    return this.http.get(`${this.orderDetailsApi}`, { headers: header, params: param });
  }

  createOrderDetails(orderDetails: OrderDetails): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post(`${this.orderDetailsApi}`, orderDetails, { headers: header });
  }

  updateOrderDetails(orderDetails: OrderDetails): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.put(`${this.orderDetailsApi}/${orderDetails.id}`, orderDetails, { headers: header });
  }

  checkExistsProductInOrder(idProductDetails: string, idOrders: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    let param = new HttpParams({});
    param = param.append('idProductDetails', idProductDetails);
    param = param.append('idOrders', idOrders);
    return this.http.get(`${this.orderDetailsApi}/check-exists-product-in-order`, { headers: header, params: param });
  }

  getOrderDetailByIdProductDetailsAndIdOrders(idProductDetails: string, idOrders: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    let param = new HttpParams({});
    param = param.append('idProductDetails', idProductDetails);
    param = param.append('idOrders', idOrders);
    return this.http.get(`${this.orderDetailsApi}/get-order-detail-by-product-details-and-id-orders`, { headers: header, params: param });
  }

  getById(id: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.orderDetailsApi}/${id}`, { headers: header });
  }

  deleteById(id: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.http.delete(`${this.orderDetailsApi}/${id}`, { headers: header });
  }
}
