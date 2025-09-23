import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../../shared/services/base-api.service';
import { LookupItem } from '../state/lookup-items.state';

@Injectable({
  providedIn: 'root',
})
export class LookupItemsApiService extends BaseApiService {
  protected readonly endpoint = '/lookupItems';

  getLookupItems(): Observable<LookupItem[]> {
    return this.get<LookupItem[]>();
  }

  getLookupItemsByCategory(category: string): Observable<LookupItem[]> {
    return this.get<LookupItem[]>(`?category=${category}`);
  }

  getLookupItem(id: string): Observable<LookupItem> {
    return this.get<LookupItem>(`/${id}`);
  }

  addLookupItem(item: LookupItem): Observable<LookupItem> {
    return this.post<LookupItem>(item);
  }

  updateLookupItem(item: LookupItem): Observable<LookupItem> {
    return this.put<LookupItem>(item, `/${item.id}`);
  }

  deleteLookupItem(id: string): Observable<void> {
    return this.delete<void>(`/${id}`);
  }

  searchLookupItems(query: string): Observable<LookupItem[]> {
    return this.get<LookupItem[]>(`?q=${query}`);
  }
}
