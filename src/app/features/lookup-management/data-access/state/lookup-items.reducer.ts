import { createReducer, on } from '@ngrx/store';
import { LookupItemsActions } from './lookup-items.actions';
import { LookupItemsState } from './lookup-items.state';

export const initialLookupItemsState: LookupItemsState = {
  lookupItems: [],
  loading: false,
  error: null,
  selectedItem: null,
  filterByCategory: null,
};

export const lookupItemsReducer = createReducer(
  initialLookupItemsState,

  // Load lookup items
  on(LookupItemsActions.loadLookupItems, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(LookupItemsActions.loadLookupItemsSuccess, (state, { lookupItems }) => ({
    ...state,
    lookupItems,
    loading: false,
    error: null,
  })),

  on(LookupItemsActions.loadLookupItemsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load by category
  on(LookupItemsActions.loadByCategory, (state, { category }) => ({
    ...state,
    loading: true,
    error: null,
    filterByCategory: category,
  })),

  on(LookupItemsActions.loadByCategorySuccess, (state, { lookupItems }) => ({
    ...state,
    lookupItems,
    loading: false,
    error: null,
  })),

  on(LookupItemsActions.loadByCategoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add lookup item
  on(LookupItemsActions.addLookupItem, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(LookupItemsActions.addLookupItemSuccess, (state, { item }) => ({
    ...state,
    lookupItems: [...state.lookupItems, item],
    loading: false,
    error: null,
  })),

  on(LookupItemsActions.addLookupItemFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update lookup item
  on(LookupItemsActions.updateLookupItem, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(LookupItemsActions.updateLookupItemSuccess, (state, { item }) => ({
    ...state,
    lookupItems: state.lookupItems.map((i) => (i.id === item.id ? item : i)),
    loading: false,
    error: null,
    selectedItem:
      state.selectedItem?.id === item.id ? item : state.selectedItem,
  })),

  on(LookupItemsActions.updateLookupItemFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete lookup item
  on(LookupItemsActions.deleteLookupItem, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(LookupItemsActions.deleteLookupItemSuccess, (state, { id }) => ({
    ...state,
    lookupItems: state.lookupItems.filter((item) => item.id !== id),
    loading: false,
    error: null,
    selectedItem: state.selectedItem?.id === id ? null : state.selectedItem,
  })),

  on(LookupItemsActions.deleteLookupItemFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Select lookup item
  on(LookupItemsActions.selectLookupItem, (state, { item }) => ({
    ...state,
    selectedItem: item,
  })),

  // Filter by category
  on(LookupItemsActions.filterByCategory, (state, { category }) => ({
    ...state,
    filterByCategory: category,
  })),

  // Clear error
  on(LookupItemsActions.clearError, (state) => ({
    ...state,
    error: null,
  }))
);
