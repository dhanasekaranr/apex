import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { LookupItemsActions } from './state/lookup-items.actions';
import {
  selectLookupItems,
  selectLookupItemsError,
  selectLookupItemsLoading,
  selectSelectedLookupItem,
} from './state/lookup-items.selectors';
import { LookupItem } from './state/lookup-items.state';

@Injectable({
  providedIn: 'root',
})
export class LookupItemsFacade {
  private readonly store = inject(Store);

  // Selectors
  readonly lookupItems$ = this.store.select(selectLookupItems);
  readonly selectedLookupItem$ = this.store.select(selectSelectedLookupItem);
  readonly isLoading$ = this.store.select(selectLookupItemsLoading);
  readonly error$ = this.store.select(selectLookupItemsError);

  // Actions
  loadLookupItems(): void {
    this.store.dispatch(LookupItemsActions.loadLookupItems());
  }

  selectLookupItem(item: LookupItem | null): void {
    this.store.dispatch(LookupItemsActions.selectLookupItem({ item }));
  }

  addLookupItem(item: LookupItem): void {
    this.store.dispatch(LookupItemsActions.addLookupItem({ item }));
  }

  updateLookupItem(item: LookupItem): void {
    this.store.dispatch(LookupItemsActions.updateLookupItem({ item }));
  }

  deleteLookupItem(id: string): void {
    this.store.dispatch(LookupItemsActions.deleteLookupItem({ id }));
  }

  clearError(): void {
    this.store.dispatch(LookupItemsActions.clearError());
  }
}
