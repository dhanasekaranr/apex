import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Store } from '@ngrx/store';
import {
  LookupItem,
  LookupItemsActions,
  LookupValue,
  selectLookupItems,
  selectLookupItemsError,
  selectLookupItemsLoading,
  selectSelectedLookupItem,
} from '../../store/lookup-items';

@Component({
  selector: 'app-lookup-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './lookup-management.html',
  styleUrl: './lookup-management.scss',
})
export class LookupManagement implements OnInit {
  filteredLookups: LookupItem[] = [];
  searchTerm: string = '';
  displayedColumns: string[] = [
    'key',
    'value',
    'description',
    'isActive',
    'actions',
  ];

  private store = inject(Store);

  // NgRx Store Selectors
  lookupItems$ = this.store.select(selectLookupItems);
  loading$ = this.store.select(selectLookupItemsLoading);
  error$ = this.store.select(selectLookupItemsError);
  selectedLookup$ = this.store.select(selectSelectedLookupItem);

  // Convert to signals for template use
  lookupItems = toSignal(this.lookupItems$, { initialValue: [] });
  loading = toSignal(this.loading$, { initialValue: false });
  error = toSignal(this.error$, { initialValue: null });
  selectedLookup = toSignal(this.selectedLookup$, { initialValue: null });

  ngOnInit() {
    console.log('🚀 Lookup management component initializing');

    // Subscribe to lookup items and update filtered list
    this.lookupItems$.subscribe((lookups) => {
      console.log('📊 Lookup items state updated:', lookups.length, 'items');
      this.filteredLookups = [...lookups];

      // Only load data if store is empty
      if (lookups.length === 0) {
        console.log('📥 Store is empty, dispatching loadLookupItems action');
        this.store.dispatch(LookupItemsActions.loadLookupItems());
      } else {
        console.log('✅ Using cached data from store');
      }
    });

    // Subscribe to loading and error states
    this.loading$.subscribe((loading) => {
      console.log('🔄 Lookup loading state changed:', loading);
    });

    this.error$.subscribe((error) => {
      if (error) {
        console.log('❌ Lookup error state updated:', error);
      }
    });
  }

  onSearchChange() {
    const allLookups = this.lookupItems();
    if (!this.searchTerm.trim()) {
      this.filteredLookups = [...allLookups];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredLookups = allLookups.filter(
        (lookup: LookupItem) =>
          lookup.name.toLowerCase().includes(term) ||
          lookup.description.toLowerCase().includes(term) ||
          lookup.category.toLowerCase().includes(term)
      );
    }
  }

  selectLookup(lookup: LookupItem) {
    this.store.dispatch(LookupItemsActions.selectLookupItem({ item: lookup }));
  }

  addNewValue() {
    const selectedItem = this.selectedLookup();
    if (selectedItem) {
      const newValue: LookupValue = {
        key: '',
        value: '',
        description: '',
        isActive: true,
      };
      const updatedItem = {
        ...selectedItem,
        values: [...selectedItem.values, newValue],
      };
      this.store.dispatch(
        LookupItemsActions.updateLookupItem({ item: updatedItem })
      );
    }
  }

  removeValue(index: number) {
    const selectedItem = this.selectedLookup();
    if (selectedItem && index >= 0 && index < selectedItem.values.length) {
      const updatedValues = [...selectedItem.values];
      updatedValues.splice(index, 1);
      const updatedItem = {
        ...selectedItem,
        values: updatedValues,
      };
      this.store.dispatch(
        LookupItemsActions.updateLookupItem({ item: updatedItem })
      );
    }
  }

  toggleValueStatus(value: LookupValue) {
    const selectedItem = this.selectedLookup();
    if (selectedItem) {
      const updatedValues = selectedItem.values.map((v) =>
        v === value ? { ...v, isActive: !v.isActive } : v
      );
      const updatedItem = {
        ...selectedItem,
        values: updatedValues,
      };
      this.store.dispatch(
        LookupItemsActions.updateLookupItem({ item: updatedItem })
      );
    }
  }

  saveLookup() {
    const selectedItem = this.selectedLookup();
    if (selectedItem) {
      this.store.dispatch(
        LookupItemsActions.updateLookupItem({ item: selectedItem })
      );
      console.log('Saving lookup:', selectedItem);
    }
  }

  clearError() {
    this.store.dispatch(LookupItemsActions.clearError());
  }
}
