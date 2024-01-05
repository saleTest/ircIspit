import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenServiceService } from '../token-service.service';
import { ToastrService } from 'ngx-toastr';
import { AppModule } from '../../app.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, AppModule],
  providers: [ToastrService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  errorExists = false;
  errorText = '';

  email: string = '';
  password: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenServiceService,
    private toastrService: ToastrService
  ) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      const { email, password } = form.value;
      this.email = email;
      this.password = password;
      // console.log('Email:', email);
      // console.log('Password:', password);
      this.login();
    }
  }

  login() {
    this.http
      .post<any>('http://localhost:3000/api/login', {
        email: this.email,
        password: this.password,
      })
      .subscribe(
        (response) => {
          this.tokenService.setToken(response.token);
          localStorage.setItem('token', response.token);
          // this.tokenService.setToken(response.token);
          this.router.navigate(['/']);
          this.toastrService.success('Welcome!');
        },
        (error) => {
          // Prikazivanje poruke
          if (error && error.error) {
            this.toastrService.error(error.error, 'Try again!');
            // console.log('Poruka o grešci:', error.error);
          }
        }
      );
  }

  hidePassword: boolean = true;

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
