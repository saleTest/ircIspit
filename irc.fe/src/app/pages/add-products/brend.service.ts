import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BrendService {
  private apiUrlBrends = 'http://localhost:3000/api/getBrends';
  private apiUrlCategory = 'http://localhost:3000/api/getCategory';
  private apiUrlSubCategory = 'http://localhost:3000/api/getSubCategory';

  constructor(private http: HttpClient) {}

  getBrends(): Observable<any[]> {
    const token = localStorage.getItem('token');

    if (!token) {
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(this.apiUrlBrends, { headers }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  getCategory(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlCategory).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  getSubCategory(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlSubCategory).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
}
