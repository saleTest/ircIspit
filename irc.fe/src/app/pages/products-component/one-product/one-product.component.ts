import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Product } from '../product.interface';
import { ProductsServiceService } from '../products-service.service';
import { CommentComponent } from '../comment/comment.component';
import { CartService } from '../../cart/cart.service';

@Component({
  selector: 'app-one-product',
  standalone: true,
  imports: [CommonModule, RouterModule, CommentComponent],
  providers: [ProductsServiceService, CartService],
  templateUrl: './one-product.component.html',
  styleUrl: './one-product.component.css',
})
export class OneProductComponent implements OnInit {
  product: Product | undefined;
  tokenBool = false;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductsServiceService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.getProductDetail();
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    } else {
      this.tokenBool = true;
    }
  }

  getProductRatingStars(rating: number): string {
    const starFullPNG = '../../../assets/images/star/star.svg';
    const starHalfPNG = '../../../assets/images/star/star-half.svg';
    const starEmptyPNG = '../../../assets/images/star/star-regular.svg';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let starsHTML = '';

    for (let i = 0; i < fullStars; i++) {
      starsHTML += `<img src="${starFullPNG}" alt="Full Star" width="20">`;
    }

    if (hasHalfStar) {
      starsHTML += `<img src="${starHalfPNG}" alt="Half Star" width="20">`;
    }

    for (let i = 0; i < emptyStars; i++) {
      starsHTML += `<img src="${starEmptyPNG}" alt="Empty Star" width="20">`;
    }

    return starsHTML;
  }

  getProductDetail(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    // console.log(productId);
    if (productId) {
      this.productService.getSingleProduct(productId).subscribe(
        (product: Product) => (this.product = product),
        (error: any) => {
          console.error('Greška prilikom dohvatanja proizvoda:', error);
        }
      );
    }
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
