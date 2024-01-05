import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from './order.model';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderCheckoutService {
  private apiUrl = 'http://localhost:3000/api/orders';
  // private apiUrl2 = 'http://localhost:3000/api/user/orders';
  private apiUrlShippingFee = 'http://localhost:3000/api/getshippingFee';

  constructor(private http: HttpClient) {}

  addOrder(newOrder: Order): Observable<Order> {
    const token = localStorage.getItem('token');

    if (!token) {
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Order>(this.apiUrl, newOrder, { headers });
  }

  // getOrders(): Observable<Order[]> {
  //   return this.http.get<Order[]>(this.apiUrl);
  // }

  getOrdersByCurrentUser(): Observable<Order[]> {
    const token = localStorage.getItem('token');

    if (!token) {
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Order[]>(this.apiUrl, {
      headers,
    });
  }

  // getShippingFee(): Observable<any> {
  //   return this.http.get<any>(this.apiUrlShippingFee);
  // }
}
