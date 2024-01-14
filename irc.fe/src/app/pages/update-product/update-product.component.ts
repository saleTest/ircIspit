import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsServiceService } from '../products-component/products-service.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BrendService } from '../add-products/brend.service';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [FormsModule, ProductsServiceService, BrendService],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css',
})
export class UpdateProductComponent implements OnInit {
  productId!: string;

  brands: any[] = [];
  category: any[] = [];
  subcategory: any[] = [];

  selectedBrand!: string;
  selectedCategoty!: string;
  selectedSubCategoty!: string;

  updateProductData: any = {};

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsServiceService,
    private brendService: BrendService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id !== null) {
        this.productId = id;
        console.log('ID proizvoda:', this.productId);
      } else {
        console.error('ID proizvoda nije pronađen u URL-u.');
      }
    });

    this.getBrendsData();
    this.getCategory();
    this.getSubCategory();
  }

  updateProduct(): void {
    this.productService
      .updateProduct(
        this.productId,
        (this.updateProductData = {
          ...this.updateProductData,
          category: this.selectedCategoty,
          brand: this.selectedBrand,
          subcategory: this.selectedSubCategoty,
        })
      )
      .subscribe(
        (response) => {
          console.log('Uspesno');
        },
        (error) => {
          console.log('Neuspesno');
        }
      );
  }

  getBrendsData() {
    this.brendService.getBrends().subscribe(
      (data) => {
        this.brands = data;
        // console.log('Podaci o brendovima:', data);
      },
      (error) => {
        console.error('Greška:', error);
      }
    );
  }

  getCategory() {
    this.brendService.getCategory().subscribe(
      (data) => {
        this.category = data;
        console.log('Podaci:', data);
      },
      (error) => {
        console.error('Greška:', error);
      }
    );
  }

  getSubCategory() {
    this.brendService.getSubCategory().subscribe(
      (data) => {
        this.subcategory = data;
        // console.log('Podaci:', data);
      },
      (error) => {
        console.error('Greška:', error);
      }
    );
  }
}
