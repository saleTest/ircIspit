import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import * as jwt_decode from 'jwt-decode';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
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
      const tokenPayload = token.split('.')[1]; // Get the payload part of the token
      const decodedPayload = tokenPayload ? atob(tokenPayload) : null; // Decode the Base64 encoded string

      this.decodedToken = decodedPayload ? JSON.parse(decodedPayload) : null;
      console.log(this.decodedToken); // Display the decoded token information

      if (this.decodedToken) {
        this.userId = this.decodedToken.id; // Accessing 'id' from the decoded token
        this.fetchUserData();
        console.log('User ID:', this.userId); // Display the user ID
      }
    } else {
      console.log('Token not found in Local Storage');
    }
  }

  constructor(private http: HttpClient) {}

  updateProfile() {
    if (this.validateInputs()) {
      console.log(this.email, this.password);
      this.http
        .put<any>(`http://localhost:3000/api/update/${this.userId}`, {
          name: this.name,
          email: this.email,
          password: this.password,
        })
        .subscribe(
          (response) => {
            console.log(response, 'Uspesno');
          },
          (error) => {
            console.log(error.message);
          }
        );
    } else {
      console.log('Molimo Vas da unesete ispravne podatke.');
    }
  }

  fetchUserData() {
    this.http
      .get<any>(`http://localhost:3000/api/user/${this.userId}`)
      .subscribe(
        (userData) => {
          console.log('User Data:', userData);
          const { username, email } = userData.user;
          // console.log(username, email);
          this.name = username;
          this.email = email;
          // Ovdje možete manipulirati podacima kako želite (npr. prikazati na korisničkom sučelju)
        },
        (error) => {
          console.error('Error fetching user data:', error);
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
      console.log('Molimo Vas da unesete ime.');
      return false;
    }

    if (!this.email || this.email.trim() === '') {
      console.log('Molimo Vas da unesete ispravnu email adresu.');
      return false;
    }

    if (!this.password || this.password.trim() === '') {
      console.log('Molimo Vas da unesete ispravni password.');
      return false;
    }

    return true;
  }
}
