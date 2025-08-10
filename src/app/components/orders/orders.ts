import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-orders',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatExpansionModule,
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders implements OnInit {
  orderForm!: FormGroup;

  // Data for dropdowns
  customers = [
    { id: 1, name: 'Acme Corporation' },
    { id: 2, name: 'TechStart Inc.' },
    { id: 3, name: 'Global Solutions Ltd.' },
    { id: 4, name: 'Innovation Partners' },
    { id: 5, name: 'Future Dynamics' },
  ];

  products = [
    { id: 1, name: 'Premium Software License', price: 299.99 },
    { id: 2, name: 'Professional Services', price: 150.0 },
    { id: 3, name: 'Training Package', price: 500.0 },
    { id: 4, name: 'Support Contract', price: 200.0 },
  ];

  priorities = ['Low', 'Medium', 'High', 'Critical'];
  statuses = [
    'Draft',
    'Pending',
    'Approved',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
  ];
  shippingMethods = ['Standard', 'Express', 'Next Day', 'International'];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.orderForm = this.fb.group({
      // Customer Information
      customer: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: ['', Validators.required],

      // Order Details
      orderNumber: ['', Validators.required],
      orderDate: [new Date(), Validators.required],
      deliveryDate: [''],
      priority: ['Medium', Validators.required],
      status: ['Draft', Validators.required],

      // Product Information
      product: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.min(0), Validators.max(100)]],

      // Shipping Information
      shippingMethod: ['Standard', Validators.required],
      shippingAddress: ['', Validators.required],
      shippingCity: ['', Validators.required],
      shippingZip: ['', Validators.required],
      shippingCountry: ['', Validators.required],

      // Additional Options
      requiresApproval: [false],
      rushOrder: [false],
      giftWrap: [false],
      communicationPref: ['email'], // Added this line
      specialInstructions: [''],

      // Terms and Conditions
      termsAccepted: [false, Validators.requiredTrue],
      newsletterSubscription: [false],
    });

    // Update unit price when product changes
    this.orderForm.get('product')?.valueChanges.subscribe((productId) => {
      const selectedProduct = this.products.find((p) => p.id === productId);
      if (selectedProduct) {
        this.orderForm.patchValue({ unitPrice: selectedProduct.price });
      }
    });
  }

  calculateTotal(): number {
    const quantity = this.orderForm.get('quantity')?.value || 0;
    const unitPrice = this.orderForm.get('unitPrice')?.value || 0;
    const discount = this.orderForm.get('discount')?.value || 0;

    const subtotal = quantity * unitPrice;
    const discountAmount = subtotal * (discount / 100);
    return subtotal - discountAmount;
  }

  onSubmit() {
    if (this.orderForm.valid) {
      console.log('Order Form Submitted:', this.orderForm.value);
      console.log('Total Amount:', this.calculateTotal());
      // Here you would typically send the data to a service
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched();
    }
  }

  onReset() {
    this.orderForm.reset();
    this.initializeForm();
  }

  private markFormGroupTouched() {
    Object.keys(this.orderForm.controls).forEach((key) => {
      const control = this.orderForm.get(key);
      control?.markAsTouched();
    });
  }

  // Helper method to get form control errors
  getErrorMessage(fieldName: string): string {
    const control = this.orderForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email';
    }
    if (control?.hasError('min')) {
      return `Value must be greater than ${control.errors?.['min'].min}`;
    }
    if (control?.hasError('max')) {
      return `Value must be less than ${control.errors?.['max'].max}`;
    }
    return '';
  }
}
