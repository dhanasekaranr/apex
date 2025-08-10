import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  BreadcrumbComponent,
  BreadcrumbStyle,
} from '../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-settings',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    BreadcrumbComponent,
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  selectedCategory: string = 'general';

  // Breadcrumb style demo properties
  selectedBreadcrumbStyle: BreadcrumbStyle = 'default';

  breadcrumbStyles = [
    { value: 'default', label: 'Default - Material Design 3' },
    { value: 'minimal', label: 'Minimal - Clean & Subtle' },
    { value: 'pill', label: 'Pill - Modern Rounded' },
    { value: 'card', label: 'Card - Elevated Cards' },
    { value: 'underline', label: 'Underline - Animated' },
    { value: 'elegant', label: 'Elegant - Serif Typography' },
    { value: 'compact', label: 'Compact - Space Efficient' },
    { value: 'bold', label: 'Bold - High Contrast' },
  ] as const;

  selectCategory(category: string) {
    this.selectedCategory = category;
  }
}
