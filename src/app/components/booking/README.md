# Angular 20 Booking System

A comprehensive reusable booking system built with Angular 20, featuring a multi-tab interface for account information, billing details, and collateral information.

## 🚀 Features

### Core Components
- **BookingComponent**: Main orchestrating component with global save/reset functionality
- **SharedTabGroupComponent**: Reusable tab group with validation, loading states, and per-tab actions
- **Account Information Tab**: Personal and company details with address management
- **Billing Information Tab**: Payment methods (credit card, bank transfer, invoice) with conditional validation
- **Collateral Information Tab**: Asset details, document management, appraisal and insurance data

### Advanced Features
- ✅ **Reactive Forms**: Comprehensive form validation with conditional validators
- ✅ **HTTP Integration**: Full CRUD operations with loading states and error handling  
- ✅ **State Management**: RxJS BehaviorSubjects for reactive state across tabs
- ✅ **Material 3 Design**: Modern UI with design tokens and custom theming
- ✅ **Responsive Design**: Mobile-first design with accessibility support
- ✅ **TypeScript**: Full type safety with interfaces and generics
- ✅ **Zone-less Architecture**: Angular 20 signal-based reactivity

## 📁 Project Structure

```
src/app/components/booking/
├── booking.component.ts              # Main booking orchestrator
├── booking.component.scss            # Booking component styles
├── booking.service.ts                # HTTP service layer with validation
├── index.ts                         # Module exports
└── tabs/
    ├── account-information-tab.component.ts    # Personal/company info
    ├── account-information-tab.component.scss
    ├── billing-information-tab.component.ts    # Payment methods
    ├── billing-information-tab.component.scss
    ├── collateral-information-tab.component.ts # Asset information
    └── collateral-information-tab.component.scss

src/app/shared/components/tab-group/
├── shared-tab-group.component.ts    # Reusable tab orchestrator
├── shared-tab-group.component.scss
├── shared-tab.component.ts          # Base tab class
└── shared-tab.component.scss
```

## 🛠️ Setup Guide

### 1. Dependencies
Ensure you have these Angular 20 dependencies installed:

```bash
npm install @angular/core@20 @angular/common@20 @angular/forms@20
npm install @angular/material@20 @angular/cdk@20
npm install rxjs
```

### 2. Import Required Modules
Add to your `app.config.ts`:

```typescript
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    importProvidersFrom(
      ReactiveFormsModule,
      HttpClientModule,
      MatSnackBarModule
    )
  ],
};
```

### 3. Add Route (Optional)
In your `app.routes.ts`:

```typescript
import { BookingComponent } from './components/booking/booking.component';

export const routes: Routes = [
  {
    path: 'booking',
    component: BookingComponent,
    data: { breadcrumb: 'Booking', icon: 'book_online' }
  }
  // ... other routes
];
```

## 📖 Usage Examples

### Basic Usage

```typescript
import { Component } from '@angular/core';
import { BookingComponent } from './components/booking';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BookingComponent],
  template: `<app-booking></app-booking>`
})
export class ExampleComponent {}
```

### Using the Service Directly

```typescript
import { Component, inject } from '@angular/core';
import { BookingService, BookingData } from './components/booking';

@Component({
  selector: 'app-booking-manager',
  template: `
    <div *ngIf="currentBooking">
      <h2>{{ currentBooking.accountInformation.firstName }}</h2>
      <p>Status: {{ currentBooking.status }}</p>
    </div>
  `
})
export class BookingManagerComponent {
  private bookingService = inject(BookingService);
  
  currentBooking$ = this.bookingService.booking$;
  currentBooking: BookingData | null = null;
  
  ngOnInit() {
    this.currentBooking$.subscribe(booking => {
      this.currentBooking = booking;
    });
  }
  
  createNewBooking() {
    const newBooking = this.bookingService.createNewBooking();
    console.log('Created booking:', newBooking.id);
  }
  
  async saveBooking() {
    const booking = this.bookingService.getCurrentBooking();
    if (booking?.id) {
      await this.bookingService.saveAccountInformation(
        booking.id, 
        booking.accountInformation
      ).toPromise();
    }
  }
}
```

### Custom Tab Implementation

```typescript
import { Component } from '@angular/core';
import { SharedTabComponent } from './shared/components/tab-group/shared-tab.component';

@Component({
  selector: 'app-custom-tab',
  standalone: true,
  template: `
    <form [formGroup]="customForm">
      <!-- Your custom form fields -->
    </form>
  `
})
export class CustomTabComponent extends SharedTabComponent {
  customForm = this.fb.group({
    customField: ['', Validators.required]
  });
  
  override ngOnInit() {
    super.ngOnInit();
    this.setupValidation();
  }
  
  override validate(): boolean {
    this.customForm.markAllAsTouched();
    const isValid = this.customForm.valid;
    this.setValidation(isValid);
    return isValid;
  }
  
  override getData() {
    return this.customForm.value;
  }
  
  override reset() {
    this.customForm.reset();
    this.setValidation(false);
  }
}
```

## 🔧 Configuration

### Booking Service Configuration

The `BookingService` uses a configurable API base URL:

```typescript
// In booking.service.ts
private readonly API_BASE = '/api/booking'; // Update for your backend

// Or inject from environment
constructor(@Inject('API_CONFIG') private apiConfig: { bookingUrl: string }) {
  this.API_BASE = apiConfig.bookingUrl;
}
```

### Tab Group Configuration

```typescript
const tabConfigs: TabConfig[] = [
  {
    id: 'account',
    label: 'Account Information',
    icon: 'person',           // Material Icon name
    required: true,           // Whether tab is required
    validationEnabled: true,  // Enable form validation
    enabled: true            // Whether tab is interactive
  }
  // ... more tabs
];
```

## 🎨 Styling & Theming

The system uses Angular Material 3 design tokens with custom SCSS mixins:

### Custom Theme Variables
```scss
// In your theme files
@use '@angular/material' as mat;
@use './themes/variables/colors' as colors;

.booking-container {
  background: colors.$surface-container-low;
  
  .booking-header {
    background: linear-gradient(135deg, 
      colors.$primary-container 0%, 
      colors.$secondary-container 100%);
  }
}
```

### Responsive Breakpoints
- **Desktop**: 1280px+ (full layout)
- **Tablet**: 768px-1279px (adjusted spacing)
- **Mobile**: 480px-767px (stacked layout)
- **Small Mobile**: <480px (compact design)

## 📊 API Integration

### Expected Backend Endpoints

```typescript
// Account Information
GET    /api/booking/{id}/account
POST   /api/booking/{id}/account
PUT    /api/booking/{id}/account

// Billing Information  
GET    /api/booking/{id}/billing
POST   /api/booking/{id}/billing
PUT    /api/booking/{id}/billing

// Collateral Information
GET    /api/booking/{id}/collateral
POST   /api/booking/{id}/collateral
PUT    /api/booking/{id}/collateral

// Full Booking
GET    /api/booking/{id}
POST   /api/booking
PUT    /api/booking/{id}
DELETE /api/booking/{id}
```

### Example API Response

```json
{
  "id": "booking-12345",
  "accountInformation": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-0123",
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "postalCode": "12345",
      "country": "United States"
    }
  },
  "billingInformation": {
    "paymentMethod": "credit-card",
    "creditCard": {
      "cardNumber": "**** **** **** 1234",
      "expiryMonth": "12",
      "expiryYear": "2025",
      "cardholderName": "John Doe"
    },
    "sameAsAccountAddress": true
  },
  "collateralInformation": {
    "collateralType": "property",
    "estimatedValue": 250000,
    "description": "Residential property with 3 bedrooms",
    "documents": [
      {
        "type": "title",
        "fileName": "property-title.pdf",
        "fileUrl": "/uploads/documents/property-title.pdf",
        "uploadedAt": "2025-08-08T10:30:00Z"
      }
    ]
  },
  "status": "draft",
  "createdAt": "2025-08-08T09:00:00Z",
  "updatedAt": "2025-08-08T10:30:00Z"
}
```

## 🧪 Testing

### Unit Testing with Jest

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingComponent } from './booking.component';
import { BookingService } from './booking.service';

describe('BookingComponent', () => {
  let component: BookingComponent;
  let fixture: ComponentFixture<BookingComponent>;
  let mockBookingService: jasmine.SpyObj<BookingService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('BookingService', ['createNewBooking', 'getCurrentBooking']);
    
    TestBed.configureTestingModule({
      imports: [BookingComponent],
      providers: [
        { provide: BookingService, useValue: spy }
      ]
    });
    
    fixture = TestBed.createComponent(BookingComponent);
    component = fixture.componentInstance;
    mockBookingService = TestBed.inject(BookingService) as jasmine.SpyObj<BookingService>;
  });

  it('should create new booking on init', () => {
    const mockBooking = { id: 'test-123', status: 'draft' };
    mockBookingService.createNewBooking.and.returnValue(mockBooking);
    
    component.ngOnInit();
    
    expect(mockBookingService.createNewBooking).toHaveBeenCalled();
  });
});
```

### E2E Testing with Cypress

```typescript
// cypress/e2e/booking.cy.ts
describe('Booking System', () => {
  beforeEach(() => {
    cy.visit('/booking');
  });

  it('should complete booking flow', () => {
    // Account tab
    cy.get('[data-cy=first-name]').type('John');
    cy.get('[data-cy=last-name]').type('Doe');
    cy.get('[data-cy=email]').type('john.doe@example.com');
    
    // Navigate to billing tab
    cy.get('[data-cy=billing-tab]').click();
    cy.get('[data-cy=payment-method]').select('credit-card');
    cy.get('[data-cy=card-number]').type('4111111111111111');
    
    // Navigate to collateral tab
    cy.get('[data-cy=collateral-tab]').click();
    cy.get('[data-cy=collateral-type]').select('property');
    cy.get('[data-cy=estimated-value]').type('250000');
    cy.get('[data-cy=description]').type('Test property description');
    
    // Save booking
    cy.get('[data-cy=save-booking]').should('not.be.disabled');
    cy.get('[data-cy=save-booking]').click();
    cy.get('[data-cy=success-message]').should('be.visible');
  });
});
```

## 🔒 Security Considerations

### Form Validation
- Client-side validation for UX
- Server-side validation required for security
- XSS protection via Angular's sanitization
- CSRF protection via HTTP interceptors

### Data Handling
- Sensitive data (credit card info) should be tokenized
- PCI DSS compliance for payment processing
- Secure file upload with virus scanning
- Input sanitization for all user data

### Example Security Implementation

```typescript
// HTTP Interceptor for CSRF
import { HttpInterceptorFn } from '@angular/common/http';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  
  if (csrfToken && ['POST', 'PUT', 'DELETE'].includes(req.method)) {
    req = req.clone({
      setHeaders: {
        'X-CSRF-TOKEN': csrfToken
      }
    });
  }
  
  return next(req);
};
```

## 🚀 Performance Optimization

### Lazy Loading
The tab system supports lazy loading strategies:
- **Eager**: Load all tabs immediately
- **Lazy**: Load tabs when first accessed  
- **OnClickOnly**: Load only when user clicks tab

### Bundle Size Optimization
- Standalone components reduce bundle size
- Tree-shaking eliminates unused Material components
- Lazy-loaded routes split the booking system

### Runtime Performance
- OnPush change detection where possible
- RxJS operators for efficient data streams
- Virtual scrolling for large document lists

## 📚 Advanced Usage

### Custom Validation

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function customBusinessValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (!value) return null;
    
    // Custom business logic
    if (value.estimatedValue > 1000000 && !value.appraisal) {
      return { highValueRequiresAppraisal: true };
    }
    
    return null;
  };
}

// Usage in component
this.collateralForm = this.fb.group({
  collateralInfo: [null, customBusinessValidator()]
});
```

### Event Handling

```typescript
// Listen to booking state changes
this.bookingService.booking$.subscribe(booking => {
  if (booking?.status === 'approved') {
    this.router.navigate(['/booking-confirmation', booking.id]);
  }
});

// Custom tab events
onTabValidationChange(validationState: { [tabId: string]: boolean }) {
  const invalidTabs = Object.entries(validationState)
    .filter(([_, isValid]) => !isValid)
    .map(([tabId]) => tabId);
    
  if (invalidTabs.length > 0) {
    console.log('Invalid tabs:', invalidTabs);
    this.highlightInvalidTabs(invalidTabs);
  }
}
```

## 🤝 Contributing

1. Follow Angular style guide
2. Write unit tests for new features
3. Update documentation for API changes
4. Use conventional commits
5. Ensure accessibility compliance

## 📄 License

This booking system is part of the Angular 20 application and follows the project's licensing terms.

---

For questions or support, please refer to the project documentation or create an issue in the repository.
