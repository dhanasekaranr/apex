import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { TabValidatable } from '../../../shared/components/tab-group/tab.interfaces';
import { BookingService } from '../booking.service';

export interface SummaryItem {
  category: string;
  field: string;
  value: string;
  status: string;
}

@Component({
  selector: 'app-summary-tab',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatIconModule],
  template: `
    <div class="summary-container">
      <mat-card class="summary-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>summarize</mat-icon>
            Booking Summary
          </mat-card-title>
          <mat-card-subtitle>
            Complete overview of all booking information
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <table mat-table [dataSource]="summaryData" class="summary-table">
            <!-- Category Column -->
            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Category</th>
              <td mat-cell *matCellDef="let item">
                <strong>{{ item.category }}</strong>
              </td>
            </ng-container>

            <!-- Field Column -->
            <ng-container matColumnDef="field">
              <th mat-header-cell *matHeaderCellDef>Field</th>
              <td mat-cell *matCellDef="let item">{{ item.field }}</td>
            </ng-container>

            <!-- Value Column -->
            <ng-container matColumnDef="value">
              <th mat-header-cell *matHeaderCellDef>Value</th>
              <td mat-cell *matCellDef="let item">
                {{ item.value || 'Not provided' }}
              </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let item">
                <span
                  class="status-badge"
                  [ngClass]="getStatusClass(item.status)"
                >
                  <mat-icon>{{ getStatusIcon(item.status) }}</mat-icon>
                  {{ item.status }}
                </span>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .summary-container {
        padding: 20px;
        height: 100%;
        overflow-y: auto;
      }

      .summary-card {
        width: 100%;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .summary-card mat-card-header {
        margin-bottom: 20px;
      }

      .summary-card mat-card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 24px;
      }

      .summary-table {
        width: 100%;
      }

      .summary-table th {
        background-color: #f5f5f5;
        font-weight: bold;
        color: #333;
      }

      .summary-table td {
        padding: 12px 8px;
        border-bottom: 1px solid #e0e0e0;
      }

      .summary-table tr:nth-child(even) {
        background-color: #fafafa;
      }

      .summary-table tr:hover {
        background-color: #f0f0f0;
      }

      .status-badge {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
      }

      .status-complete {
        background-color: #e8f5e8;
        color: #2e7d32;
      }

      .status-incomplete {
        background-color: #fff3e0;
        color: #ef6c00;
      }

      .status-missing {
        background-color: #ffebee;
        color: #c62828;
      }

      .status-badge mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    `,
  ],
})
export class SummaryTabComponent implements OnInit, TabValidatable {
  displayedColumns: string[] = ['category', 'field', 'value', 'status'];
  summaryData: SummaryItem[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.loadSummaryData();
  }

  private loadSummaryData() {
    // Get current booking data from service
    const bookingData = this.bookingService.getCurrentBooking();

    this.summaryData = [
      // Account Information Section
      {
        category: 'Account',
        field: 'First Name',
        value: bookingData?.accountInformation?.firstName || '',
        status: this.getFieldStatus(bookingData?.accountInformation?.firstName),
      },
      {
        category: 'Account',
        field: 'Last Name',
        value: bookingData?.accountInformation?.lastName || '',
        status: this.getFieldStatus(bookingData?.accountInformation?.lastName),
      },
      {
        category: 'Account',
        field: 'Email Address',
        value: bookingData?.accountInformation?.email || '',
        status: this.getFieldStatus(bookingData?.accountInformation?.email),
      },
      {
        category: 'Account',
        field: 'Phone Number',
        value: bookingData?.accountInformation?.phone || '',
        status: this.getFieldStatus(bookingData?.accountInformation?.phone),
      },

      // Billing Information Section
      {
        category: 'Billing',
        field: 'Payment Method',
        value: bookingData?.billingInformation?.paymentMethod || '',
        status: this.getFieldStatus(
          bookingData?.billingInformation?.paymentMethod
        ),
      },
      {
        category: 'Billing',
        field: 'Same as Account Address',
        value: bookingData?.billingInformation?.sameAsAccountAddress
          ? 'Yes'
          : 'No',
        status:
          bookingData?.billingInformation?.sameAsAccountAddress !== undefined
            ? 'complete'
            : 'missing',
      },
      {
        category: 'Billing',
        field: 'Billing Street',
        value: bookingData?.billingInformation?.billingAddress?.street || '',
        status: this.getFieldStatus(
          bookingData?.billingInformation?.billingAddress?.street
        ),
      },
      {
        category: 'Billing',
        field: 'Billing City',
        value: bookingData?.billingInformation?.billingAddress?.city || '',
        status: this.getFieldStatus(
          bookingData?.billingInformation?.billingAddress?.city
        ),
      },

      // Collateral Information Section
      {
        category: 'Collateral',
        field: 'Collateral Type',
        value: bookingData?.collateralInformation?.collateralType || '',
        status: this.getFieldStatus(
          bookingData?.collateralInformation?.collateralType
        ),
      },
      {
        category: 'Collateral',
        field: 'Estimated Value',
        value: bookingData?.collateralInformation?.estimatedValue
          ? `$${bookingData.collateralInformation.estimatedValue.toLocaleString()}`
          : '',
        status: this.getFieldStatus(
          bookingData?.collateralInformation?.estimatedValue
        ),
      },
      {
        category: 'Collateral',
        field: 'Description',
        value: bookingData?.collateralInformation?.description || '',
        status: this.getFieldStatus(
          bookingData?.collateralInformation?.description
        ),
      },
      {
        category: 'Collateral',
        field: 'Documents Count',
        value: bookingData?.collateralInformation?.documents
          ? `${bookingData.collateralInformation.documents.length} files`
          : '0 files',
        status:
          (bookingData?.collateralInformation?.documents?.length ?? 0) > 0
            ? 'complete'
            : 'missing',
      },
    ];
  }

  private getFieldStatus(value: any): string {
    if (value === null || value === undefined || value === '') {
      return 'missing';
    }
    if (typeof value === 'string' && value.trim().length === 0) {
      return 'missing';
    }
    return 'complete';
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'complete':
        return 'check_circle';
      case 'incomplete':
        return 'warning';
      case 'missing':
        return 'error';
      default:
        return 'help';
    }
  }

  // TabValidatable interface implementation
  isValid(): boolean {
    // Summary tab is always valid as it's read-only
    return true;
  }

  isDirty(): boolean {
    // Summary tab is never dirty as it's read-only
    return false;
  }

  async save(): Promise<void> {
    // Summary tab doesn't need saving
    return Promise.resolve();
  }

  reset(): void {
    // Reload the summary data
    this.loadSummaryData();
  }

  getData(): any {
    // Return the summary data for external use
    return {
      summaryItems: this.summaryData,
      completionStatus: this.getCompletionStatus(),
    };
  }

  private getCompletionStatus() {
    const total = this.summaryData.length;
    const completed = this.summaryData.filter(
      (item) => item.status === 'complete'
    ).length;
    return {
      total,
      completed,
      percentage: Math.round((completed / total) * 100),
    };
  }
}
