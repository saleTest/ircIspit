import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppModule } from '../../app.module';
import { BrendService } from './brend.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, AppModule],
  providers: [AppModule, ToastrService, BrendService],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent implements OnInit {
  name: string = '';
  description: string = '';
  price: number = 0;
  color: string = '';
  // sizes!: [];
  img: string | undefined;
  quantity: number = 0;
  sizes: string[] = [''];

  brands: any[] = [];
  category: any[] = [];
  subcategory: any[] = [];

  selectedBrand!: string;
  selectedCategoty!: string;
  selectedSubCategoty!: string;

  addSizeField() {
    this.sizes.push('');
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastrService: ToastrService,
    private brendService: BrendService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) this.router.navigate(['/']);
    this.getBrendsData();
    this.getCategory();
    this.getSubCategory();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.img = file ? file.name : undefined;
  }

  addProduct() {
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    if (
      !this.name ||
      !this.description ||
      this.price <= 0 ||
      !this.selectedCategoty ||
      !this.img ||
      !this.sizes ||
      this.sizes.length === 0 ||
      !this.color ||
      this.quantity <= 0
    ) {
      this.toastrService.warning('Please fill all inputs!');
      return;
    }
    const filteredSizes = this.sizes.filter((size) => size.trim() !== '');

    this.http
      .post<any>(
        'http://localhost:3000/api/add-product',
        {
          name: this.name,
          description: this.description,
          price: this.price,
          category: this.selectedCategoty,
          img: this.img,
          size: filteredSizes,
          color: this.color,
          quantity: this.quantity,
        },
        { headers }
      )
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          // console.log(this.size);
          console.log(error.message);
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
