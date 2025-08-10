import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {
  BreadcrumbComponent,
  BreadcrumbStyle,
} from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-breadcrumb-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    BreadcrumbComponent,
  ],
  templateUrl: './breadcrumb-demo.component.html',
  styleUrl: './breadcrumb-demo.component.scss',
})
export class BreadcrumbDemoComponent {
  currentStyle: BreadcrumbStyle = 'default';

  breadcrumbStyles: {
    style: BreadcrumbStyle;
    label: string;
    description: string;
  }[] = [
    {
      style: 'default',
      label: 'Default',
      description: 'Clean Material Design 3 styling with standard Roboto font',
    },
    {
      style: 'minimal',
      label: 'Minimal',
      description:
        'Clean and subtle with uppercase text and minimal backgrounds',
    },
    {
      style: 'pill',
      label: 'Pill',
      description: 'Modern rounded pill-shaped buttons with gradient effects',
    },
    {
      style: 'card',
      label: 'Card',
      description: 'Each breadcrumb as a small card with shadows and elevation',
    },
    {
      style: 'underline',
      label: 'Underline',
      description: 'Text-based with smooth animated underlines',
    },
    {
      style: 'elegant',
      label: 'Elegant',
      description: 'Sophisticated serif typography with glass-morphism effects',
    },
    {
      style: 'compact',
      label: 'Compact',
      description: 'Space-efficient with condensed font family',
    },
    {
      style: 'bold',
      label: 'Bold',
      description: 'Strong, high-contrast typography with dramatic effects',
    },
  ];

  setStyle(style: BreadcrumbStyle): void {
    this.currentStyle = style;
  }
}
