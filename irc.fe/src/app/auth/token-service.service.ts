import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenServiceService {
  // private tokenSubject = new BehaviorSubject<string>('');

  // setToken(token: string): void {
  //   this.tokenSubject.next(token);
  // }

  // getToken(): BehaviorSubject<string> {
  //   return this.tokenSubject;
  // }

  private tokenSubject = new BehaviorSubject<string>('');

  setToken(token: string) {
    this.tokenSubject.next(token);
    // console.log(token);
  }

  getToken() {
    return this.tokenSubject.asObservable();
  }
}
