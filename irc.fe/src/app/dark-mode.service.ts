import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  isDarkMode = false;

  constructor() {}

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    // Dodajte logiku za promenu teme ovdje
  }
}
