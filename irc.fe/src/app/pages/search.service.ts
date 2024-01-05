import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchKeyword = new BehaviorSubject<string>('');
  currentSearchKeyword = this.searchKeyword.asObservable();

  constructor() {}

  changeSearchKeyword(keyword: string) {
    this.searchKeyword.next(keyword);
  }
}
