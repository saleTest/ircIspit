import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import * as jwt_decode from 'jwt-decode';
import { MaterialModule } from '../../material.module';
import { AppModule } from '../../app.module';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, AppModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  decodedToken: any;

  errorExists = false;
  errorText = '';

  name: string = '';
  email: string = '';
  password: string = '';
  passwordConfirm: string = '';
  userId: string = '';

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenPayload = token.split('.')[1];
      const decodedPayload = tokenPayload ? atob(tokenPayload) : null;

      this.decodedToken = decodedPayload ? JSON.parse(decodedPayload) : null;
      // console.log(this.decodedToken);

      if (this.decodedToken) {
        this.userId = this.decodedToken.id;
        this.fetchUserData();
        // console.log('User ID:', this.userId); // Display the user ID
      }
    } else {
      // console.log('Token not found in Local Storage');
      this.toastrService.warning(
        'Token not found in Local Storage',
        'Please reload page!'
      );
    }
  }

  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  updateProfile() {
    if (this.validateInputs()) {
      // console.log(this.email, this.password);
      this.http
        .put<any>(`http://localhost:3000/api/update/${this.userId}`, {
          name: this.name,
          email: this.email,
          password: this.password,
        })
        .subscribe(
          (response) => {
            // console.log(response, 'Uspesno');
            this.toastrService.success(response.message);
          },
          (error) => {
            // console.log(error.message);
            // console.error('Error:', error);
            if (error) this.toastrService.error(error.message);
          }
        );
    } else {
      this.toastrService.warning('Please enter correct information.');
      // console.log('Please enter correct information.');
    }
  }

  fetchUserData() {
    this.http
      .get<any>(`http://localhost:3000/api/user/${this.userId}`)
      .subscribe(
        (userData) => {
          // console.log('User Data:', userData);
          const { username, email } = userData.user;
          // console.log(username, email);
          this.name = username;
          this.email = email;
        },
        (error) => {
          console.error('Error fetching user data:', error);
          this.toastrService.error('Error fetching user data:', error);
        }
      );
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const { name, email, password, passwordConfirm } = form.value;
      this.name = name;
      this.email = email;
      if (password === passwordConfirm) {
        this.password = password;
        this.passwordConfirm = passwordConfirm;
        this.updateProfile();
      }
    }
  }

  validateInputs(): boolean {
    if (!this.name || this.name.trim() === '') {
      // console.log('Please enter a name.');
      this.toastrService.error('Please enter a name.');
      return false;
    }

    if (!this.email || this.email.trim() === '') {
      this.toastrService.error('Please enter the correct email address.');
      // console.log('Please enter the correct email address.');
      return false;
    }

    if (!this.password || this.password.trim() === '') {
      this.toastrService.error('Please enter the correct password.');
      // console.log('Please enter the correct password.');
      return false;
    }

    return true;
  }
}
