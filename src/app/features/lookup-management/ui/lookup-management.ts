import { CommonModule } from '@angular/common';
import { Component, OnInit, effect, inject } from '@angular/core';
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
import { PopoverTriggerDirective } from '../../../shared/ui/popover';
import { LookupItemsStore } from '../data-access/lookup-items.store';
import {
  LookupItem,
  LookupValue,
} from '../data-access/state/lookup-items.state';

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
    PopoverTriggerDirective,
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

  private lookupStore = inject(LookupItemsStore);

  // Direct signal access
  lookupItems = this.lookupStore.lookupItems;
  loading = this.lookupStore.loading;
  error = this.lookupStore.error;
  selectedLookup = this.lookupStore.selectedItem;

  constructor() {
    // React to lookup items changes
    effect(() => {
      const lookups = this.lookupItems();
      this.filteredLookups = [...lookups];
    });

    // React to loading state changes
    effect(() => {
      const loading = this.loading();
      // Loading state handled by template binding
    });

    // React to error state changes
    effect(() => {
      const error = this.error();
      // Error state handled by template binding
    });
  }

  ngOnInit() {
    // Load data if store is empty
    if (this.lookupItems().length === 0) {
      this.lookupStore.loadLookupItems();
    }
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
    this.lookupStore.selectLookupItem(lookup);
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
      this.lookupStore.updateLookupItem(updatedItem);
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
      this.lookupStore.updateLookupItem(updatedItem);
    }
  }

  toggleValueStatus(value: LookupValue) {
    const selectedItem = this.selectedLookup();
    if (selectedItem) {
      const updatedValues = selectedItem.values.map((v: LookupValue) =>
        v === value ? { ...v, isActive: !v.isActive } : v
      );
      const updatedItem = {
        ...selectedItem,
        values: updatedValues,
      };
      this.lookupStore.updateLookupItem(updatedItem);
    }
  }

  saveLookup() {
    const selectedItem = this.selectedLookup();
    if (selectedItem) {
      this.lookupStore.updateLookupItem(selectedItem);
      // Save lookup through store
    }
  }

  clearError() {
    this.lookupStore.clearError();
  }
}
