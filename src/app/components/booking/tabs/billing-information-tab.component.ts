import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Subject, takeUntil } from 'rxjs';
import { TabValidatable } from '../../../shared/components/tab-group/tab.interfaces';
import { BillingInformation, BookingService } from '../booking.service';

@Component({
  selector: 'app-billing-information-tab',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="billing-information-tab">
      <div *ngIf="isLoading" class="loading-spinner">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Loading billing information...</p>
      </div>

      <form [formGroup]="billingForm" *ngIf="!isLoading" class="billing-form">
        <div class="form-section">
          <h3>Billing Method</h3>

          <mat-radio-group
            formControlName="billingMethod"
            class="billing-method-group"
          >
            <mat-radio-button value="credit-card">Credit Card</mat-radio-button>
            <mat-radio-button value="bank-transfer"
              >Bank Transfer</mat-radio-button
            >
            <mat-radio-button value="invoice">Invoice</mat-radio-button>
          </mat-radio-group>
        </div>

        <!-- Credit Card Section -->
        <div
          class="form-section"
          *ngIf="billingForm.get('billingMethod')?.value === 'credit-card'"
          formGroupName="creditCard"
        >
          <h3>Credit Card Information</h3>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Card Number</mat-label>
            <input
              matInput
              formControlName="cardNumber"
              placeholder="1234 5678 9012 3456"
              maxlength="19"
            />
            <mat-error
              *ngIf="
                billingForm.get('creditCard.cardNumber')?.hasError('required')
              "
            >
              Card number is required
            </mat-error>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Expiry Month</mat-label>
              <mat-select formControlName="expiryMonth">
                <mat-option *ngFor="let month of months" [value]="month.value">
                  {{ month.label }}
                </mat-option>
              </mat-select>
              <mat-error
                *ngIf="
                  billingForm
                    .get('creditCard.expiryMonth')
                    ?.hasError('required')
                "
              >
                Month is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Expiry Year</mat-label>
              <mat-select formControlName="expiryYear">
                <mat-option *ngFor="let year of years" [value]="year">
                  {{ year }}
                </mat-option>
              </mat-select>
              <mat-error
                *ngIf="
                  billingForm.get('creditCard.expiryYear')?.hasError('required')
                "
              >
                Year is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>CVV</mat-label>
              <input
                matInput
                formControlName="cvv"
                placeholder="123"
                maxlength="4"
              />
              <mat-error
                *ngIf="billingForm.get('creditCard.cvv')?.hasError('required')"
              >
                CVV is required
              </mat-error>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Cardholder Name</mat-label>
            <input
              matInput
              formControlName="cardholderName"
              placeholder="Enter cardholder name"
            />
            <mat-error
              *ngIf="
                billingForm
                  .get('creditCard.cardholderName')
                  ?.hasError('required')
              "
            >
              Cardholder name is required
            </mat-error>
          </mat-form-field>
        </div>

        <!-- Bank Transfer Section -->
        <div
          class="form-section"
          *ngIf="billingForm.get('billingMethod')?.value === 'bank-transfer'"
          formGroupName="bankAccount"
        >
          <h3>Bank Account Information</h3>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Account Number</mat-label>
              <input
                matInput
                formControlName="accountNumber"
                placeholder="Enter account number"
              />
              <mat-error
                *ngIf="
                  billingForm
                    .get('bankAccount.accountNumber')
                    ?.hasError('required')
                "
              >
                Account number is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Routing Number</mat-label>
              <input
                matInput
                formControlName="routingNumber"
                placeholder="Enter routing number"
              />
              <mat-error
                *ngIf="
                  billingForm
                    .get('bankAccount.routingNumber')
                    ?.hasError('required')
                "
              >
                Routing number is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Account Type</mat-label>
              <mat-select formControlName="accountType">
                <mat-option value="checking">Checking</mat-option>
                <mat-option value="savings">Savings</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Bank Name</mat-label>
              <input
                matInput
                formControlName="bankName"
                placeholder="Enter bank name"
              />
              <mat-error
                *ngIf="
                  billingForm.get('bankAccount.bankName')?.hasError('required')
                "
              >
                Bank name is required
              </mat-error>
            </mat-form-field>
          </div>
        </div>

        <!-- Billing Address Section -->
        <div class="form-section">
          <h3>Billing Address</h3>

          <mat-checkbox
            formControlName="sameAsAccountAddress"
            class="checkbox-field"
          >
            Use same address as account information
          </mat-checkbox>

          <div
            class="billing-address-fields"
            *ngIf="!billingForm.get('sameAsAccountAddress')?.value"
            formGroupName="billingAddress"
          >
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Street Address</mat-label>
              <input
                matInput
                formControlName="street"
                placeholder="Enter street address"
              />
              <mat-error
                *ngIf="
                  billingForm.get('billingAddress.street')?.hasError('required')
                "
              >
                Street address is required
              </mat-error>
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>City</mat-label>
                <input
                  matInput
                  formControlName="city"
                  placeholder="Enter city"
                />
                <mat-error
                  *ngIf="
                    billingForm.get('billingAddress.city')?.hasError('required')
                  "
                >
                  City is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>State</mat-label>
                <mat-select formControlName="state">
                  <mat-option *ngFor="let state of states" [value]="state.code">
                    {{ state.name }}
                  </mat-option>
                </mat-select>
                <mat-error
                  *ngIf="
                    billingForm
                      .get('billingAddress.state')
                      ?.hasError('required')
                  "
                >
                  State is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Postal Code</mat-label>
                <input
                  matInput
                  formControlName="postalCode"
                  placeholder="Enter postal code"
                />
                <mat-error
                  *ngIf="
                    billingForm
                      .get('billingAddress.postalCode')
                      ?.hasError('required')
                  "
                >
                  Postal code is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Country</mat-label>
                <mat-select formControlName="country">
                  <mat-option
                    *ngFor="let country of countries"
                    [value]="country.code"
                  >
                    {{ country.name }}
                  </mat-option>
                </mat-select>
                <mat-error
                  *ngIf="
                    billingForm
                      .get('billingAddress.country')
                      ?.hasError('required')
                  "
                >
                  Country is required
                </mat-error>
              </mat-form-field>
            </div>
          </div>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./billing-information-tab.component.scss'],
})
export class BillingInformationTabComponent
  implements OnInit, OnDestroy, TabValidatable
{
  private bookingService = inject(BookingService);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  isLoading = false;
  billingForm!: FormGroup;

  months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  years = Array.from({ length: 10 }, (_, i) =>
    (new Date().getFullYear() + i).toString()
  );

  states = [
    { code: 'CA', name: 'California' },
    { code: 'NY', name: 'New York' },
    { code: 'TX', name: 'Texas' },
    { code: 'FL', name: 'Florida' },
  ];

  countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'UK', name: 'United Kingdom' },
  ];

  ngOnInit() {
    this.initializeForm();
    this.loadBillingData();
    this.setupFormValidation();
    this.setupConditionalValidation();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.billingForm = this.fb.group({
      billingMethod: ['credit-card', [Validators.required]],
      sameAsAccountAddress: [true],
      creditCard: this.fb.group({
        cardNumber: [''],
        expiryMonth: [''],
        expiryYear: [''],
        cvv: [''],
        cardholderName: [''],
      }),
      bankAccount: this.fb.group({
        accountNumber: [''],
        routingNumber: [''],
        accountType: ['checking'],
        bankName: [''],
      }),
      billingAddress: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        postalCode: [''],
        country: ['US'],
      }),
    });
  }

  private setupConditionalValidation() {
    // Update validation based on billing method
    this.billingForm
      .get('billingMethod')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((method) => {
        this.updateValidationRules(method);
      });

    // Update billing address validation
    this.billingForm
      .get('sameAsAccountAddress')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((sameAddress) => {
        this.updateBillingAddressValidation(!sameAddress);
      });

    // Initialize validation rules
    this.updateValidationRules(this.billingForm.get('billingMethod')?.value);
  }

  private updateValidationRules(billingMethod: string) {
    const creditCardGroup = this.billingForm.get('creditCard') as FormGroup;
    const bankAccountGroup = this.billingForm.get('bankAccount') as FormGroup;

    // Clear all validators first
    Object.keys(creditCardGroup.controls).forEach((key) => {
      creditCardGroup.get(key)?.clearValidators();
      creditCardGroup.get(key)?.updateValueAndValidity();
    });

    Object.keys(bankAccountGroup.controls).forEach((key) => {
      bankAccountGroup.get(key)?.clearValidators();
      bankAccountGroup.get(key)?.updateValueAndValidity();
    });

    // Add validators based on billing method
    if (billingMethod === 'credit-card') {
      creditCardGroup.get('cardNumber')?.setValidators([Validators.required]);
      creditCardGroup.get('expiryMonth')?.setValidators([Validators.required]);
      creditCardGroup.get('expiryYear')?.setValidators([Validators.required]);
      creditCardGroup.get('cvv')?.setValidators([Validators.required]);
      creditCardGroup
        .get('cardholderName')
        ?.setValidators([Validators.required]);
    } else if (billingMethod === 'bank-transfer') {
      bankAccountGroup
        .get('accountNumber')
        ?.setValidators([Validators.required]);
      bankAccountGroup
        .get('routingNumber')
        ?.setValidators([Validators.required]);
      bankAccountGroup.get('bankName')?.setValidators([Validators.required]);
    }

    // Update validity
    creditCardGroup.updateValueAndValidity();
    bankAccountGroup.updateValueAndValidity();
  }

  private updateBillingAddressValidation(required: boolean) {
    const billingAddressGroup = this.billingForm.get(
      'billingAddress'
    ) as FormGroup;

    Object.keys(billingAddressGroup.controls).forEach((key) => {
      const control = billingAddressGroup.get(key);
      if (key !== 'country') {
        // country always has default value
        if (required) {
          control?.setValidators([Validators.required]);
        } else {
          control?.clearValidators();
        }
        control?.updateValueAndValidity();
      }
    });
  }

  private setupFormValidation() {
    this.billingForm.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        const isValid = status === 'VALID';
      });

    this.billingForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {});
  }

  private loadBillingData() {
    const currentBooking = this.bookingService.getCurrentBooking();
    if (currentBooking?.id) {
      this.isLoading = true;

      this.bookingService
        .loadBillingInformation(currentBooking.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (billingData) => {
            this.billingForm.patchValue(billingData);
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading billing information:', error);
            this.isLoading = false;
          },
        });
    }
  }

  getData(): BillingInformation {
    return this.billingForm.value as BillingInformation;
  }

  validate(): boolean {
    this.billingForm.markAllAsTouched();
    const isValid = this.billingForm.valid;

    return isValid;
  }

  reset() {
    this.billingForm.reset();
    this.billingForm.patchValue({
      billingMethod: 'credit-card',
      sameAsAccountAddress: true,
      bankAccount: { accountType: 'checking' },
      billingAddress: { country: 'US' },
    });
  }

  save(): void {
    if (this.validate()) {
      const currentBooking = this.bookingService.getCurrentBooking();
      if (currentBooking?.id) {
        this.bookingService
          .saveBillingInformation(currentBooking.id, this.getData())
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              console.log('Billing information saved successfully');
            },
            error: (error) => {
              console.error('Error saving billing information:', error);
            },
          });
      }
    }
  }

  // TabValidatable interface methods (parent implementations)
  isDirty(): boolean {
    return this.billingForm?.dirty ?? false;
  }

  isValid(): boolean {
    return this.billingForm?.valid ?? false;
  }
}
