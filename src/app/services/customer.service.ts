import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerRequest } from '../class/request/customer-request';
import { FilterCustomer } from '../class/request/filter-customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly customerApi: string = "http://localhost:8080/api/customers";

  constructor(private readonly http: HttpClient) { }

  getAllCustomers(page: number, size: number, filter?: FilterCustomer): Observable<any>{
    const access_token: any = localStorage.getItem('access_token');
    const headers =  new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type':'application/json',
      page: page.toString(),
      size: size.toString(),

    });
    let params = new HttpParams({});
    if(filter){
      if(filter.fullNameOrPhoneNumber){
        params = params.append('fullNameOrPhoneNumber', filter.fullNameOrPhoneNumber);
      }
    }
    return this.http.get(this.customerApi,{headers: headers, params: params});
  }

  createCustomer(customer: CustomerRequest): Observable<any>{
    const access_token = localStorage.getItem('access_token');
    const header =  new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type':'application/json'
    });
    return this.http.post(`${this.customerApi}`,customer, { headers: header });
  }

  updateCustomer( customer: CustomerRequest): Observable<any>{
    const access_token = localStorage.getItem('access_token');
    const header =  new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type':'application/json'
    });
    return this.http.put(`${this.customerApi}/${customer.id}`,customer, { headers: header });
  }

  getCustomerById(id: string): Observable<any>{
    const access_token = localStorage.getItem('access_token');
    const headers =  new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type':'application/json',
      });
      return this.http.get(`${this.customerApi}/${id}`,{headers: headers})
  }

  checkExistsCustomerCode(customerCode: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header =  new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type':'application/json'
    });

    let params = new HttpParams({});

    params = params.append("customerCode", customerCode);

    return this.http.get(`${this.customerApi}/checkCustomerCode`, {headers: header, params: params});
  }

  checkExistsPhoneNumber(phoneNumber: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header =  new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type':'application/json'
    });

    let params = new HttpParams({});

    params = params.append("phoneNumber", phoneNumber);

    return this.http.get(`${this.customerApi}/checkPhoneNumber`, {headers: header, params: params});
  }

  checkExistsEmail(email: string): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header =  new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type':'application/json'
    });

    let params = new HttpParams({});

    params = params.append("email", email);

    return this.http.get(`${this.customerApi}/checkEmail`, {headers: header, params: params});
  }

  getForOrders(): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header =  new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type':'application/json'
    });
    return this.http.get(`${this.customerApi}/get-for-orders`, {headers: header});
  }

}
