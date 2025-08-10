import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Subject, takeUntil } from 'rxjs';
import { TabValidatable } from '../../../shared/components/tab-group/tab.interfaces';
import { AccountInformation, BookingService } from '../booking.service';

@Component({
  selector: 'app-account-information-tab',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="account-information-tab">
      <div *ngIf="isLoading" class="loading-spinner">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Loading account information...</p>
      </div>

      <form [formGroup]="accountForm" *ngIf="!isLoading" class="account-form">
        <div class="form-section">
          <h3>Personal Information</h3>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>First Name</mat-label>
              <input
                matInput
                formControlName="firstName"
                placeholder="Enter first name"
              />
              <mat-error
                *ngIf="accountForm.get('firstName')?.hasError('required')"
              >
                First name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Last Name</mat-label>
              <input
                matInput
                formControlName="lastName"
                placeholder="Enter last name"
              />
              <mat-error
                *ngIf="accountForm.get('lastName')?.hasError('required')"
              >
                Last name is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Email Address</mat-label>
              <input
                matInput
                type="email"
                formControlName="email"
                placeholder="Enter email"
              />
              <mat-error *ngIf="accountForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="accountForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Phone Number</mat-label>
              <input
                matInput
                formControlName="phone"
                placeholder="Enter phone number"
              />
              <mat-error *ngIf="accountForm.get('phone')?.hasError('required')">
                Phone number is required
              </mat-error>
            </mat-form-field>
          </div>
        </div>

        <div class="form-section">
          <h3>Company Information (Optional)</h3>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Company Name</mat-label>
              <input
                matInput
                formControlName="companyName"
                placeholder="Enter company name"
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Tax ID</mat-label>
              <input
                matInput
                formControlName="taxId"
                placeholder="Enter tax ID"
              />
            </mat-form-field>
          </div>
        </div>

        <div class="form-section" formGroupName="address">
          <h3>Address</h3>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Street Address</mat-label>
            <input
              matInput
              formControlName="street"
              placeholder="Enter street address"
            />
            <mat-error
              *ngIf="accountForm.get('address.street')?.hasError('required')"
            >
              Street address is required
            </mat-error>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>City</mat-label>
              <input matInput formControlName="city" placeholder="Enter city" />
              <mat-error
                *ngIf="accountForm.get('address.city')?.hasError('required')"
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
                *ngIf="accountForm.get('address.state')?.hasError('required')"
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
                  accountForm.get('address.postalCode')?.hasError('required')
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
                *ngIf="accountForm.get('address.country')?.hasError('required')"
              >
                Country is required
              </mat-error>
            </mat-form-field>
          </div>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./account-information-tab.component.scss'],
})
export class AccountInformationTabComponent
  implements OnInit, OnDestroy, TabValidatable
{
  private bookingService = inject(BookingService);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  isLoading = false;
  accountForm!: FormGroup;

  states = [
    { code: 'CA', name: 'California' },
    { code: 'NY', name: 'New York' },
    { code: 'TX', name: 'Texas' },
    { code: 'FL', name: 'Florida' },
    // Add more states as needed
  ];

  countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'UK', name: 'United Kingdom' },
    // Add more countries as needed
  ];

  ngOnInit() {
    this.initializeForm();
    this.loadAccountData();
    this.setupFormValidation();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.accountForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      companyName: [''],
      taxId: [''],
      address: this.fb.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        postalCode: ['', [Validators.required]],
        country: ['US', [Validators.required]],
      }),
    });
  }

  private setupFormValidation() {
    this.accountForm.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        const isValid = status === 'VALID';
      });

    this.accountForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {});
  }

  private loadAccountData() {
    const currentBooking = this.bookingService.getCurrentBooking();
    if (currentBooking?.id) {
      this.isLoading = true;

      this.bookingService
        .loadAccountInformation(currentBooking.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (accountData) => {
            this.accountForm.patchValue(accountData);
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading account information:', error);
            this.isLoading = false;
          },
        });
    }
  }

  getData(): AccountInformation {
    return this.accountForm.value as AccountInformation;
  }

  validate(): boolean {
    this.accountForm.markAllAsTouched();
    const isValid = this.accountForm.valid;

    return isValid;
  }

  reset() {
    this.accountForm.reset();
    this.accountForm.patchValue({
      address: {
        country: 'US',
      },
    });
  }

  save(): void {
    if (this.validate()) {
      const currentBooking = this.bookingService.getCurrentBooking();
      if (currentBooking?.id) {
        this.bookingService
          .saveAccountInformation(currentBooking.id, this.getData())
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              console.log('Account information saved successfully');
            },
            error: (error) => {
              console.error('Error saving account information:', error);
            },
          });
      }
    }
  }

  // TabValidatable interface methods (parent implementations)
  isDirty(): boolean {
    return this.accountForm?.dirty ?? false;
  }

  isValid(): boolean {
    return this.accountForm?.valid ?? false;
  }
}
