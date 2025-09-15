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

  private initializeLookups() {
    // This method is no longer needed - data comes from NgRx store
    // Remove this entire method
    /*this.lookups = [
      {
        id: 'loan-status',
        name: 'Loan Status',
        description: 'Status values for loan applications',
        category: 'Loans',
        values: [
          {
            key: 'PENDING',
            value: 'Pending Review',
            description: 'Application submitted, awaiting review',
            isActive: true,
          },
          {
            key: 'APPROVED',
            value: 'Approved',
            description: 'Loan approved for processing',
            isActive: true,
          },
          {
            key: 'REJECTED',
            value: 'Rejected',
            description: 'Application rejected',
            isActive: true,
          },
          {
            key: 'CANCELLED',
            value: 'Cancelled',
            description: 'Application cancelled by applicant',
            isActive: true,
          },
          {
            key: 'DISBURSED',
            value: 'Disbursed',
            description: 'Loan amount disbursed',
            isActive: true,
          },
        ],
      },
      {
        id: 'loan-substatus',
        name: 'Loan Sub-Status',
        description: 'Detailed status values for loan processing',
        category: 'Loans',
        values: [
          {
            key: 'DOC_PENDING',
            value: 'Documents Pending',
            description: 'Waiting for required documents',
            isActive: true,
          },
          {
            key: 'VERIFICATION',
            value: 'Under Verification',
            description: 'Documents under verification',
            isActive: true,
          },
          {
            key: 'CREDIT_CHECK',
            value: 'Credit Check',
            description: 'Credit score verification in progress',
            isActive: true,
          },
          {
            key: 'FINAL_APPROVAL',
            value: 'Final Approval',
            description: 'Pending final approval',
            isActive: true,
          },
        ],
      },
      {
        id: 'product-type',
        name: 'Product Type',
        description: 'Types of loan products available',
        category: 'Products',
        values: [
          {
            key: 'HOME_LOAN',
            value: 'Home Loan',
            description: 'Residential property loans',
            isActive: true,
          },
          {
            key: 'PERSONAL_LOAN',
            value: 'Personal Loan',
            description: 'Personal finance loans',
            isActive: true,
          },
          {
            key: 'AUTO_LOAN',
            value: 'Auto Loan',
            description: 'Vehicle financing loans',
            isActive: true,
          },
          {
            key: 'BUSINESS_LOAN',
            value: 'Business Loan',
            description: 'Commercial lending products',
            isActive: true,
          },
          {
            key: 'EDUCATION_LOAN',
            value: 'Education Loan',
            description: 'Educational financing',
            isActive: true,
          },
        ],
      },
      {
        id: 'modules',
        name: 'System Modules',
        description: 'Available system modules and features',
        category: 'System',
        values: [
          {
            key: 'USER_MGMT',
            value: 'User Management',
            description: 'User administration module',
            isActive: true,
          },
          {
            key: 'LOAN_PROC',
            value: 'Loan Processing',
            description: 'Core loan processing functionality',
            isActive: true,
          },
          {
            key: 'REPORTING',
            value: 'Reports & Analytics',
            description: 'Business intelligence and reporting',
            isActive: true,
          },
          {
            key: 'SETTINGS',
            value: 'System Settings',
            description: 'Configuration and system settings',
            isActive: true,
          },
          {
            key: 'AUDIT',
            value: 'Audit Trail',
            description: 'System audit and logging',
            isActive: true,
          },
        ],
      },
      {
        id: 'document-types',
        name: 'Document Types',
        description: 'Required document types for loan processing',
        category: 'Documents',
        values: [
          {
            key: 'IDENTITY',
            value: 'Identity Proof',
            description: 'Government issued ID documents',
            isActive: true,
          },
          {
            key: 'ADDRESS',
            value: 'Address Proof',
            description: 'Residential address verification',
            isActive: true,
          },
          {
            key: 'INCOME',
            value: 'Income Proof',
            description: 'Salary slips, ITR, bank statements',
            isActive: true,
          },
          {
            key: 'PROPERTY',
            value: 'Property Documents',
            description: 'Property related documents',
            isActive: true,
          },
          {
            key: 'BANK_STMT',
            value: 'Bank Statement',
            description: 'Banking transaction history',
            isActive: true,
          },
        ],
      },
      {
        id: 'risk-categories',
        name: 'Risk Categories',
        description: 'Risk assessment categories for loan evaluation',
        category: 'Risk Management',
        values: [
          {
            key: 'LOW',
            value: 'Low Risk',
            description: 'Minimal risk profile',
            isActive: true,
          },
          {
            key: 'MEDIUM',
            value: 'Medium Risk',
            description: 'Moderate risk profile',
            isActive: true,
          },
          {
            key: 'HIGH',
            value: 'High Risk',
            description: 'Elevated risk profile',
            isActive: true,
          },
          {
            key: 'CRITICAL',
            value: 'Critical Risk',
            description: 'High-risk requiring special approval',
            isActive: true,
          },
        ],
      },
    ];*/
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
