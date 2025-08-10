import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedTabGroupComponent } from '../../shared/components/tab-group/shared-tab-group.component';
import { TabConfig } from '../../shared/components/tab-group/tab.interfaces';
import { BookingData, BookingService } from './booking.service';
import { AccountInformationTabComponent } from './tabs/account-information-tab.component';
import { BillingInformationTabComponent } from './tabs/billing-information-tab.component';
import { CollateralInformationTabComponent } from './tabs/collateral-information-tab.component';
import { SummaryTabComponent } from './tabs/summary-tab.component';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    SharedTabGroupComponent,
  ],
  template: `
    <div class="booking-container">
      <div class="booking-header">
        <h1>Vehicle Loan Booking</h1>
        <p>Complete all sections to finalize your booking</p>
      </div>

      <!-- Parent Save/Reset Actions -->
      <div class="booking-actions">
        <button
          mat-raised-button
          color="primary"
          [disabled]="isSaving || !canSaveBooking()"
          (click)="saveCompleteBooking()"
        >
          <mat-icon>save</mat-icon>
          <span *ngIf="!isSaving">Save Booking</span>
          <span *ngIf="isSaving">Saving...</span>
          <mat-spinner
            diameter="20"
            *ngIf="isSaving"
            style="margin-left: 8px;"
          ></mat-spinner>
        </button>

        <button
          mat-raised-button
          [disabled]="isSaving"
          (click)="resetAllTabs()"
        >
          <mat-icon>refresh</mat-icon>
          Reset All
        </button>
      </div>

      <!-- Shared Tab Group Component -->
      <app-shared-tab-group
        #tabGroup
        [tabConfigs]="tabConfigs"
        [globalLoadStrategy]="'lazy'"
        [showGlobalActions]="false"
        [validateOnTabSwitch]="true"
      >
      </app-shared-tab-group>
    </div>
  `,
  styles: [
    `
      .booking-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
        padding: 20px;
        background-color: #f5f5f5;
      }

      .booking-header {
        background: white;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
      }

      .booking-header h1 {
        margin: 0 0 8px 0;
        color: #333;
      }

      .booking-header p {
        margin: 0;
        color: #666;
      }

      .booking-actions {
        background: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }

      .booking-actions button {
        min-width: 120px;
      }

      app-shared-tab-group {
        flex: 1;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
    `,
  ],
})
export class BookingComponent implements OnInit {
  @ViewChild('tabGroup') tabGroup!: SharedTabGroupComponent;

  tabConfigs: TabConfig[] = [];
  isSaving = false;

  constructor(
    private bookingService: BookingService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initializeTabConfigs();
  }

  private initializeTabConfigs() {
    console.log('Initializing tab configs...');
    console.log(
      'AccountInformationTabComponent:',
      AccountInformationTabComponent
    );
    console.log(
      'BillingInformationTabComponent:',
      BillingInformationTabComponent
    );
    console.log(
      'CollateralInformationTabComponent:',
      CollateralInformationTabComponent
    );
    console.log('SummaryTabComponent:', SummaryTabComponent);

    this.tabConfigs = [
      {
        id: 'account',
        label: 'Account Information',
        icon: 'account_circle',
        iconTooltip: 'Manage customer account details and personal information - Required for booking',
        component: AccountInformationTabComponent,
        enabled: true,
        showPerTabActions: false,
      },
      {
        id: 'billing',
        label: 'Billing Information',
        icon: 'payment',
        iconTooltip: 'Configure payment methods and billing address - Loads when you click',
        component: BillingInformationTabComponent,
        enabled: true,
        showPerTabActions: false,
        mode: 'onClickOnly', // Only load when user clicks on this tab
      },
      {
        id: 'collateral',
        label: 'Collateral Information',
        icon: 'directions_car',
        iconTooltip: 'Vehicle details and collateral information for the loan - Required for booking',
        component: CollateralInformationTabComponent,
        enabled: true,
        showPerTabActions: false,
      },
      {
        id: 'summary',
        label: 'Summary',
        icon: 'summarize',
        iconTooltip: 'Review all entered information before finalizing - Requires valid data in other tabs',
        component: SummaryTabComponent,
        enabled: true,
        showPerTabActions: false,
        mode: 'onClickOnly', // Only load when user clicks on this tab
        requiresValidation: true, // Require other tabs to be valid before loading
      },
      {
        id: 'reports',
        label: 'Reports & Analytics',
        icon: 'analytics',
        iconTooltip: 'Advanced reporting and analytics dashboard - Coming soon in future release',
        component: null, // No component needed for disabled tab
        enabled: false,
        showPerTabActions: false,
        // disabledReason: 'Reports feature coming soon', // Remove this property
        disabledTooltip: 'This feature will be available in a future release',
      },
    ];

    console.log('Tab configs initialized:', this.tabConfigs);
  }

  canSaveBooking(): boolean {
    if (!this.tabGroup?.states) return false;

    return this.tabGroup
      .states()
      .every((state: any) => !state.loaded || (state.loaded && state.valid));
  }

  async saveCompleteBooking() {
    if (!this.canSaveBooking()) {
      this.snackBar.open(
        'Please fix validation errors before saving',
        'Close',
        {
          duration: 3000,
          panelClass: ['error-snackbar'],
        }
      );
      return;
    }

    this.isSaving = true;

    try {
      // Collect data from all loaded tabs
      const bookingData: BookingData = {
        accountInformation: null as any,
        billingInformation: null as any,
        collateralInformation: null as any,
        status: 'draft', // Add required status field
      };

      // Get data from each tab component
      this.tabGroup.states().forEach((state: any, index: number) => {
        if (state.loaded && state.component) {
          const tabId = this.tabConfigs[index].id;
          const data = (state.component as any).getData();

          switch (tabId) {
            case 'account':
              bookingData.accountInformation = data;
              break;
            case 'billing':
              bookingData.billingInformation = data;
              break;
            case 'collateral':
              bookingData.collateralInformation = data;
              break;
            case 'summary':
              // Summary tab is read-only, no need to collect data
              break;
            case 'reports':
              // Reports tab is disabled, no data to collect
              break;
          }
        }
      });

      // Validate that we have all required data
      if (
        !bookingData.accountInformation ||
        !bookingData.billingInformation ||
        !bookingData.collateralInformation
      ) {
        throw new Error('Missing required booking information');
      }

      // Save all data via service
      const result = await this.bookingService
        .saveCompleteBooking(bookingData)
        .toPromise();

      if (result) {
        this.snackBar.open(
          `Booking saved successfully! ID: ${result.bookingId}`,
          'Close',
          {
            duration: 5000,
            panelClass: ['success-snackbar'],
          }
        );
      } else {
        this.snackBar.open('Booking saved successfully!', 'Close', {
          duration: 5000,
          panelClass: ['success-snackbar'],
        });
      }

      // Mark all forms as pristine after successful save
      this.tabGroup.states().forEach((state: any) => {
        if (state.component && typeof state.component.save === 'function') {
          // Update the pristine state in each component
          state.dirty = false;
        }
      });
    } catch (error) {
      console.error('Error saving booking:', error);
      this.snackBar.open('Failed to save booking. Please try again.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    } finally {
      this.isSaving = false;
    }
  }

  resetAllTabs() {
    if (!this.tabGroup?.states) return;

    // Reset all loaded tab components
    this.tabGroup.states().forEach((state: any) => {
      if (state.loaded && state.component) {
        state.component.reset();
      }
    });

    this.snackBar.open('All tabs have been reset', 'Close', {
      duration: 2000,
    });
  }

  onTabSaved(event: { tabId: string; tabIndex: number }) {
    const tabLabel = this.tabConfigs[event.tabIndex].label;
    this.snackBar.open(`${tabLabel} saved successfully`, 'Close', {
      duration: 2000,
    });
  }

  onTabReset(event: { tabId: string; tabIndex: number }) {
    const tabLabel = this.tabConfigs[event.tabIndex].label;
    this.snackBar.open(`${tabLabel} has been reset`, 'Close', {
      duration: 2000,
    });
  }
}
