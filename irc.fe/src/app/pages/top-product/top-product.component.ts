import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsServiceService } from '../products-component/products-service.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-top-product',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [ProductsServiceService],
  templateUrl: './top-product.component.html',
  styleUrl: './top-product.component.css',
})
export class TopProductComponent implements OnInit {
  topProducts: any[] = [];
  animate: boolean = false;

  constructor(private productService: ProductsServiceService) {}

  ngOnInit(): void {
    this.productService.getTop4Proizvoda().subscribe((data) => {
      this.topProducts = data;
    });
    setTimeout(() => {
      this.animate = true;
    }, 100);
  }
}
