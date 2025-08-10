/**
 * @fileoverview Main booking component using the new tab system
 * @version 1.0.0
 * @author Twenty Development Team
 */

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AccountInformationComponent } from '../../shared/components/account-information/account-information.component';
import { SharedTabGroupComponent } from '../../shared/components/tab-group/shared-tab-group.component';
import {
  SaveAllProgressEvent,
  TabConfig,
  TabGroupOptions,
} from '../../shared/components/tab-group/tab.interfaces';
import {
  BookingData,
  BookingService,
} from '../../shared/services/booking.service';

// Mock components for demo - in real app, these would be separate files
@Component({
  selector: 'app-billing-information',
  standalone: true,
  template: `
    <div style="padding: 2rem; text-align: center;">
      <h3>Billing Information Component</h3>
      <p>This would contain credit card and billing address forms.</p>
      <p>Form valid: {{ isValid() }}</p>
      <p>Form dirty: {{ isDirty() }}</p>
    </div>
  `,
})
class BillingInformationComponent {
  isValid = () => true;
  isDirty = () => false;
  save = async () => {
    await new Promise((r) => setTimeout(r, 500));
  };
  reset = () => {};
  getData = () => ({ cardNumber: '**** **** **** 1234' });
  setReadOnly = (ro: boolean) => console.log('Read-only:', ro);
}

@Component({
  selector: 'app-collateral-information',
  standalone: true,
  template: `
    <div style="padding: 2rem; text-align: center;">
      <h3>Collateral Information Component (Read-Only)</h3>
      <p>This would contain vehicle details and valuation.</p>
      <p>Read-only mode active</p>
    </div>
  `,
})
class CollateralInformationComponent {
  isValid = () => true;
  isDirty = () => false;
  save = async () => {};
  reset = () => {};
  getData = () => ({ vehicleType: 'car', make: 'Toyota' });
  setReadOnly = (ro: boolean) => console.log('Read-only:', ro);
}

@Component({
  selector: 'app-documents',
  standalone: true,
  template: `
    <div style="padding: 2rem; text-align: center;">
      <h3>Documents Component</h3>
      <p>This would contain document upload and verification.</p>
    </div>
  `,
})
class DocumentsComponent {
  isValid = () => false; // Has validation errors
  isDirty = () => true; // Has unsaved changes
  save = async () => {
    await new Promise((r) => setTimeout(r, 800));
  };
  reset = () => {};
  getData = () => ({ documents: [] });
}

@Component({
  selector: 'app-review-submit',
  standalone: true,
  template: `
    <div style="padding: 2rem; text-align: center;">
      <h3>Review & Submit Component (Disabled)</h3>
      <p>This tab is disabled until other sections are complete.</p>
    </div>
  `,
})
class ReviewSubmitComponent {
  isValid = () => true;
  isDirty = () => false;
  save = async () => {};
  reset = () => {};
  getData = () => ({ reviewed: false });
}

/**
 * Main booking component demonstrating the advanced tab system
 *
 * Features demonstrated:
 * - Mixed loading strategies (eager, lazy, onClickOnly)
 * - Read-only tabs
 * - Disabled tabs with tooltips
 * - Per-tab actions
 * - Global save with progress tracking
 * - Error handling and recovery
 * - Keyboard navigation
 * - Accessibility features
 */
@Component({
  selector: 'app-booking-new',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatCardModule,
    SharedTabGroupComponent,
  ],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background: var(--mat-sys-surface);
      }

      .app-toolbar {
        background: var(--mat-sys-primary);
        color: var(--mat-sys-on-primary);
        box-shadow: var(--mat-sys-elevation-2);
      }

      .toolbar-content {
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
      }

      .app-title {
        flex: 1;
        font-size: 1.25rem;
        font-weight: 500;
      }

      .status-indicator {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.1);
        padding: 0.5rem 1rem;
        border-radius: 16px;
        font-size: 0.875rem;
      }

      .progress-section {
        background: var(--mat-sys-surface-container-low);
        border-bottom: 1px solid var(--mat-sys-outline-variant);
        min-height: 4px;
      }

      .progress-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0.5rem 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        font-size: 0.875rem;
        color: var(--mat-sys-on-surface-variant);
      }

      .main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
        min-height: 0;
      }

      .content-header {
        padding: 1.5rem 1rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .content-title {
        margin: 0;
        color: var(--mat-sys-on-surface);
        font-size: 1.5rem;
        font-weight: 400;
      }

      .header-actions {
        display: flex;
        gap: 0.75rem;
        align-items: center;
      }

      .tab-container {
        flex: 1;
        min-height: 0;
        padding: 1rem;
      }

      .demo-info {
        background: var(--mat-sys-tertiary-container);
        color: var(--mat-sys-on-tertiary-container);
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        border-left: 4px solid var(--mat-sys-tertiary);
      }

      .demo-info h4 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
      }

      .demo-info ul {
        margin: 0;
        padding-left: 1.5rem;
      }

      .keyboard-shortcuts {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        background: var(--mat-sys-surface-container-high);
        color: var(--mat-sys-on-surface);
        padding: 0.75rem;
        border-radius: 8px;
        font-size: 0.75rem;
        box-shadow: var(--mat-sys-elevation-3);
        max-width: 200px;
      }

      .keyboard-shortcuts h5 {
        margin: 0 0 0.5rem 0;
        font-size: 0.875rem;
        font-weight: 500;
      }

      .keyboard-shortcuts div {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.25rem;
      }

      .keyboard-shortcuts kbd {
        background: var(--mat-sys-outline-variant);
        padding: 0.125rem 0.25rem;
        border-radius: 3px;
        font-size: 0.65rem;
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .content-header {
          padding: 1rem;
        }

        .header-actions {
          width: 100%;
          justify-content: stretch;
        }

        .header-actions button {
          flex: 1;
        }

        .tab-container {
          padding: 0.5rem;
        }

        .keyboard-shortcuts {
          display: none;
        }
      }

      /* Loading states */
      .saving-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(var(--mat-sys-surface), 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      /* Animation for smooth transitions */
      .progress-content {
        transition: all 0.3s ease;
      }

      .status-indicator {
        transition: all 0.2s ease;
      }
    `,
  ],
  template: `
    <!-- App Toolbar -->
    <mat-toolbar class="app-toolbar">
      <div class="toolbar-content">
        <mat-icon>account_balance</mat-icon>
        <span class="app-title">Twenty Lending - Vehicle Loan Application</span>

        <div class="status-indicator" [style.background]="getStatusColor()">
          <mat-icon>{{ getStatusIcon() }}</mat-icon>
          <span>{{ getStatusText() }}</span>
        </div>
      </div>
    </mat-toolbar>

    <!-- Progress Section -->
    <div class="progress-section" *ngIf="showProgress()">
      <div class="progress-content">
        <mat-progress-bar
          mode="determinate"
          [value]="progressValue()"
          style="flex: 1; height: 4px;"
        >
        </mat-progress-bar>
        <span>{{ progressMessage() }}</span>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Content Header -->
      <div class="content-header">
        <h2 class="content-title">Loan Application</h2>

        <div class="header-actions">
          <button
            mat-button
            color="accent"
            (click)="clearDemoData()"
            [disabled]="isOperationRunning()"
          >
            <mat-icon>refresh</mat-icon>
            Reset Demo
          </button>

          <button
            mat-raised-button
            color="primary"
            (click)="quickSave()"
            [disabled]="!canQuickSave() || isOperationRunning()"
          >
            <mat-icon>{{
              isOperationRunning() ? 'hourglass_empty' : 'save'
            }}</mat-icon>
            {{ getSaveButtonText() }}
          </button>
        </div>
      </div>

      <!-- Demo Information -->
      <div class="demo-info">
        <h4><mat-icon>info</mat-icon> Angular 20 Tab System Demo</h4>
        <ul>
          <li>
            <strong>Account Info</strong> - Eager loading with real form
            validation
          </li>
          <li>
            <strong>Billing Info</strong> - Lazy loading with mock component
          </li>
          <li>
            <strong>Vehicle Details</strong> - Click-only loading, read-only
            mode
          </li>
          <li>
            <strong>Documents</strong> - Has validation errors and unsaved
            changes
          </li>
          <li><strong>Review & Submit</strong> - Disabled tab with tooltip</li>
        </ul>
      </div>

      <!-- Tab Container -->
      <div class="tab-container">
        <app-shared-tab-group
          #tabGroup
          [tabConfigs]="tabConfigs"
          [globalLoadStrategy]="'lazy'"
          [saveMode]="'parent'"
          (saveAllProgress)="onSaveProgress($event)"
          (globalSave)="onGlobalSave($event)"
        >
        </app-shared-tab-group>
      </div>
    </div>

    <!-- Keyboard Shortcuts Helper -->
    <div class="keyboard-shortcuts">
      <h5>Keyboard Shortcuts</h5>
      <div><span>Save All</span> <kbd>Ctrl+S</kbd></div>
      <div><span>Reset All</span> <kbd>Ctrl+R</kbd></div>
      <div><span>Next Tab</span> <kbd>Ctrl+→</kbd></div>
      <div><span>Prev Tab</span> <kbd>Ctrl+←</kbd></div>
    </div>

    <!-- Global Loading Overlay -->
    <div *ngIf="isGlobalSaving()" class="saving-overlay">
      <mat-card style="padding: 2rem; text-align: center;">
        <mat-spinner diameter="40"></mat-spinner>
        <h3 style="margin-top: 1rem;">Saving Booking...</h3>
        <p>Please wait while we process your application</p>
      </mat-card>
    </div>
  `,
})
export class BookingNewComponent {
  @ViewChild('tabGroup') tabGroup!: SharedTabGroupComponent;

  // Dependencies
  private readonly snackBar = inject(MatSnackBar);
  private readonly bookingService = inject(BookingService);

  // Component state
  private readonly _progressValue = signal(0);
  private readonly _progressMessage = signal('');
  private readonly _showProgress = signal(false);
  private readonly _isGlobalSaving = signal(false);
  private readonly _currentTabIndex = signal(0);
  private readonly _tabValidationStates = signal<Record<string, boolean>>({});

  // Computed state
  readonly progressValue = computed(() => this._progressValue());
  readonly progressMessage = computed(() => this._progressMessage());
  readonly showProgress = computed(() => this._showProgress());
  readonly isGlobalSaving = computed(() => this._isGlobalSaving());
  readonly isOperationRunning = computed(
    () => this._showProgress() || this._isGlobalSaving()
  );

  readonly currentTabIndex = computed(() => this._currentTabIndex());
  readonly tabValidationStates = computed(() => this._tabValidationStates());

  // Tab configuration
  readonly tabConfigs: TabConfig[] = [
    {
      id: 'account',
      label: 'Account Information',
      component: AccountInformationComponent,
      mode: 'eager', // Load immediately
      enabled: true,
      icon: 'account_circle',
      iconTooltip: 'Personal and contact information',
      showPerTabActions: true,
      required: true,
      order: 1,
    },
    {
      id: 'billing',
      label: 'Billing Information',
      component: BillingInformationComponent,
      mode: 'lazy', // Load after delay
      enabled: true,
      icon: 'payment',
      iconTooltip: 'Payment method and billing address',
      showPerTabActions: true,
      required: true,
      order: 2,
    },
    {
      id: 'vehicle',
      label: 'Vehicle Details',
      component: CollateralInformationComponent,
      mode: 'onClickOnly', // Load only when clicked
      enabled: true,
      readOnly: true, // Read-only mode
      icon: 'directions_car',
      iconTooltip: 'Vehicle information (read-only)',
      showPerTabActions: false,
      includeInGlobalPayload: true,
      order: 3,
    },
    {
      id: 'documents',
      label: 'Documents',
      component: DocumentsComponent,
      mode: 'lazy',
      enabled: true,
      icon: 'description',
      iconTooltip: 'Required documents and uploads',
      showPerTabActions: true,
      required: true,
      order: 4,
    },
    {
      id: 'review',
      label: 'Review & Submit',
      component: ReviewSubmitComponent,
      mode: 'onClickOnly',
      enabled: false, // Disabled until other sections complete
      disabledTooltip: 'Complete all required sections to enable review',
      icon: 'rate_review',
      iconTooltip: 'Final review and submission',
      showPerTabActions: false,
      required: true,
      order: 5,
    },
  ];

  // Tab group options
  readonly tabOptions: Partial<TabGroupOptions> = {
    globalLoadStrategy: 'lazy',
    validateOnTabSwitch: true,
    saveMode: 'parent', // Parent handles global save
    showGlobalActions: true,
    saveAllLoad: 'missing', // Auto-load missing tabs during save
    saveAllAutoLoadTimeoutMs: 10000,
    saveAllLoadConcurrency: 2,
    emitProgress: true,
    persistState: true,
    persistenceKey: 'booking-tab-state',
    keyboardNavigation: true,
  };

  // Event handlers

  onSaveProgress(event: SaveAllProgressEvent): void {
    this._showProgress.set(true);

    switch (event.phase) {
      case 'autoload':
        this._progressValue.set(
          Math.min(
            40,
            ((event.loadedCount || 0) / (event.totalToLoad || 1)) * 40
          )
        );
        this._progressMessage.set(`Loading ${event.currentTabId || 'tabs'}...`);
        break;

      case 'validate':
        this._progressValue.set(50);
        this._progressMessage.set('Validating forms...');
        break;

      case 'saving':
        this._progressValue.set(70);
        this._progressMessage.set(`Saving ${event.currentTabId || 'data'}...`);
        break;

      case 'emit':
        this._progressValue.set(90);
        this._progressMessage.set('Finalizing...');
        break;

      case 'complete':
        this._progressValue.set(100);
        this._progressMessage.set('Save completed');
        setTimeout(() => {
          this._showProgress.set(false);
          this._progressValue.set(0);
          this._progressMessage.set('');
        }, 1000);
        break;

      case 'error':
        this._showProgress.set(false);
        this._progressValue.set(0);
        this._progressMessage.set('');
        console.error('Save all error:', event.error);
        break;
    }
  }

  async onGlobalSave(payload: Record<string, unknown>): Promise<void> {
    this._isGlobalSaving.set(true);

    try {
      // Simulate building complete booking data
      const bookingData: BookingData = {
        accountInfo: payload['account'] as any,
        billingInfo: payload['billing'] as any,
        collateralInfo: payload['vehicle'] as any,
        status: 'submitted',
      };

      // Save to service
      const result = await this.bookingService
        .saveCompleteBooking(bookingData)
        .toPromise();

      this.snackBar.open(
        `Booking submitted successfully! ID: ${
          (result as any)?.data?.bookingId
        }`,
        'Close',
        { duration: 5000 }
      );

      // Enable review tab after successful save
      this.updateTabConfig('review', {
        enabled: true,
        disabledTooltip: undefined,
      });
    } catch (error) {
      console.error('Global save failed:', error);
      this.snackBar.open(
        'Failed to submit booking. Please try again.',
        'Close',
        { duration: 5000 }
      );
    } finally {
      this._isGlobalSaving.set(false);
    }
  }

  onGlobalReset(): void {
    this.snackBar.open('All forms have been reset', 'Close', {
      duration: 2000,
    });

    // Disable review tab again
    this.updateTabConfig('review', {
      enabled: false,
      disabledTooltip: 'Complete all required sections to enable review',
    });
  }

  onTabChanged(tabIndex: number): void {
    this._currentTabIndex.set(tabIndex);
  }

  onValidationChanged(event: any): void {
    this._tabValidationStates.update((states) => ({
      ...states,
      [event.tabId]: event.isValid,
    }));
  }

  onTabSaved(event: any): void {
    this.snackBar.open(
      `${this.getTabLabel(event.tabId)} saved successfully`,
      'Close',
      { duration: 2000 }
    );
  }

  onTabReset(event: any): void {
    this.snackBar.open(
      `${this.getTabLabel(event.tabId)} has been reset`,
      'Close',
      { duration: 2000 }
    );
  }

  onTabLoadError(error: any): void {
    console.error('Tab load error:', error);
    this.snackBar
      .open(`Failed to load ${error.tabId}. Please try again.`, 'Retry', {
        duration: 5000,
      })
      .onAction()
      .subscribe(() => {
        // Retry logic would go here
      });
  }

  // Action methods

  async quickSave(): Promise<void> {
    if (!this.tabGroup) return;
    await this.tabGroup.saveAll();
  }

  clearDemoData(): void {
    if (!this.tabGroup) return;

    this.tabGroup.resetAll();
    (this.bookingService as any).reset();
    this._tabValidationStates.set({});

    this.snackBar.open('Demo data cleared', 'Close', { duration: 2000 });
  }

  // Helper methods

  private getTabLabel(tabId: string): string {
    const tab = this.tabConfigs.find((t) => t.id === tabId);
    return tab?.label || tabId;
  }

  private updateTabConfig(tabId: string, updates: Partial<TabConfig>): void {
    const tab = this.tabConfigs.find((t) => t.id === tabId);
    if (tab) {
      Object.assign(tab, updates);
    }
  }

  canQuickSave(): boolean {
    // Can save if at least one tab is loaded and valid
    const states = this._tabValidationStates();
    return Object.values(states).some((valid) => valid === true);
  }

  getSaveButtonText(): string {
    if (this.isOperationRunning()) return 'Saving...';
    return 'Save Application';
  }

  getStatusColor(): string {
    const states = this._tabValidationStates();
    const validCount = Object.values(states).filter(
      (valid) => valid === true
    ).length;
    const totalRequired = this.tabConfigs.filter(
      (t) => t.required && t.enabled !== false
    ).length;

    if (validCount === 0) return 'rgba(244, 67, 54, 0.2)'; // Red
    if (validCount < totalRequired) return 'rgba(255, 152, 0, 0.2)'; // Orange
    return 'rgba(76, 175, 80, 0.2)'; // Green
  }

  getStatusIcon(): string {
    const states = this._tabValidationStates();
    const validCount = Object.values(states).filter(
      (valid) => valid === true
    ).length;
    const totalRequired = this.tabConfigs.filter(
      (t) => t.required && t.enabled !== false
    ).length;

    if (validCount === 0) return 'error';
    if (validCount < totalRequired) return 'warning';
    return 'check_circle';
  }

  getStatusText(): string {
    const states = this._tabValidationStates();
    const validCount = Object.values(states).filter(
      (valid) => valid === true
    ).length;
    const totalRequired = this.tabConfigs.filter(
      (t) => t.required && t.enabled !== false
    ).length;

    if (validCount === 0) return 'Not Started';
    if (validCount < totalRequired)
      return `${validCount}/${totalRequired} Complete`;
    return 'Ready to Submit';
  }
}
