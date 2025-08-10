import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

export interface LookupItem {
  id: string;
  name: string;
  description: string;
  category: string;
  values: LookupValue[];
}

export interface LookupValue {
  key: string;
  value: string;
  description?: string;
  isActive: boolean;
}

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
  styleUrls: ['./lookup-management.scss'],
})
export class LookupManagement implements OnInit {
  lookups: LookupItem[] = [];
  filteredLookups: LookupItem[] = [];
  selectedLookup: LookupItem | null = null;
  searchTerm: string = '';
  displayedColumns: string[] = [
    'key',
    'value',
    'description',
    'isActive',
    'actions',
  ];

  ngOnInit() {
    this.initializeLookups();
    this.filteredLookups = [...this.lookups];
  }

  private initializeLookups() {
    this.lookups = [
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
    ];
  }

  onSearchChange() {
    if (!this.searchTerm.trim()) {
      this.filteredLookups = [...this.lookups];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredLookups = this.lookups.filter(
        (lookup) =>
          lookup.name.toLowerCase().includes(term) ||
          lookup.description.toLowerCase().includes(term) ||
          lookup.category.toLowerCase().includes(term)
      );
    }
  }

  selectLookup(lookup: LookupItem) {
    this.selectedLookup = lookup;
  }

  addNewValue() {
    if (this.selectedLookup) {
      const newValue: LookupValue = {
        key: '',
        value: '',
        description: '',
        isActive: true,
      };
      this.selectedLookup.values.push(newValue);
    }
  }

  removeValue(index: number) {
    if (
      this.selectedLookup &&
      index >= 0 &&
      index < this.selectedLookup.values.length
    ) {
      this.selectedLookup.values.splice(index, 1);
    }
  }

  toggleValueStatus(value: LookupValue) {
    value.isActive = !value.isActive;
  }

  saveLookup() {
    // In a real application, this would save to a backend service
    console.log('Saving lookup:', this.selectedLookup);
    // Show success message or handle errors
  }
}
