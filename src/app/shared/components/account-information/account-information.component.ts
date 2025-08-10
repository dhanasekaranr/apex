/**
 * @fileoverview Account Information tab component with Angular 20 signals
 * @version 1.0.0
 * @author Twenty Development Team
 */

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  AccountInformation,
  BookingService,
} from '../../services/booking.service';
import { TabValidatable } from '../tab-group/tab.interfaces';

/**
 * Custom validator for SSN format
 */
function ssnValidator(control: any) {
  if (!control.value) return null;
  const ssnPattern = /^(?:\d{3}-?\d{2}-?\d{4}|\*{3}-?\*{2}-?\d{4})$/;
  return ssnPattern.test(control.value) ? null : { invalidSsn: true };
}

/**
 * Custom validator for phone format
 */
function phoneValidator(control: any) {
  if (!control.value) return null;
  const phonePattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phonePattern.test(control.value) ? null : { invalidPhone: true };
}

/**
 * Account Information tab component
 *
 * Features:
 * - Reactive form with comprehensive validation
 * - Signal-based state management
 * - Automatic data loading and caching
 * - Read-only mode support
 * - Error handling and retry logic
 * - Accessibility compliance
 * - Real-time validation feedback
 */
@Component({
  selector: 'app-account-information',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  styles: [
    `
      :host {
        display: block;
        padding: 1.5rem;
        max-width: 900px;
        margin: 0 auto;
      }

      .form-container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .form-section {
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: 12px;
        padding: 1.5rem;
        background: var(--mat-sys-surface-container-lowest);
      }

      .section-title {
        margin: 0 0 1rem 0;
        color: var(--mat-sys-on-surface);
        font-weight: 500;
        font-size: 1.1rem;
      }

      .form-row {
        display: grid;
        gap: 1rem;
        grid-template-columns: 1fr 1fr;
      }

      .form-row.single {
        grid-template-columns: 1fr;
      }

      .form-field-full {
        grid-column: 1 / -1;
      }

      .loading-overlay {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
        gap: 1rem;
        color: var(--mat-sys-on-surface-variant);
      }

      .error-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 200px;
        gap: 1rem;
        color: var(--mat-sys-error);
        text-align: center;
      }

      .validation-summary {
        background: var(--mat-sys-error-container);
        color: var(--mat-sys-on-error-container);
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
      }

      .validation-summary h4 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
      }

      .validation-summary ul {
        margin: 0;
        padding-left: 1.5rem;
      }

      .read-only-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        background: var(--mat-sys-secondary-container);
        color: var(--mat-sys-on-secondary-container);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
        margin-left: auto;
      }

      /* Responsive design */
      @media (max-width: 768px) {
        :host {
          padding: 1rem;
        }

        .form-row {
          grid-template-columns: 1fr;
        }

        .form-section {
          padding: 1rem;
        }
      }

      /* Focus indicators */
      .mat-mdc-form-field {
        width: 100%;
      }

      /* Error state styling */
      .mat-mdc-form-field.mat-form-field-invalid .mat-mdc-text-field-wrapper {
        background: var(--mat-sys-error-container);
      }

      /* Success state styling */
      .mat-mdc-form-field.mat-form-field-valid .mat-mdc-text-field-wrapper {
        border-color: var(--mat-sys-tertiary);
      }
    `,
  ],
  template: `
    <!-- Loading State -->
    <div
      *ngIf="isLoading()"
      class="loading-overlay"
      role="status"
      aria-label="Loading account information"
    >
      <mat-spinner diameter="32"></mat-spinner>
      <span>Loading account information...</span>
    </div>

    <!-- Error State -->
    <div *ngIf="hasError()" class="error-state" role="alert">
      <mat-icon style="font-size: 48px; width: 48px; height: 48px;"
        >error_outline</mat-icon
      >
      <h3>Failed to Load Account Information</h3>
      <p>{{ errorMessage() }}</p>
      <button mat-raised-button color="primary" (click)="retryLoad()">
        <mat-icon>refresh</mat-icon>
        Retry
      </button>
    </div>

    <!-- Form Content -->
    <div *ngIf="!isLoading() && !hasError()" class="form-container">
      <!-- Read-only indicator -->
      <div *ngIf="isReadOnly()" class="read-only-badge">
        <mat-icon>visibility</mat-icon>
        <span>Read-only mode</span>
      </div>

      <!-- Validation Summary -->
      <div
        *ngIf="showValidationSummary()"
        class="validation-summary"
        role="alert"
      >
        <h4><mat-icon>error</mat-icon> Please correct the following errors:</h4>
        <ul>
          <li *ngFor="let error of validationErrors()">{{ error }}</li>
        </ul>
      </div>

      <form [formGroup]="form" novalidate>
        <!-- Personal Information Section -->
        <div class="form-section">
          <h3 class="section-title">Personal Information</h3>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>First Name *</mat-label>
              <input
                matInput
                formControlName="firstName"
                required
                autocomplete="given-name"
                [attr.aria-describedby]="
                  form.get('firstName')?.invalid ? 'firstName-error' : null
                "
              />
              <mat-icon matSuffix>person</mat-icon>
              <mat-error
                id="firstName-error"
                *ngIf="form.get('firstName')?.hasError('required')"
              >
                First name is required
              </mat-error>
              <mat-error *ngIf="form.get('firstName')?.hasError('minlength')">
                First name must be at least 2 characters
              </mat-error>
              <mat-error *ngIf="form.get('firstName')?.hasError('pattern')">
                First name must contain only letters
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Last Name *</mat-label>
              <input
                matInput
                formControlName="lastName"
                required
                autocomplete="family-name"
                [attr.aria-describedby]="
                  form.get('lastName')?.invalid ? 'lastName-error' : null
                "
              />
              <mat-icon matSuffix>person</mat-icon>
              <mat-error
                id="lastName-error"
                *ngIf="form.get('lastName')?.hasError('required')"
              >
                Last name is required
              </mat-error>
              <mat-error *ngIf="form.get('lastName')?.hasError('minlength')">
                Last name must be at least 2 characters
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Date of Birth *</mat-label>
              <input
                matInput
                [matDatepicker]="dobPicker"
                formControlName="dateOfBirth"
                required
                readonly
                [attr.aria-describedby]="
                  form.get('dateOfBirth')?.invalid ? 'dob-error' : null
                "
              />
              <mat-datepicker-toggle
                matSuffix
                [for]="dobPicker"
              ></mat-datepicker-toggle>
              <mat-datepicker #dobPicker></mat-datepicker>
              <mat-error
                id="dob-error"
                *ngIf="form.get('dateOfBirth')?.hasError('required')"
              >
                Date of birth is required
              </mat-error>
              <mat-error
                *ngIf="form.get('dateOfBirth')?.hasError('matDatepickerMax')"
              >
                Must be 18 years or older
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Social Security Number *</mat-label>
              <input
                matInput
                formControlName="ssn"
                required
                placeholder="XXX-XX-XXXX"
                autocomplete="off"
                [attr.aria-describedby]="
                  form.get('ssn')?.invalid ? 'ssn-error' : null
                "
              />
              <mat-icon matSuffix>security</mat-icon>
              <mat-error
                id="ssn-error"
                *ngIf="form.get('ssn')?.hasError('required')"
              >
                SSN is required
              </mat-error>
              <mat-error *ngIf="form.get('ssn')?.hasError('invalidSsn')">
                Please enter a valid SSN format
              </mat-error>
            </mat-form-field>
          </div>
        </div>

        <!-- Contact Information Section -->
        <div class="form-section">
          <h3 class="section-title">Contact Information</h3>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Email Address *</mat-label>
              <input
                matInput
                type="email"
                formControlName="email"
                required
                autocomplete="email"
                [attr.aria-describedby]="
                  form.get('email')?.invalid ? 'email-error' : null
                "
              />
              <mat-icon matSuffix>email</mat-icon>
              <mat-error
                id="email-error"
                *ngIf="form.get('email')?.hasError('required')"
              >
                Email address is required
              </mat-error>
              <mat-error *ngIf="form.get('email')?.hasError('email')">
                Please enter a valid email address
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Phone Number *</mat-label>
              <input
                matInput
                type="tel"
                formControlName="phone"
                required
                placeholder="(555) 123-4567"
                autocomplete="tel"
                [attr.aria-describedby]="
                  form.get('phone')?.invalid ? 'phone-error' : null
                "
              />
              <mat-icon matSuffix>phone</mat-icon>
              <mat-error
                id="phone-error"
                *ngIf="form.get('phone')?.hasError('required')"
              >
                Phone number is required
              </mat-error>
              <mat-error *ngIf="form.get('phone')?.hasError('invalidPhone')">
                Please enter a valid phone number
              </mat-error>
            </mat-form-field>
          </div>
        </div>

        <!-- Preferences Section -->
        <div class="form-section">
          <h3 class="section-title">Preferences</h3>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Customer Type</mat-label>
              <mat-select formControlName="customerType">
                <mat-option value="individual">Individual</mat-option>
                <mat-option value="business">Business</mat-option>
              </mat-select>
              <mat-icon matSuffix>account_circle</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Preferred Contact Method</mat-label>
              <mat-select formControlName="preferredContact">
                <mat-option value="email">Email</mat-option>
                <mat-option value="phone">Phone</mat-option>
                <mat-option value="mail">Mail</mat-option>
              </mat-select>
              <mat-icon matSuffix>contact_support</mat-icon>
            </mat-form-field>
          </div>
        </div>
      </form>
    </div>
  `,
})
export class AccountInformationComponent
  implements TabValidatable<AccountInformation>
{
  // Dependencies
  private readonly bookingService = inject(BookingService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackBar = inject(MatSnackBar);

  // Component state
  private readonly _isReadOnly = signal(false);
  private readonly _initialData = signal<AccountInformation | null>(null);

  // Computed state
  readonly isReadOnly = computed(() => this._isReadOnly());
  readonly isLoading = computed(() => this.bookingService.accountLoading());
  readonly hasError = computed(() => !!this.bookingService.accountError());
  readonly errorMessage = computed(
    () => this.bookingService.accountError() || ''
  );

  // Form instance
  readonly form: FormGroup = this.createForm();

  // Validation state
  readonly validationErrors = computed(() => this.getValidationErrors());
  readonly showValidationSummary = computed(
    () =>
      this.form.invalid &&
      this.form.touched &&
      this.validationErrors().length > 0
  );

  constructor() {
    // Load data on initialization
    this.loadAccountData();

    // Watch for form state changes in read-only mode
    effect(() => {
      if (this._isReadOnly()) {
        this.form.disable({ emitEvent: false });
      } else {
        this.form.enable({ emitEvent: false });
      }
    });

    // Auto-save validation state changes
    this.form.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        // Validation state automatically tracked by form
      });
  }

  /**
   * Create reactive form with validation
   */
  private createForm(): FormGroup {
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

    return this.formBuilder.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[a-zA-Z\s-']+$/),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[a-zA-Z\s-']+$/),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, phoneValidator]],
      dateOfBirth: ['', [Validators.required]],
      ssn: ['', [Validators.required, ssnValidator]],
      customerType: ['individual'],
      preferredContact: ['email'],
    });
  }

  /**
   * Load account data from service
   */
  private loadAccountData(): void {
    this.bookingService
      .loadAccountInformation()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this._initialData.set(data);
          this.form.patchValue(data);
          this.form.markAsPristine();
        },
        error: (error) => {
          console.error('Failed to load account information:', error);
        },
      });
  }

  /**
   * Retry loading data
   */
  retryLoad(): void {
    this.loadAccountData();
  }

  /**
   * Get current validation errors
   */
  private getValidationErrors(): string[] {
    const errors: string[] = [];

    if (
      this.form.get('firstName')?.invalid &&
      this.form.get('firstName')?.touched
    ) {
      if (this.form.get('firstName')?.hasError('required')) {
        errors.push('First name is required');
      }
      if (this.form.get('firstName')?.hasError('minlength')) {
        errors.push('First name must be at least 2 characters');
      }
      if (this.form.get('firstName')?.hasError('pattern')) {
        errors.push('First name must contain only letters');
      }
    }

    if (
      this.form.get('lastName')?.invalid &&
      this.form.get('lastName')?.touched
    ) {
      if (this.form.get('lastName')?.hasError('required')) {
        errors.push('Last name is required');
      }
      if (this.form.get('lastName')?.hasError('minlength')) {
        errors.push('Last name must be at least 2 characters');
      }
    }

    if (this.form.get('email')?.invalid && this.form.get('email')?.touched) {
      if (this.form.get('email')?.hasError('required')) {
        errors.push('Email address is required');
      }
      if (this.form.get('email')?.hasError('email')) {
        errors.push('Please enter a valid email address');
      }
    }

    if (this.form.get('phone')?.invalid && this.form.get('phone')?.touched) {
      if (this.form.get('phone')?.hasError('required')) {
        errors.push('Phone number is required');
      }
      if (this.form.get('phone')?.hasError('invalidPhone')) {
        errors.push('Please enter a valid phone number');
      }
    }

    if (
      this.form.get('dateOfBirth')?.invalid &&
      this.form.get('dateOfBirth')?.touched
    ) {
      if (this.form.get('dateOfBirth')?.hasError('required')) {
        errors.push('Date of birth is required');
      }
      if (this.form.get('dateOfBirth')?.hasError('matDatepickerMax')) {
        errors.push('Must be 18 years or older');
      }
    }

    if (this.form.get('ssn')?.invalid && this.form.get('ssn')?.touched) {
      if (this.form.get('ssn')?.hasError('required')) {
        errors.push('SSN is required');
      }
      if (this.form.get('ssn')?.hasError('invalidSsn')) {
        errors.push('Please enter a valid SSN format');
      }
    }

    return errors;
  }

  // TabValidatable implementation

  isValid(): boolean {
    return this.form.valid;
  }

  isDirty(): boolean {
    return this.form.dirty;
  }

  async save(): Promise<void> {
    if (this._isReadOnly() || !this.form.valid) {
      return;
    }

    const formData = this.form.getRawValue() as AccountInformation;

    try {
      await this.bookingService.saveAccountInformation(formData).toPromise();
      this.form.markAsPristine();
      this.snackBar.open('Account information saved successfully', 'Close', {
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to save account information:', error);
      throw error; // Re-throw to let tab component handle
    }
  }

  reset(): void {
    const initialData = this._initialData();
    if (initialData) {
      this.form.patchValue(initialData);
    } else {
      this.form.reset();
    }
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  getData(): AccountInformation {
    return this.form.getRawValue() as AccountInformation;
  }

  setReadOnly(readOnly: boolean): void {
    this._isReadOnly.set(readOnly);
  }

  initializeData(data: Partial<AccountInformation>): void {
    if (data) {
      this.form.patchValue(data);
      this._initialData.set(data as AccountInformation);
    }
  }
}
