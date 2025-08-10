import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Subject, takeUntil } from 'rxjs';
import { TabValidatable } from '../../../shared/components/tab-group/tab.interfaces';
import { BookingService, CollateralInformation } from '../booking.service';

@Component({
  selector: 'app-collateral-information-tab',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <div class="collateral-information-tab">
      <div *ngIf="isLoading" class="loading-spinner">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Loading collateral information...</p>
      </div>

      <form
        [formGroup]="collateralForm"
        *ngIf="!isLoading"
        class="collateral-form"
      >
        <div class="form-section">
          <h3>Collateral Details</h3>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Collateral Type</mat-label>
              <mat-select formControlName="collateralType">
                <mat-option value="property">Property</mat-option>
                <mat-option value="vehicle">Vehicle</mat-option>
                <mat-option value="securities">Securities</mat-option>
                <mat-option value="other">Other</mat-option>
              </mat-select>
              <mat-error
                *ngIf="
                  collateralForm.get('collateralType')?.hasError('required')
                "
              >
                Collateral type is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Estimated Value</mat-label>
              <input
                matInput
                type="number"
                formControlName="estimatedValue"
                placeholder="0.00"
              />
              <mat-error
                *ngIf="
                  collateralForm.get('estimatedValue')?.hasError('required')
                "
              >
                Estimated value is required
              </mat-error>
              <mat-error
                *ngIf="collateralForm.get('estimatedValue')?.hasError('min')"
              >
                Value must be greater than 0
              </mat-error>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea
              matInput
              formControlName="description"
              rows="3"
              placeholder="Describe the collateral"
            ></textarea>
            <mat-error
              *ngIf="collateralForm.get('description')?.hasError('required')"
            >
              Description is required
            </mat-error>
          </mat-form-field>
        </div>

        <!-- Documents Section -->
        <div class="form-section">
          <h3>Supporting Documents</h3>

          <div class="documents-list" formArrayName="documents">
            <div
              *ngFor="let document of documentsArray.controls; let i = index"
              [formGroupName]="i"
              class="document-item"
            >
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Document Type</mat-label>
                  <mat-select formControlName="type">
                    <mat-option value="title">Title/Deed</mat-option>
                    <mat-option value="appraisal">Appraisal</mat-option>
                    <mat-option value="insurance">Insurance</mat-option>
                    <mat-option value="registration">Registration</mat-option>
                    <mat-option value="other">Other</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>File Name</mat-label>
                  <input
                    matInput
                    formControlName="fileName"
                    placeholder="document.pdf"
                  />
                </mat-form-field>

                <button
                  mat-icon-button
                  type="button"
                  color="warn"
                  (click)="removeDocument(i)"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          </div>

          <button
            mat-stroked-button
            type="button"
            (click)="addDocument()"
            class="add-document-btn"
          >
            <mat-icon>add</mat-icon>
            Add Document
          </button>
        </div>

        <!-- Appraisal Section -->
        <div class="form-section" formGroupName="appraisal">
          <h3>Appraisal Information (Optional)</h3>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Appraised Value</mat-label>
              <input
                matInput
                type="number"
                formControlName="appraisedValue"
                placeholder="0.00"
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Appraisal Date</mat-label>
              <input
                matInput
                [matDatepicker]="appraisalPicker"
                formControlName="appraisalDate"
              />
              <mat-datepicker-toggle
                matIconSuffix
                [for]="appraisalPicker"
              ></mat-datepicker-toggle>
              <mat-datepicker #appraisalPicker></mat-datepicker>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Appraiser Name</mat-label>
              <input
                matInput
                formControlName="appraiserName"
                placeholder="Enter appraiser name"
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Appraisal Document</mat-label>
              <input
                matInput
                formControlName="appraisalDocument"
                placeholder="appraisal-report.pdf"
              />
            </mat-form-field>
          </div>
        </div>

        <!-- Insurance Section -->
        <div class="form-section" formGroupName="insurance">
          <h3>Insurance Information (Optional)</h3>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Insurance Provider</mat-label>
              <input
                matInput
                formControlName="provider"
                placeholder="Enter insurance provider"
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Policy Number</mat-label>
              <input
                matInput
                formControlName="policyNumber"
                placeholder="Enter policy number"
              />
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Coverage Amount</mat-label>
              <input
                matInput
                type="number"
                formControlName="coverageAmount"
                placeholder="0.00"
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Expiry Date</mat-label>
              <input
                matInput
                [matDatepicker]="insurancePicker"
                formControlName="expiryDate"
              />
              <mat-datepicker-toggle
                matIconSuffix
                [for]="insurancePicker"
              ></mat-datepicker-toggle>
              <mat-datepicker #insurancePicker></mat-datepicker>
            </mat-form-field>
          </div>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./collateral-information-tab.component.scss'],
})
export class CollateralInformationTabComponent
  implements OnInit, OnDestroy, TabValidatable
{
  private bookingService = inject(BookingService);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  isLoading = false;
  collateralForm!: FormGroup;

  get documentsArray(): FormArray {
    return this.collateralForm.get('documents') as FormArray;
  }

  ngOnInit() {
    this.initializeForm();
    this.loadCollateralData();
    this.setupFormValidation();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.collateralForm = this.fb.group({
      collateralType: ['property', [Validators.required]],
      estimatedValue: [0, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required]],
      documents: this.fb.array([]),
      appraisal: this.fb.group({
        appraisedValue: [0],
        appraisalDate: [null],
        appraiserName: [''],
        appraisalDocument: [''],
      }),
      insurance: this.fb.group({
        provider: [''],
        policyNumber: [''],
        coverageAmount: [0],
        expiryDate: [null],
      }),
    });

    // Add initial document
    this.addDocument();
  }

  private setupFormValidation() {
    this.collateralForm.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        const isValid = status === 'VALID';
      });

    this.collateralForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {});
  }

  private loadCollateralData() {
    const currentBooking = this.bookingService.getCurrentBooking();
    if (currentBooking?.id) {
      this.isLoading = true;

      this.bookingService
        .loadCollateralInformation(currentBooking.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (collateralData) => {
            // Clear existing documents array
            while (this.documentsArray.length) {
              this.documentsArray.removeAt(0);
            }

            // Add documents from loaded data
            if (collateralData.documents?.length) {
              collateralData.documents.forEach((doc) => {
                this.documentsArray.push(this.createDocumentFormGroup(doc));
              });
            } else {
              // Add one empty document if none exist
              this.addDocument();
            }

            // Patch the rest of the form
            const { documents, ...restData } = collateralData;
            this.collateralForm.patchValue(restData);
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading collateral information:', error);
            this.isLoading = false;
          },
        });
    }
  }

  private createDocumentFormGroup(document?: any): FormGroup {
    return this.fb.group({
      type: [document?.type || 'title'],
      fileName: [document?.fileName || ''],
      fileUrl: [document?.fileUrl || ''],
      uploadedAt: [document?.uploadedAt || new Date()],
    });
  }

  addDocument() {
    this.documentsArray.push(this.createDocumentFormGroup());
  }

  removeDocument(index: number) {
    if (this.documentsArray.length > 1) {
      this.documentsArray.removeAt(index);
    }
  }

  getData(): CollateralInformation {
    const formValue = this.collateralForm.value;

    // Filter out empty documents
    const validDocuments = formValue.documents.filter(
      (doc: any) => doc.type && doc.fileName
    );

    return {
      ...formValue,
      documents: validDocuments,
    } as CollateralInformation;
  }

  validate(): boolean {
    this.collateralForm.markAllAsTouched();
    const isValid = this.collateralForm.valid;

    return isValid;
  }

  reset() {
    this.collateralForm.reset();

    // Clear documents array and add one empty document
    while (this.documentsArray.length) {
      this.documentsArray.removeAt(0);
    }
    this.addDocument();

    // Reset to default values
    this.collateralForm.patchValue({
      collateralType: 'property',
      estimatedValue: 0,
      description: '',
      appraisal: {
        appraisedValue: 0,
        appraisalDate: null,
        appraiserName: '',
        appraisalDocument: '',
      },
      insurance: {
        provider: '',
        policyNumber: '',
        coverageAmount: 0,
        expiryDate: null,
      },
    });
  }

  save(): void {
    if (this.validate()) {
      const currentBooking = this.bookingService.getCurrentBooking();
      if (currentBooking?.id) {
        this.bookingService
          .saveCollateralInformation(currentBooking.id, this.getData())
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              console.log('Collateral information saved successfully');
            },
            error: (error) => {
              console.error('Error saving collateral information:', error);
            },
          });
      }
    }
  }

  // TabValidatable interface methods (parent implementations)
  isDirty(): boolean {
    return this.collateralForm?.dirty ?? false;
  }

  isValid(): boolean {
    return this.collateralForm?.valid ?? false;
  }
}
