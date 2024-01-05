import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../products-component/product.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  items: Product[] = [];

  constructor(private http: HttpClient) {
    const storedItems = localStorage.getItem('cartItems');
    if (storedItems) {
      this.items = JSON.parse(storedItems);
    }
  }

  addToCart(product: Product): void {
    const existingProductIndex = this.items.findIndex(
      (item) => item._id === product._id
    );
    // console.log(product._id);
    if (existingProductIndex !== -1) {
      const confirmAdd = confirm(
        'This product is already in your cart. Do you want to add it again?'
      );
      if (confirmAdd) {
        this.items[existingProductIndex].quantity += 1;
      }
      // console.log(this.items[existingProductIndex].quantity);
      // console.log(existingProductIndex);
    } else {
      const newProduct = { ...product, quantity: 1 };
      // console.log(newProduct);
      window.alert('Product added to cart');

      this.items.push(newProduct);
    }

    console.log('Added to cart:', product);
    this.saveCartItems();
  }

  getItems(): Product[] {
    return this.items;
  }

  clearCart(): void {
    this.items = [];
    this.saveCartItems();
  }

  public saveCartItems(): void {
    localStorage.setItem('cartItems', JSON.stringify(this.items));
  }

  removeFromCart(productId: string): void {
    const index = this.items.findIndex((item) => item._id === productId);
    if (index !== -1) {
      const confirmRemove = confirm(
        'Are you sure you want to remove this item from your cart?'
      );
      if (confirmRemove) {
        this.items.splice(index, 1);
        this.saveCartItems();
      }
    }
  }

  changeQuantity(productId: string, quantity: number): void {
    const cartItem = this.items.find((item) => item._id === productId);
    if (!cartItem) return;

    const confirmChange = confirm(
      'Are you sure you want to change the quantity of this item?'
    );
    if (confirmChange) {
      cartItem.quantity = quantity;
      cartItem.price = quantity * cartItem.price;
      this.saveCartItems();
    }
  }
}
