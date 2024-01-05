import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { HttpClient } from '@angular/common/http';
import { AppModule } from '../../app.module';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, AppModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  errorExists = false;
  errorText = '';

  fullName: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      const { fullName, email, password } = form.value;
      this.fullName = fullName;
      this.email = email;
      this.password = password;
    }
    this.register();
  }

  register(): void {
    const newUser = {
      username: this.fullName,
      email: this.email,
      password: this.password,
    };
    this.http.post('http://localhost:3000/api/register', newUser).subscribe(
      (response: any) => {
        // console.log('Registration successful!', response);
        window.location.reload();
        this.toastrService.success(
          'Please login again!',
          'Registration successful!'
        );
      },
      (error: any) => {
        // console.error('Registration failed:', error);
        if (error) {
          this.toastrService.error(error.error, 'Try again!');
        }
      }
    );
  }
}
