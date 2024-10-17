import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {

  private readonly apiUrl = 'http://localhost:8080/api/images/upload';

  constructor(private readonly http: HttpClient) {}

  uploadImages(files: File[]): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
    });

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file, file.name);
    });

    return this.http.post(this.apiUrl, formData, { headers: header});
  }

  getImageList(): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const header = new HttpHeaders({
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<any>('http://localhost:8080/api/images/list', { headers: header});

  }

}
