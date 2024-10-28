import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiAddressService {

  private readonly provincesUrl = `https://vapi.vnappmob.com/api/province/`;
  private readonly districtsUrl = `https://vapi.vnappmob.com/api/province/district/{provinceId}`;
  private readonly wardsUrl = `https://vapi.vnappmob.com/api/province/ward/{districtId}`;

  private proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  private apiUrl = 'https://services.giaohangtietkiem.vn/services/shipment/fee';
  private token = '7820937912e01fbab953712330f1d4d2e596b798';

  constructor(private readonly http: HttpClient) { }

  getProvinces(): Observable<any> {
    return this.http.get<any>(this.provincesUrl);
  }

  getDistricts(provinceId: string): Observable<any> {
    const url = this.districtsUrl.replace('{provinceId}', provinceId);
    return this.http.get<any>(url);
  }

  getWards(districtId: string): Observable<any> {
    const url = this.wardsUrl.replace('{districtId}', districtId);
    return this.http.get<any>(url);
  }

  calculateShippingFee(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Token': this.token,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.proxyUrl}${this.apiUrl}`, data, { headers });
  }
}
