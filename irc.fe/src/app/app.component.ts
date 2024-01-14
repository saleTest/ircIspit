import { Component, HostListener, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';

import { Router, RouterModule, RouterOutlet } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { FormsModule } from '@angular/forms';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { DarkModeService } from './dark-mode.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProductsComponentComponent } from './pages/products-component/products-component.component';
import { ToastrService } from 'ngx-toastr';
import { FooterComponent } from './components/footer/footer.component';
import { MouseSimulationComponent } from './mouseMovement/mouse-simulation/mouse-simulation.component';
import { ChatBotComponent } from './chat/chat-bot/chat-bot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    RouterOutlet,
    MaterialModule,
    HeaderComponent,
    FooterComponent,
    FormsModule,
    WelcomeComponent,
    AppComponent,
    HttpClientModule,
    ProductsComponentComponent,
    MouseSimulationComponent,
    ChatBotComponent,
  ],
  // providers: [ToastrService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'irc.fe';

  get isDarkMode(): boolean {
    return this.darkModeService.isDarkMode;
  }
  constructor(
    private darkModeService: DarkModeService,
    private http: HttpClient,
    protected router: Router
  ) {}

  onToggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }

  // @HostListener('document:mousemove', ['$event'])
  // onMouseMove(event: MouseEvent) {
  //   const mouseX = event.clientX;
  //   const mouseY = event.clientY;

  //   this.http
  //     .post('http://localhost:3000/api/mouse-movement', {
  //       x: mouseX,
  //       y: mouseY,
  //     })
  //     .subscribe((response) => {
  //       console.log('Podaci poslati na server:', response);
  //     });
  // }

  // isDarkMode = false;

  // toggleDarkMode() {
  //   this.isDarkMode = !this.isDarkMode;
  //   // Ovde možete primeniti logiku za promenu tema na osnovu this.isDarkMode
  //   // Na primer, dodavanje/uklanjanje odgovarajućih klasa na body element ili na roditeljski div.
  // }
}
