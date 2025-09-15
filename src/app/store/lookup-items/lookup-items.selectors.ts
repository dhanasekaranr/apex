import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LookupItemsState } from './lookup-items.state';

export const selectLookupItemsFeature =
  createFeatureSelector<LookupItemsState>('lookupItems');

export const selectLookupItems = createSelector(
  selectLookupItemsFeature,
  (state: LookupItemsState) => state.lookupItems
);

export const selectLookupItemsLoading = createSelector(
  selectLookupItemsFeature,
  (state: LookupItemsState) => state.loading
);

export const selectLookupItemsError = createSelector(
  selectLookupItemsFeature,
  (state: LookupItemsState) => state.error
);

export const selectSelectedLookupItem = createSelector(
  selectLookupItemsFeature,
  (state: LookupItemsState) => state.selectedItem
);

export const selectFilterByCategory = createSelector(
  selectLookupItemsFeature,
  (state: LookupItemsState) => state.filterByCategory
);

export const selectLookupItemById = (id: string) =>
  createSelector(selectLookupItems, (items) =>
    items.find((item) => item.id === id)
  );

export const selectLookupItemsByCategory = (category: string) =>
  createSelector(selectLookupItems, (items) =>
    items.filter((item) => item.category === category)
  );

export const selectActiveLookupItems = createSelector(
  selectLookupItems,
  (items) => items.filter((item) => item.values.some((v) => v.isActive))
);

export const selectLookupItemCategories = createSelector(
  selectLookupItems,
  (items) => {
    const categories = items.map((item) => item.category);
    return [...new Set(categories)].sort();
  }
);

export const selectFilteredLookupItems = createSelector(
  selectLookupItems,
  selectFilterByCategory,
  (items, categoryFilter) => {
    if (!categoryFilter) return items;
    return items.filter((item) => item.category === categoryFilter);
  }
);
