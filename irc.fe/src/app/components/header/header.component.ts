import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { DarkModeService } from '../../dark-mode.service';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../pages/cart/cart.service';
import { Product } from '../../pages/products-component/product.interface';
import { SearchService } from '../../pages/search.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenServiceService } from '../../auth/token-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  providers: [CartService],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  cartQuantity: number = 0;
  message: string = '';
  token!: string | null;
  isAdmin!: boolean;

  constructor(
    private darkModeService: DarkModeService,
    private router: Router,
    private cartService: CartService,
    private searchService: SearchService,
    private http: HttpClient,
    private tokenService: TokenServiceService
  ) {}

  useRole() {
    if (this.token) {
      const headers = new HttpHeaders().set(
        'Authorization',
        `Bearer ${this.token}`
      );

      this.http
        .get<any>('http://localhost:3000/api/protected', { headers })
        .subscribe(
          (response) => {
            // this.message = response.message;
            // console.log(this.message);
            // console.log(response.role === 'admin');
            if (response.role === 'admin') {
              this.isAdmin = true;
            } else {
              this.isAdmin = false;
            }
          },
          (error) => {
            console.error('Greška prilikom pristupa zaštićenom dijelu:', error);
          }
        );
    } else {
      this.router.navigate(['/auth']);
    }
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const keyword = target.value;
      this.searchService.changeSearchKeyword(keyword);
      // console.log(keyword);
    }
  }
  ngOnInit(): void {
    const cartItems: Product[] = this.cartService.getItems();
    this.cartQuantity = cartItems.length;

    this.tokenService.getToken().subscribe((token) => {
      if (token) {
        this.token = token;
        // console.log(token);
      } else {
        if (localStorage.getItem('token')) {
          this.token = localStorage.getItem('token');
        }
      }
    });
    if (this.token) {
      this.useRole();
    }
  }
  // token: string | null = localStorage.getItem('token');

  get isDarkMode(): boolean {
    return this.darkModeService.isDarkMode;
  }

  onToggleDarkMode() {
    this.darkModeService.toggleDarkMode();
    // console.log(this.token);
  }

  logout() {
    this.token = null;
    this.router.navigate(['/welcome']);
    localStorage.removeItem('token');
  }
}
