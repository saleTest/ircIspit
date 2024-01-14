import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Product } from './product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsServiceService {
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  getSingleProduct(productId: string): Observable<Product> {
    // const url = `http://localhost:3000/api/product/${productId}`;
    return this.http.get<Product>(
      `http://localhost:3000/api/product/${productId}`
    );
  }

  getProducts(page: number, perPage: number): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.apiUrl}?page=${page}&perPage=${perPage}`
    );
  }

  searchProducts(keyword: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search?keyword=${keyword}`);
  }

  updateProduct(id: string, updateProductData: any): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(
      `http://localhost:3000/api/updateProduct/${id}`,
      updateProductData,
      { headers }
    );
  }

  getTop4Proizvoda(): Observable<any> {
    return this.http.get(`http://localhost:3000/api/topProduct/`);
  }
}
