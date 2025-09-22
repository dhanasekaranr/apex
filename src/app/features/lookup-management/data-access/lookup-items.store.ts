import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { LookupItemsApiService } from './api/lookup-items-api.service';
import { LookupItem } from './state/lookup-items.state';

// Define the state interface
interface LookupItemsState {
  lookupItems: LookupItem[];
  selectedItem: LookupItem | null;
  loading: boolean;
  error: string | null;
  filterByCategory: string | null;
}

// Initial state
const initialState: LookupItemsState = {
  lookupItems: [],
  selectedItem: null,
  loading: false,
  error: null,
  filterByCategory: null,
};

export const LookupItemsStore = signalStore(
  { providedIn: 'root' },

  // Define state
  withState(initialState),

  // Define computed signals
  withComputed(({ lookupItems, selectedItem, filterByCategory, error }) => ({
    // Filtered lookup items based on category
    filteredItems: computed(() => {
      const items = lookupItems();
      const filter = filterByCategory();
      return filter ? items.filter((item) => item.category === filter) : items;
    }),

    // Categories available
    availableCategories: computed(() => {
      const items = lookupItems();
      const categories = [...new Set(items.map((item) => item.category))];
      return categories.sort();
    }),

    // Items count
    itemsCount: computed(() => lookupItems().length),
    filteredItemsCount: computed(() => {
      const items = lookupItems();
      const filter = filterByCategory();
      return filter
        ? items.filter((item) => item.category === filter).length
        : items.length;
    }),

    // Active values in selected item
    activeValuesCount: computed(() => {
      const selected = selectedItem();
      return selected ? selected.values.filter((v) => v.isActive).length : 0;
    }),

    // Status computed signals
    hasItems: computed(() => lookupItems().length > 0),
    hasError: computed(() => !!error()),
    hasSelectedItem: computed(() => !!selectedItem()),

    // Search and filter helpers
    itemsByCategory: computed(() => {
      const items = lookupItems();
      return items.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      }, {} as Record<string, LookupItem[]>);
    }),
  })),

  // Define methods
  withMethods((store, lookupItemsApi = inject(LookupItemsApiService)) => ({
    // Load all lookup items
    loadLookupItems: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          lookupItemsApi.getLookupItems().pipe(
            tap((lookupItems: LookupItem[]) => {
              console.log(
                '✅ Lookup items loaded successfully:',
                lookupItems.length,
                'items'
              );
              patchState(store, {
                lookupItems,
                loading: false,
                error: null,
              });
            }),
            catchError((error: any) => {
              console.error('❌ Error loading lookup items:', error);
              patchState(store, {
                loading: false,
                error: error.message || 'Failed to load lookup items',
              });
              return of([]);
            })
          )
        )
      )
    ),

    // Load lookup items by category
    loadByCategory: rxMethod<string>(
      pipe(
        tap((category) => {
          patchState(store, {
            loading: true,
            error: null,
            filterByCategory: category,
          });
        }),
        switchMap((category) =>
          lookupItemsApi.getLookupItemsByCategory(category).pipe(
            tap((lookupItems: LookupItem[]) => {
              console.log(
                '✅ Lookup items loaded for category:',
                category,
                lookupItems.length,
                'items'
              );
              patchState(store, {
                lookupItems,
                loading: false,
                error: null,
              });
            }),
            catchError((error: any) => {
              console.error(
                '❌ Error loading lookup items by category:',
                error
              );
              patchState(store, {
                loading: false,
                error:
                  error.message || 'Failed to load lookup items by category',
              });
              return of([]);
            })
          )
        )
      )
    ),

    // Add a new lookup item
    addLookupItem: rxMethod<LookupItem>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((item) =>
          lookupItemsApi.addLookupItem(item).pipe(
            tap((newItem: LookupItem) => {
              console.log('✅ Lookup item added successfully:', newItem);
              patchState(store, {
                lookupItems: [...store.lookupItems(), newItem],
                loading: false,
                error: null,
              });
            }),
            catchError((error: any) => {
              console.error('❌ Error adding lookup item:', error);
              patchState(store, {
                loading: false,
                error: error.message || 'Failed to add lookup item',
              });
              return of();
            })
          )
        )
      )
    ),

    // Update an existing lookup item
    updateLookupItem: rxMethod<LookupItem>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((item) =>
          lookupItemsApi.updateLookupItem(item).pipe(
            tap((updatedItem: LookupItem) => {
              console.log('✅ Lookup item updated successfully:', updatedItem);
              const items = store
                .lookupItems()
                .map((i) => (i.id === updatedItem.id ? updatedItem : i));
              patchState(store, {
                lookupItems: items,
                selectedItem:
                  store.selectedItem()?.id === updatedItem.id
                    ? updatedItem
                    : store.selectedItem(),
                loading: false,
                error: null,
              });
            }),
            catchError((error: any) => {
              console.error('❌ Error updating lookup item:', error);
              patchState(store, {
                loading: false,
                error: error.message || 'Failed to update lookup item',
              });
              return of();
            })
          )
        )
      )
    ),

    // Delete a lookup item
    deleteLookupItem: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((id) =>
          lookupItemsApi.deleteLookupItem(id).pipe(
            tap(() => {
              console.log('✅ Lookup item deleted successfully:', id);
              const items = store.lookupItems().filter((i) => i.id !== id);
              const selectedItem =
                store.selectedItem()?.id === id ? null : store.selectedItem();
              patchState(store, {
                lookupItems: items,
                selectedItem,
                loading: false,
                error: null,
              });
            }),
            catchError((error: any) => {
              console.error('❌ Error deleting lookup item:', error);
              patchState(store, {
                loading: false,
                error: error.message || 'Failed to delete lookup item',
              });
              return of();
            })
          )
        )
      )
    ),

    // Search lookup items
    searchItems: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((query) =>
          lookupItemsApi.searchLookupItems(query).pipe(
            tap((lookupItems: LookupItem[]) => {
              console.log(
                '✅ Search completed:',
                lookupItems.length,
                'items found'
              );
              patchState(store, {
                lookupItems,
                loading: false,
                error: null,
              });
            }),
            catchError((error: any) => {
              console.error('❌ Error searching lookup items:', error);
              patchState(store, {
                loading: false,
                error: error.message || 'Search failed',
              });
              return of([]);
            })
          )
        )
      )
    ),

    // Select a lookup item (local state only)
    selectLookupItem(item: LookupItem | null): void {
      patchState(store, { selectedItem: item });
    },

    // Set category filter (local state only)
    setFilter(category: string | null): void {
      patchState(store, { filterByCategory: category });
    },

    // Clear category filter
    clearFilter(): void {
      patchState(store, { filterByCategory: null });
    },

    // Clear error state
    clearError(): void {
      patchState(store, { error: null });
    },

    // Reset state to initial values
    reset(): void {
      patchState(store, initialState);
    },
  }))
);
