import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
// import { UserService } from '../user.service';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../material.module';
import { AppComponent } from '../../app.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  errorExists = false;
  errorText = '';

  fullName: string = '';
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

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
        console.log('Registration successful!', response);
        //
        // Ovdje možete dodati dodatne logike ili preusmjeriti korisnika na drugu stranicu nakon registracije
      },
      (error: any) => {
        console.error('Registration failed:', error);
      }
    );
  }

  // showSuccessMessage() {
  //   this.snackBar.open('Uspesno ste kreirali nalog.', 'Zatvori', {
  //     duration: 3000, // Vreme prikazivanja Snackbar-a u milisekundama
  //     panelClass: 'success-snackbar', // Opciona CSS klasa za dodatno stilizovanje
  //   });
  // }
}
