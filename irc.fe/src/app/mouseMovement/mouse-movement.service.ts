import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MouseMovementService {
  private readonly serverUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getMouseMovements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverUrl}/api/get-mouse-movements`);
  }
}
