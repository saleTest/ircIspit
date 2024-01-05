import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Product } from './product.interface';
import { ProductsServiceService } from './products-service.service';
import { RouterModule } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-products-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [ProductsServiceService, CartService],
  templateUrl: './products-component.component.html',
  styleUrl: './products-component.component.css',
})
export class ProductsComponentComponent implements OnInit {
  products: Product[] = [];
  animate: boolean = false;

  constructor(
    private productService: ProductsServiceService,
    private cartService: CartService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.searchService.currentSearchKeyword.subscribe((keyword) => {
      if (keyword.trim() !== '') {
        this.searchProducts(keyword);
      } else {
        this.getProducts();
      }
    });
    setTimeout(() => {
      this.animate = true;
    }, 100);
  }

  getProducts(): void {
    this.productService
      .getProducts()
      .subscribe((products) => (this.products = products));
  }

  // products: Product[] = [];/* *//* */

  // addToCart(product: Product): void {
  //   this.cartService.addToCart(product);
  // }

  searchProducts(keyword: string): void {
    this.productService
      .searchProducts(keyword)
      .subscribe((products) => (this.products = products));
  }
}
