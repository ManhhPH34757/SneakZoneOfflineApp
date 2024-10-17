import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StaffResponse } from '../class/response/staff-response';
import { StaffRequest } from '../class/request/staff-request';
import { FilterStaff } from '../class/request/filter-staff';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private staffAPI: string ='http://localhost:8080/api/staffs'

  constructor(private httpClient:HttpClient) { }

  getStaff(page: number, size: number, filter?: FilterStaff): Observable<any> {
    const access_token: any = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
      page: page.toString(),
      size: size.toString(),
    });

    let params = new HttpParams({});

    if(filter) {
      if(filter.staffCode) {
        params = params.append('staffCode', filter.staffCode);
      }
      if(filter.fullName) {
        params = params.append('fullName', filter.fullName);
      }
      if(filter.gender) {
        params = params.append('gender', filter.gender);
      }
      if(filter.email) {
        params = params.append('email', filter.email);
      }
      if (filter.isActive !== undefined) {  
        params = params.append('isActive', filter.isActive);
      }
      if(filter.phoneNumber) {
        params = params.append('phoneNumber', filter.phoneNumber);
      }
    }

    return this.httpClient.get(`${this.staffAPI}`,{headers : header, params});
  }

  createStaff(staff: StaffRequest): Observable<any> {
    const access_token: any = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.httpClient.post(this.staffAPI, staff, {headers})
  }

  getStaffById(id: string): Observable<any> {
    const access_token: any = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient.get(`${this.staffAPI}/${id}`,{headers})
  }

  updateStaff(staff: StaffRequest): Observable<any> {
    const access_token: any = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.httpClient.put(`${this.staffAPI}/${staff.id}`, staff, {headers})
  }

  checkexistsStaffCode(staffCode: string): Observable<any> {
    const access_token: any = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    let params = new HttpParams({})
    params = params.append('staffCode', staffCode);

    return this.httpClient.get(`${this.staffAPI}/check-exists-staff-code`,{headers,params})
  }

  checkexistsPhoneNumber(phoneNumber: string): Observable<any> {
    const access_token: any = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    let params = new HttpParams({})
    params = params.append('phoneNumber', phoneNumber);

    return this.httpClient.get(`${this.staffAPI}/check-exists-staff-phoneNumber`,{headers,params})
  }

  checkexistsEmail(Email: string): Observable<any> {
    const access_token: any = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    let params = new HttpParams({})
    params = params.append('email', Email);

    return this.httpClient.get(`${this.staffAPI}/check-exists-staff-Email`,{headers,params})
  }

  checkexistsUsername(username: string): Observable<any> {
    const access_token: any = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    let params = new HttpParams({})
    params = params.append('username', username);

    return this.httpClient.get(`${this.staffAPI}/check-exists-staff-name`,{headers,params})
  }



}
