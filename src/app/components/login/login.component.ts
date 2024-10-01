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
  constructor(private readonly auth: AuthService, private readonly router: Router) {}

  request: Auth = new Auth();

  checkUsername: boolean = true;
  checkPassword: boolean = true;
  showAlert: boolean = false;

  onSubmit(): void {
    let username = document.getElementById('username') as HTMLInputElement;
    let password = document.getElementById('password') as HTMLInputElement;

    if (username.value.trim().length == 0) {
      this.checkUsername = false;
    } else {
      this.checkUsername = true;
    }

    if (password.value.trim().length == 0) {
      this.checkPassword = false;
    } else {
      this.checkPassword = true;
    }

    if (this.checkUsername && this.checkPassword) {
      this.auth.authorization(this.request).subscribe({
        next: (data) => {
          let access_token = data.result?.accessToken;
          if (access_token) {
            localStorage.setItem('access_token', access_token);
            let decode: any = jwtDecode(access_token);
            if (decode.scope === 'ADMIN') {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/orders']);
            }
          } else {
            this.displayAlert();
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          this.displayAlert();
        }
      });
    }
  }

  displayAlert() {
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
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
