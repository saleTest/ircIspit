import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, NgForm, Validators } from '@angular/forms';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css',
})
export class AboutUsComponent {
  showEmailForm = false;

  errorExists = false;
  errorText = '';

  email = new FormControl('', [Validators.required, Validators.email]);
  message = new FormControl('', [Validators.required]);

  sendEmail(form: NgForm) {
    this.email.setValue(form.value.email);
    this.message.setValue(form.value.message);

    if (this.email.invalid) {
      this.errorExists = true;
      this.errorText = 'Email is not correct!';
      return;
    }

    if (this.message.invalid) {
      this.errorExists = true;
      this.errorText = 'Password is empty!';
      return;
    }

    // Logika za slanje e-maila
    console.log('Slanje e-maila:');
    console.log('Email:', this.email.value);
    console.log('Poruka:', this.message.value);
  }
}
