import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LookupItem } from '../state/lookup-items.state';

@Injectable({
  providedIn: 'root',
})
export class LookupItemsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3001';

  getLookupItems(): Observable<LookupItem[]> {
    return this.http.get<LookupItem[]>(`${this.baseUrl}/lookupItems`);
  }

  getLookupItemsByCategory(category: string): Observable<LookupItem[]> {
    return this.http.get<LookupItem[]>(
      `${this.baseUrl}/lookupItems?category=${category}`
    );
  }

  getLookupItem(id: string): Observable<LookupItem> {
    return this.http.get<LookupItem>(`${this.baseUrl}/lookupItems/${id}`);
  }

  addLookupItem(item: LookupItem): Observable<LookupItem> {
    return this.http.post<LookupItem>(`${this.baseUrl}/lookupItems`, item);
  }

  updateLookupItem(item: LookupItem): Observable<LookupItem> {
    return this.http.put<LookupItem>(
      `${this.baseUrl}/lookupItems/${item.id}`,
      item
    );
  }

  deleteLookupItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/lookupItems/${id}`);
  }

  searchLookupItems(query: string): Observable<LookupItem[]> {
    return this.http.get<LookupItem[]>(
      `${this.baseUrl}/lookupItems?q=${query}`
    );
  }
}
