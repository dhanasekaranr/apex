import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';

export interface AccountInformation {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName?: string;
  taxId?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface BillingInformation {
  id?: string;
  accountId?: string;
  paymentMethod: 'credit-card' | 'bank-transfer' | 'invoice'; // Changed from billingMethod
  creditCard?: {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    cardholderName: string;
  };
  bankAccount?: {
    accountNumber: string;
    routingNumber: string;
    accountType: 'checking' | 'savings';
    bankName: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  sameAsAccountAddress: boolean;
}

export interface CollateralInformation {
  id?: string;
  accountId?: string;
  collateralType: 'property' | 'vehicle' | 'securities' | 'other';
  estimatedValue: number;
  description: string;
  documents: Array<{
    type: string;
    fileName: string;
    fileUrl?: string;
    uploadedAt: Date;
  }>;
  appraisal?: {
    appraisedValue: number;
    appraisalDate: Date;
    appraiserName: string;
    appraisalDocument?: string;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    coverageAmount: number;
    expiryDate: Date;
  };
}

export interface BookingData {
  id?: string;
  accountInformation: AccountInformation;
  billingInformation: BillingInformation;
  collateralInformation: CollateralInformation;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BookingValidation {
  isValid: boolean;
  errors: string[];
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private http = inject(HttpClient);

  // Base API URL - configure according to your backend
  private readonly API_BASE = '/api/booking';

  // Current booking state
  private bookingSubject = new BehaviorSubject<BookingData | null>(null);
  public booking$ = this.bookingSubject.asObservable();
  public currentBooking$ = this.booking$; // Alias for compatibility

  // Loading states for each tab
  private loadingStatesSubject = new BehaviorSubject<{
    account: boolean;
    billing: boolean;
    collateral: boolean;
  }>({
    account: false,
    billing: false,
    collateral: false,
  });
  public loadingStates$ = this.loadingStatesSubject.asObservable();

  // Validation states
  private validationStatesSubject = new BehaviorSubject<{
    account: BookingValidation;
    billing: BookingValidation;
    collateral: BookingValidation;
  }>({
    account: { isValid: true, errors: [] },
    billing: { isValid: true, errors: [] },
    collateral: { isValid: true, errors: [] },
  });
  public validationStates$ = this.validationStatesSubject.asObservable();

  getCurrentBooking(): BookingData | null {
    return this.bookingSubject.value;
  }

  // Account Information methods
  loadAccountInformation(bookingId: string): Observable<AccountInformation> {
    this.setLoading('account', true);

    return this.http
      .get<AccountInformation>(`${this.API_BASE}/${bookingId}/account`)
      .pipe(
        delay(800), // Simulate API delay
        tap((data) => {
          const currentBooking = this.bookingSubject.value;
          if (currentBooking) {
            this.bookingSubject.next({
              ...currentBooking,
              accountInformation: data,
            });
          }
        }),
        catchError((error) => {
          console.error('Error loading account information:', error);
          return this.handleError(error);
        }),
        tap(() => this.setLoading('account', false))
      );
  }

  saveAccountInformation(
    bookingId: string,
    data: AccountInformation
  ): Observable<AccountInformation> {
    this.setLoading('account', true);

    const validation = this.validateAccountInformation(data);
    this.setValidation('account', validation);

    if (!validation.isValid) {
      this.setLoading('account', false);
      return throwError(
        () => new Error('Validation failed: ' + validation.errors.join(', '))
      );
    }

    return this.http
      .put<AccountInformation>(`${this.API_BASE}/${bookingId}/account`, data)
      .pipe(
        delay(500),
        tap((savedData) => {
          const currentBooking = this.bookingSubject.value;
          if (currentBooking) {
            this.bookingSubject.next({
              ...currentBooking,
              accountInformation: savedData,
            });
          }
        }),
        catchError((error) => this.handleError(error)),
        tap(() => this.setLoading('account', false))
      );
  }

  // Billing Information methods
  loadBillingInformation(bookingId: string): Observable<BillingInformation> {
    this.setLoading('billing', true);

    return this.http
      .get<BillingInformation>(`${this.API_BASE}/${bookingId}/billing`)
      .pipe(
        delay(600),
        tap((data) => {
          const currentBooking = this.bookingSubject.value;
          if (currentBooking) {
            this.bookingSubject.next({
              ...currentBooking,
              billingInformation: data,
            });
          }
        }),
        catchError((error) => this.handleError(error)),
        tap(() => this.setLoading('billing', false))
      );
  }

  saveBillingInformation(
    bookingId: string,
    data: BillingInformation
  ): Observable<BillingInformation> {
    this.setLoading('billing', true);

    const validation = this.validateBillingInformation(data);
    this.setValidation('billing', validation);

    if (!validation.isValid) {
      this.setLoading('billing', false);
      return throwError(
        () => new Error('Validation failed: ' + validation.errors.join(', '))
      );
    }

    return this.http
      .put<BillingInformation>(`${this.API_BASE}/${bookingId}/billing`, data)
      .pipe(
        delay(500),
        tap((savedData) => {
          const currentBooking = this.bookingSubject.value;
          if (currentBooking) {
            this.bookingSubject.next({
              ...currentBooking,
              billingInformation: savedData,
            });
          }
        }),
        catchError((error) => this.handleError(error)),
        tap(() => this.setLoading('billing', false))
      );
  }

  // Collateral Information methods
  loadCollateralInformation(
    bookingId: string
  ): Observable<CollateralInformation> {
    this.setLoading('collateral', true);

    return this.http
      .get<CollateralInformation>(`${this.API_BASE}/${bookingId}/collateral`)
      .pipe(
        delay(1000),
        tap((data) => {
          const currentBooking = this.bookingSubject.value;
          if (currentBooking) {
            this.bookingSubject.next({
              ...currentBooking,
              collateralInformation: data,
            });
          }
        }),
        catchError((error) => this.handleError(error)),
        tap(() => this.setLoading('collateral', false))
      );
  }

  saveCollateralInformation(
    bookingId: string,
    data: CollateralInformation
  ): Observable<CollateralInformation> {
    this.setLoading('collateral', true);

    const validation = this.validateCollateralInformation(data);
    this.setValidation('collateral', validation);

    if (!validation.isValid) {
      this.setLoading('collateral', false);
      return throwError(
        () => new Error('Validation failed: ' + validation.errors.join(', '))
      );
    }

    return this.http
      .put<CollateralInformation>(
        `${this.API_BASE}/${bookingId}/collateral`,
        data
      )
      .pipe(
        delay(500),
        tap((savedData) => {
          const currentBooking = this.bookingSubject.value;
          if (currentBooking) {
            this.bookingSubject.next({
              ...currentBooking,
              collateralInformation: savedData,
            });
          }
        }),
        catchError((error) => this.handleError(error)),
        tap(() => this.setLoading('collateral', false))
      );
  }

  // Global save method
  saveAllBookingData(
    bookingId: string,
    allData: {
      account: AccountInformation;
      billing: BillingInformation;
      collateral: CollateralInformation;
    }
  ): Observable<BookingData> {
    // Validate all sections
    const accountValidation = this.validateAccountInformation(allData.account);
    const billingValidation = this.validateBillingInformation(allData.billing);
    const collateralValidation = this.validateCollateralInformation(
      allData.collateral
    );

    this.setValidation('account', accountValidation);
    this.setValidation('billing', billingValidation);
    this.setValidation('collateral', collateralValidation);

    const allValid =
      accountValidation.isValid &&
      billingValidation.isValid &&
      collateralValidation.isValid;

    if (!allValid) {
      const allErrors = [
        ...accountValidation.errors,
        ...billingValidation.errors,
        ...collateralValidation.errors,
      ];
      return throwError(
        () => new Error('Validation failed: ' + allErrors.join(', '))
      );
    }

    const bookingData: BookingData = {
      id: bookingId,
      accountInformation: allData.account,
      billingInformation: allData.billing,
      collateralInformation: allData.collateral,
      status: 'pending',
      updatedAt: new Date(),
    };

    return this.http
      .put<BookingData>(`${this.API_BASE}/${bookingId}`, bookingData)
      .pipe(
        delay(1000),
        tap((savedBooking) => {
          this.bookingSubject.next(savedBooking);
        }),
        catchError((error) => this.handleError(error))
      );
  }

  // Create new booking
  createBooking(): Observable<BookingData> {
    const newBooking: Partial<BookingData> = {
      status: 'draft',
      createdAt: new Date(),
      accountInformation: this.getEmptyAccountInformation(),
      billingInformation: this.getEmptyBillingInformation(),
      collateralInformation: this.getEmptyCollateralInformation(),
    };

    return this.http.post<BookingData>(`${this.API_BASE}`, newBooking).pipe(
      tap((booking) => {
        this.bookingSubject.next(booking);
      }),
      catchError((error) => this.handleError(error))
    );
  }

  // Reset all data
  resetBooking() {
    const currentBooking = this.bookingSubject.value;
    if (currentBooking) {
      this.bookingSubject.next({
        ...currentBooking,
        accountInformation: this.getEmptyAccountInformation(),
        billingInformation: this.getEmptyBillingInformation(),
        collateralInformation: this.getEmptyCollateralInformation(),
      });
    }

    // Reset validation states
    this.validationStatesSubject.next({
      account: { isValid: true, errors: [] },
      billing: { isValid: true, errors: [] },
      collateral: { isValid: true, errors: [] },
    });
  }

  // Validation methods
  private validateAccountInformation(
    data: AccountInformation
  ): BookingValidation {
    const errors: string[] = [];

    if (!data.firstName?.trim()) errors.push('First name is required');
    if (!data.lastName?.trim()) errors.push('Last name is required');
    if (!data.email?.trim()) errors.push('Email is required');
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Valid email is required');
    }
    if (!data.phone?.trim()) errors.push('Phone number is required');
    if (!data.address?.street?.trim())
      errors.push('Street address is required');
    if (!data.address?.city?.trim()) errors.push('City is required');
    if (!data.address?.state?.trim()) errors.push('State is required');
    if (!data.address?.postalCode?.trim())
      errors.push('Postal code is required');
    if (!data.address?.country?.trim()) errors.push('Country is required');

    return { isValid: errors.length === 0, errors };
  }

  private validateBillingInformation(
    data: BillingInformation
  ): BookingValidation {
    const errors: string[] = [];

    if (!data.paymentMethod) errors.push('Payment method is required');

    if (data.paymentMethod === 'credit-card' && data.creditCard) {
      if (!data.creditCard.cardNumber?.trim())
        errors.push('Card number is required');
      if (!data.creditCard.expiryMonth?.trim())
        errors.push('Expiry month is required');
      if (!data.creditCard.expiryYear?.trim())
        errors.push('Expiry year is required');
      if (!data.creditCard.cvv?.trim()) errors.push('CVV is required');
      if (!data.creditCard.cardholderName?.trim())
        errors.push('Cardholder name is required');
    }

    if (data.paymentMethod === 'bank-transfer' && data.bankAccount) {
      if (!data.bankAccount.accountNumber?.trim())
        errors.push('Account number is required');
      if (!data.bankAccount.routingNumber?.trim())
        errors.push('Routing number is required');
      if (!data.bankAccount.bankName?.trim())
        errors.push('Bank name is required');
    }

    return { isValid: errors.length === 0, errors };
  }

  private validateCollateralInformation(
    data: CollateralInformation
  ): BookingValidation {
    const errors: string[] = [];

    if (!data.collateralType) errors.push('Collateral type is required');
    if (!data.estimatedValue || data.estimatedValue <= 0)
      errors.push('Valid estimated value is required');
    if (!data.description?.trim()) errors.push('Description is required');

    return { isValid: errors.length === 0, errors };
  }

  // Helper methods
  private setLoading(
    section: 'account' | 'billing' | 'collateral',
    loading: boolean
  ) {
    const current = this.loadingStatesSubject.value;
    this.loadingStatesSubject.next({
      ...current,
      [section]: loading,
    });
  }

  private setValidation(
    section: 'account' | 'billing' | 'collateral',
    validation: BookingValidation
  ) {
    const current = this.validationStatesSubject.value;
    this.validationStatesSubject.next({
      ...current,
      [section]: validation,
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('BookingService error:', error);
    return throwError(() => error);
  }

  private getEmptyAccountInformation(): AccountInformation {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      companyName: '',
      taxId: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
    };
  }

  private getEmptyBillingInformation(): BillingInformation {
    return {
      paymentMethod: 'credit-card',
      sameAsAccountAddress: true,
      creditCard: {
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        cardholderName: '',
      },
    };
  }

  private getEmptyCollateralInformation(): CollateralInformation {
    return {
      collateralType: 'property',
      estimatedValue: 0,
      description: '',
      documents: [],
    };
  }

  // Additional methods for the booking component
  createNewBooking(): BookingData {
    const newBooking: BookingData = {
      id: this.generateTempId(),
      accountInformation: this.getEmptyAccountInformation(),
      billingInformation: this.getEmptyBillingInformation(),
      collateralInformation: this.getEmptyCollateralInformation(),
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.bookingSubject.next(newBooking);
    return newBooking;
  }

  loadBooking(bookingId: string): Observable<BookingData> {
    return this.http.get<BookingData>(`${this.API_BASE}/${bookingId}`).pipe(
      tap((booking) => {
        this.bookingSubject.next(booking);
      }),
      catchError(this.handleError)
    );
  }

  saveCompleteBooking(
    bookingData: BookingData
  ): Observable<{ bookingId: string }> {
    // If it's a new booking (temp ID), create it; otherwise update
    const isNewBooking = bookingData.id?.startsWith('temp_') || !bookingData.id;

    if (isNewBooking) {
      return this.http
        .post<{ bookingId: string }>(`${this.API_BASE}`, {
          ...bookingData,
          id: undefined, // Remove temp ID
          status: 'pending',
        })
        .pipe(
          delay(800),
          tap((result) => {
            // Update local state with saved booking
            const savedBooking: BookingData = {
              ...bookingData,
              id: result.bookingId,
              status: 'pending',
              updatedAt: new Date(),
            };
            this.bookingSubject.next(savedBooking);
          }),
          catchError(this.handleError)
        );
    } else {
      return this.http
        .put<{ bookingId: string }>(`${this.API_BASE}/${bookingData.id}`, {
          ...bookingData,
          status: 'pending',
          updatedAt: new Date(),
        })
        .pipe(
          delay(800),
          tap((result) => {
            const savedBooking: BookingData = {
              ...bookingData,
              status: 'pending',
              updatedAt: new Date(),
            };
            this.bookingSubject.next(savedBooking);
          }),
          catchError(this.handleError)
        );
    }
  }

  private generateTempId(): string {
    return 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}
