/**
 * @fileoverview Booking service with Angular 20 signals for data management
 * @version 1.0.0
 * @author Twenty Development Team
 */

import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, finalize, map, retry } from 'rxjs/operators';

/**
 * Account information interface
 */
export interface AccountInformation {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string; // ISO date string
  ssn: string;
  customerType: 'individual' | 'business';
  preferredContact: 'email' | 'phone' | 'mail';
}

/**
 * Billing address interface
 */
export interface BillingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  addressType: 'home' | 'business' | 'other';
}

/**
 * Billing information interface
 */
export interface BillingInformation {
  cardNumber: string; // Masked for display
  expiryMonth: string;
  expiryYear: string;
  cvv: string; // Never persist in production
  cardHolderName: string;
  cardType: 'visa' | 'mastercard' | 'amex' | 'discover';
  billingAddress: BillingAddress;
  isAutoPay: boolean;
  preferredPaymentDate: number; // 1-28
}

/**
 * Collateral information interface
 */
export interface CollateralInformation {
  vehicleType: 'car' | 'truck' | 'suv' | 'motorcycle' | 'rv' | 'boat';
  make: string;
  model: string;
  year: number;
  vin: string;
  mileage: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  estimatedValue: number;
  currentLoanBalance?: number;
  hasLien: boolean;
  lienHolder?: string;
  insuranceProvider?: string;
  policyNumber?: string;
}

/**
 * Complete booking data interface
 */
export interface BookingData {
  id?: string;
  accountInfo: AccountInformation;
  billingInfo: BillingInformation;
  collateralInfo: CollateralInformation;
  loanAmount?: number;
  loanTerm?: number;
  interestRate?: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'completed';
  createdAt?: string;
  updatedAt?: string;
}

/**
 * API response interface
 */
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

/**
 * Service configuration
 */
interface BookingServiceConfig {
  apiBaseUrl: string;
  enableMockMode: boolean;
  mockDelay: number;
  retryAttempts: number;
  timeoutMs: number;
}

/**
 * Default service configuration
 */
const DEFAULT_CONFIG: BookingServiceConfig = {
  apiBaseUrl: '/api/booking',
  enableMockMode: true, // Set to false in production
  mockDelay: 300,
  retryAttempts: 2,
  timeoutMs: 10000,
};

/**
 * Booking service with reactive state management
 *
 * Features:
 * - Signal-based state management
 * - HTTP operations with retry logic
 * - Mock data for development
 * - Error handling and recovery
 * - Loading state tracking
 * - Data validation
 */
@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly http = inject(HttpClient);

  // Configuration
  private readonly config = signal<BookingServiceConfig>(DEFAULT_CONFIG);

  // Loading states
  readonly accountLoading = signal(false);
  readonly billingLoading = signal(false);
  readonly collateralLoading = signal(false);
  readonly bookingLoading = signal(false);

  // Error states
  readonly accountError = signal<string | null>(null);
  readonly billingError = signal<string | null>(null);
  readonly collateralError = signal<string | null>(null);
  readonly bookingError = signal<string | null>(null);

  // Data cache
  private readonly _accountData = signal<AccountInformation | null>(null);
  private readonly _billingData = signal<BillingInformation | null>(null);
  private readonly _collateralData = signal<CollateralInformation | null>(null);
  private readonly _bookingData = signal<BookingData | null>(null);

  // Computed values
  readonly accountData = computed(() => this._accountData());
  readonly billingData = computed(() => this._billingData());
  readonly collateralData = computed(() => this._collateralData());
  readonly bookingData = computed(() => this._bookingData());

  readonly isAnyLoading = computed(
    () =>
      this.accountLoading() ||
      this.billingLoading() ||
      this.collateralLoading() ||
      this.bookingLoading()
  );

  readonly hasAnyError = computed(
    () =>
      !!this.accountError() ||
      !!this.billingError() ||
      !!this.collateralError() ||
      !!this.bookingError()
  );

  /**
   * Update service configuration
   */
  updateConfig(config: Partial<BookingServiceConfig>): void {
    this.config.update((current) => ({ ...current, ...config }));
  }

  /**
   * Load account information
   */
  loadAccountInformation(customerId?: string): Observable<AccountInformation> {
    this.accountLoading.set(true);
    this.accountError.set(null);

    const operation = this.config().enableMockMode
      ? this.getMockAccountInfo()
      : this.http
          .get<ApiResponse<AccountInformation>>(
            `${this.config().apiBaseUrl}/account/${customerId || 'current'}`
          )
          .pipe(
            map((response: ApiResponse<AccountInformation>) => response.data)
          );

    return operation.pipe(
      retry(this.config().retryAttempts),
      catchError((error: any) => {
        console.error('Failed to load account information:', error);
        this.accountError.set(this.getErrorMessage(error));
        return throwError(() => error);
      }),
      finalize(() => this.accountLoading.set(false))
    );
  }

  /**
   * Load billing information
   */
  loadBillingInformation(customerId?: string): Observable<BillingInformation> {
    this.billingLoading.set(true);
    this.billingError.set(null);

    const operation = this.config().enableMockMode
      ? this.getMockBillingInfo()
      : this.http
          .get<ApiResponse<BillingInformation>>(
            `${this.config().apiBaseUrl}/billing/${customerId || 'current'}`
          )
          .pipe(
            map((response: ApiResponse<BillingInformation>) => response.data)
          );

    return operation.pipe(
      retry(this.config().retryAttempts),
      catchError((error: any) => {
        console.error('Failed to load billing information:', error);
        this.billingError.set(this.getErrorMessage(error));
        return throwError(() => error);
      }),
      finalize(() => this.billingLoading.set(false))
    );
  }

  /**
   * Load collateral information
   */
  loadCollateralInformation(
    bookingId?: string
  ): Observable<CollateralInformation> {
    this.collateralLoading.set(true);
    this.collateralError.set(null);

    const operation = this.config().enableMockMode
      ? this.getMockCollateralInfo()
      : this.http
          .get<ApiResponse<CollateralInformation>>(
            `${this.config().apiBaseUrl}/collateral/${bookingId || 'current'}`
          )
          .pipe(
            map((response: ApiResponse<CollateralInformation>) => response.data)
          );

    return operation.pipe(
      retry(this.config().retryAttempts),
      catchError((error: any) => {
        console.error('Failed to load collateral information:', error);
        this.collateralError.set(this.getErrorMessage(error));
        return throwError(() => error);
      }),
      finalize(() => this.collateralLoading.set(false))
    );
  }

  /**
   * Save account information
   */
  saveAccountInformation(
    data: AccountInformation
  ): Observable<ApiResponse<AccountInformation>> {
    this.accountLoading.set(true);
    this.accountError.set(null);

    const operation = this.config().enableMockMode
      ? this.mockSaveOperation(data)
      : this.http.post<ApiResponse<AccountInformation>>(
          `${this.config().apiBaseUrl}/account`,
          data
        );

    return operation.pipe(
      retry(this.config().retryAttempts),
      catchError((error) => {
        console.error('Failed to save account information:', error);
        this.accountError.set(this.getErrorMessage(error));
        return throwError(() => error);
      }),
      finalize(() => this.accountLoading.set(false))
    );
  }

  /**
   * Save billing information
   */
  saveBillingInformation(
    data: BillingInformation
  ): Observable<ApiResponse<BillingInformation>> {
    this.billingLoading.set(true);
    this.billingError.set(null);

    const operation = this.config().enableMockMode
      ? this.mockSaveOperation(data)
      : this.http.post<ApiResponse<BillingInformation>>(
          `${this.config().apiBaseUrl}/billing`,
          data
        );

    return operation.pipe(
      retry(this.config().retryAttempts),
      catchError((error) => {
        console.error('Failed to save billing information:', error);
        this.billingError.set(this.getErrorMessage(error));
        return throwError(() => error);
      }),
      finalize(() => this.billingLoading.set(false))
    );
  }

  /**
   * Save collateral information
   */
  saveCollateralInformation(
    data: CollateralInformation
  ): Observable<ApiResponse<CollateralInformation>> {
    this.collateralLoading.set(true);
    this.collateralError.set(null);

    const operation = this.config().enableMockMode
      ? this.mockSaveOperation(data)
      : this.http.post<ApiResponse<CollateralInformation>>(
          `${this.config().apiBaseUrl}/collateral`,
          data
        );

    return operation.pipe(
      retry(this.config().retryAttempts),
      catchError((error) => {
        console.error('Failed to save collateral information:', error);
        this.collateralError.set(this.getErrorMessage(error));
        return throwError(() => error);
      }),
      finalize(() => this.collateralLoading.set(false))
    );
  }

  /**
   * Save complete booking
   */
  saveCompleteBooking(
    booking: BookingData
  ): Observable<ApiResponse<{ bookingId: string }>> {
    this.bookingLoading.set(true);
    this.bookingError.set(null);

    const operation = this.config().enableMockMode
      ? this.mockCompleteBookingSave()
      : this.http.post<ApiResponse<{ bookingId: string }>>(
          `${this.config().apiBaseUrl}/complete`,
          booking
        );

    return operation.pipe(
      retry(this.config().retryAttempts),
      catchError((error) => {
        console.error('Failed to save complete booking:', error);
        this.bookingError.set(this.getErrorMessage(error));
        return throwError(() => error);
      }),
      finalize(() => this.bookingLoading.set(false))
    );
  }

  /**
   * Clear all errors
   */
  clearErrors(): void {
    this.accountError.set(null);
    this.billingError.set(null);
    this.collateralError.set(null);
    this.bookingError.set(null);
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this._accountData.set(null);
    this._billingData.set(null);
    this._collateralData.set(null);
    this._bookingData.set(null);
  }

  /**
   * Reset service to initial state
   */
  reset(): void {
    this.clearErrors();
    this.clearCache();
    this.accountLoading.set(false);
    this.billingLoading.set(false);
    this.collateralLoading.set(false);
    this.bookingLoading.set(false);
  }

  // Private helper methods

  /**
   * Get mock account information
   */
  private getMockAccountInfo(): Observable<AccountInformation> {
    const mockData: AccountInformation = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      dateOfBirth: '1990-01-15',
      ssn: '***-**-6789',
      customerType: 'individual',
      preferredContact: 'email',
    };

    return of(mockData).pipe(delay(this.config().mockDelay));
  }

  /**
   * Get mock billing information
   */
  private getMockBillingInfo(): Observable<BillingInformation> {
    const mockData: BillingInformation = {
      cardNumber: '**** **** **** 1234',
      expiryMonth: '12',
      expiryYear: '2027',
      cvv: '***',
      cardHolderName: 'John Doe',
      cardType: 'visa',
      billingAddress: {
        street: '123 Main Street',
        city: 'Anytown',
        state: 'CA',
        zipCode: '90210',
        country: 'USA',
        addressType: 'home',
      },
      isAutoPay: false,
      preferredPaymentDate: 15,
    };

    return of(mockData).pipe(delay(this.config().mockDelay));
  }

  /**
   * Get mock collateral information
   */
  private getMockCollateralInfo(): Observable<CollateralInformation> {
    const mockData: CollateralInformation = {
      vehicleType: 'car',
      make: 'Toyota',
      model: 'Camry',
      year: 2021,
      vin: '1HGCM82633A123456',
      mileage: 26000,
      condition: 'good',
      estimatedValue: 22000,
      currentLoanBalance: 0,
      hasLien: false,
      insuranceProvider: 'State Farm',
      policyNumber: 'SF-123456789',
    };

    return of(mockData).pipe(delay(this.config().mockDelay));
  }

  /**
   * Mock save operation
   */
  private mockSaveOperation<T>(data: T): Observable<ApiResponse<T>> {
    const response: ApiResponse<T> = {
      data,
      success: true,
      message: 'Data saved successfully',
    };

    return of(response).pipe(delay(this.config().mockDelay));
  }

  /**
   * Mock complete booking save
   */
  private mockCompleteBookingSave(): Observable<
    ApiResponse<{ bookingId: string }>
  > {
    const response: ApiResponse<{ bookingId: string }> = {
      data: { bookingId: `booking-${Date.now()}` },
      success: true,
      message: 'Booking saved successfully',
    };

    return of(response).pipe(
      delay(this.config().mockDelay + 200) // Slightly longer for complete save
    );
  }

  /**
   * Extract error message from error object
   */
  private getErrorMessage(error: any): string {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.error?.message) return error.error.message;
    if (error?.statusText) return error.statusText;
    return 'An unexpected error occurred';
  }
}
