import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private staffAPI: string ='http://localhost:8080/api/staffs'

  constructor(private httpClient:HttpClient) { }

  geStaff(): Observable<any> {
    const access_token: any = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });
    return this.httpClient.get(`${this.staffAPI}`,{headers});
  }

}
