import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  getComments(productId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${productId}/comments`);
  }

  addComment(productId: string, text: string): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(
      `${this.apiUrl}/${productId}/comments`,
      {
        text,
      },
      { headers }
    );
  }

  deleteComment(productId: string, commentId: string): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/${productId}/comments/${commentId}`
    );
  }
}
