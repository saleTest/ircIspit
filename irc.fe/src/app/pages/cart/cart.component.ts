import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from './cart.service';
import { Product } from '../products-component/product.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [CartService],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  items: Product[] = [];
  // totalPrice = 0;

  constructor(private cartService: CartService) {
    this.items = this.cartService.getItems();
    console.log('Cart Component Items:', this.items);
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.items = [];
  }

  removeFromCart(cartItem: Product) {
    this.cartService.removeFromCart(cartItem._id);
  }

  changeQuantity(cartItem: Product, quantityInString: string) {
    const quantity = parseInt(quantityInString, 10);
    cartItem.quantity = quantity;

    this.cartService.saveCartItems();
    // console.log(cartItem, quantityInString);
  }

  calculateTotalCost(): number {
    // return (this.totalPrice = item.price * item.quantity);
    let totalCost = 0;

    for (const item of this.items) {
      totalCost += item.price * item.quantity;
    }

    return totalCost;
  }
  calculateTotalCount(): number {
    let totalCount = 0;
    for (const item of this.items) {
      totalCount += item.quantity;
    }
    // return (this.totalCount = item.quantity);/*
    return totalCount;
  }
}
