import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerRequest } from '../class/request/customer-request';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customerApi = "http://localhost:8080/api/customers";

  constructor(private http: HttpClient) { }

  getAllCustomers(): Observable<any>{
    const access_token = localStorage.getItem('access_token');
    const header =  new HttpHeaders({
      Authorization: 'Bearer ${access_token}',
      'Content-Type':'application/json'
    });
    return this.http.get('${this.customerApi}', { headers: header });
  }

  createCustomer(customer: CustomerRequest): Observable<any>{
    const access_token = localStorage.getItem('access_token');
    const header =  new HttpHeaders({
      Authorization: 'Bearer ${access_token}',
      'Content-Type':'application/json'
    });
    return this.http.post('${this.customerApi}',customer, { headers: header });
  }

}
