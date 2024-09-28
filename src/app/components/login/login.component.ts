import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Auth } from '../../class/request/auth';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  request: Auth = new Auth();

  onSubmit(): void {
    this.auth.authorization(this.request).subscribe((data) => {
      let access_token = data.result.accessToken;
      if (access_token) {
        localStorage.setItem('access_token', access_token);
        let decode: any = jwtDecode(access_token);
        if (decode.scope === 'ADMIN') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/orders']);
        }
      } else {
        alert('Login fail');
      }
    });
  }

  ngOnInit(): void {
    let access_token: any = localStorage.getItem('access_token');

    if (access_token) {
      let decode: any = jwtDecode(access_token);
      if (decode.exp * 1000 >  Date.now()) {
        if (decode.scope === 'ADMIN') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/orders']);
        }
      } else {
        localStorage.removeItem('access_token');
      }
    }
  }
}
