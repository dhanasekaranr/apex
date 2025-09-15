# Apex Dashboard - Styling System Guide

## Overview
This document explains how to use the optimized styling system for building new components like forms, tables, tabs, and other UI elements. The system is built for Material 3 compliance, responsiveness, and reusability.

## Architecture

### File Structure
```
src/themes/
├── _index.scss                 # Main theme entry point
├── variables/
│   ├── _colors.scss            # Color palette and theme colors
│   ├── _spacing.scss           # Spacing scale and utilities
│   ├── _typography.scss        # Font sizes, weights, line heights
│   └── _dimensions.scss        # Border radius, shadows, dimensions
├── mixins/
│   ├── _forms.scss             # Form field and input mixins
│   ├── _cards.scss             # Card component mixins
│   ├── _layout.scss            # Layout and button mixins
│   ├── _controls.scss          # Control component mixins
│   ├── _tables.scss            # Data table mixins (NEW)
│   └── _tabs.scss              # Tab component mixins (NEW)
├── material/
│   └── _material3-overrides.scss # All Material component customizations
├── utilities/
│   └── _utilities.scss         # Utility classes (spacing, colors, layout)
└── variants/
    └── _theme-variants.scss    # Theme density variants (compact, comfortable)
```

## Using the System

### 1. Component SCSS Files
Component SCSS files should be minimal and only contain component-specific overrides:

```scss
// ✅ Good - Minimal component file
// my-component.scss
// Component Name - Minimal Component-specific styles only
// All reusable styles have been moved to /themes/material/_material3-overrides.scss
// Use global class names: .content-card, .action-button-primary, etc.

// Component-specific styles that don't belong in global theme
// (Add any component-specific customizations here if needed)

// The component uses global styles defined in the Material 3 overrides file
```

```scss
// ❌ Bad - Don't repeat global styles in component files
.my-component-container {
  background: #ffffff; // Use CSS custom properties instead
  border-radius: 8px;  // Should be defined globally
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); // Should use global variables
}
```

### 2. CSS Custom Properties
Use CSS custom properties for consistent theming:

```scss
// ✅ Use CSS custom properties
.my-element {
  color: var(--text-primary);
  background: var(--background-card);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-md);
}
```

### 3. Utility Classes
Leverage utility classes for common patterns:

```html
<!-- Layout utilities -->
<div class="d-flex justify-between align-center">
  <h2 class="text-primary">Title</h2>
  <button class="btn-primary">Action</button>
</div>

<!-- Spacing utilities -->
<div class="p-lg m-md">Content</div>

<!-- Responsive utilities -->
<div class="d-none d-md-block">Desktop only</div>
```

## Building New Components

### Forms
Use form mixins for consistent form styling:

```scss
@import 'themes/index';

.my-form {
  @include form-grid(200px, 16px);
  
  .form-section {
    @include form-section();
  }
  
  .mat-mdc-form-field {
    @include form-field-compact();
  }
}
```

### Data Tables
Use table mixins for consistent table layouts:

```scss
@import 'themes/index';

.my-data-table {
  @include data-table-base();
  @include data-table-responsive();
  @include data-table-with-actions();
  @include data-table-status();
}
```

### Tabs
Use tab mixins for consistent tab interfaces:

```scss
@import 'themes/index';

.my-tab-group {
  @include tab-group-base();
  @include tab-group-with-icons();
  @include tab-group-responsive();
}
```

### Cards
Use card mixins for consistent card components:

```scss
@import 'themes/index';

.my-card {
  @include card-base(24px);
  
  .card-header {
    @include card-header(true); // with gradient
  }
  
  .card-actions {
    @include card-actions(16px);
  }
}
```

## Responsive Design

### Breakpoints
The system uses these breakpoints:
- Mobile: `max-width: 480px`
- Tablet: `max-width: 768px`
- Desktop: `min-width: 769px`

### Responsive Utilities
```html
<!-- Show/hide on different screen sizes -->
<div class="d-none d-md-block">Desktop only</div>
<div class="d-md-none">Mobile/tablet only</div>

<!-- Responsive text alignment -->
<div class="text-center text-md-left">Centered on mobile, left on desktop</div>
```

### Responsive Mixins
```scss
.my-component {
  @include responsive-container(1200px);
  @include two-column-layout(20px, 768px);
}
```

## Theme Variants

### Density Levels
Apply density classes to the body or component containers:

```html
<!-- Compact density -->
<body class="theme-compact">

<!-- Comfortable density -->
<body class="theme-comfortable">

<!-- Standard density (default) -->
<body class="theme-standard">
```

### Dark Mode Support
The system is ready for dark mode with CSS custom properties. Toggle dark mode by adding a class:

```html
<body class="theme-dark">
```

## Naming Conventions

### Class Names
- Use semantic, descriptive names
- Follow BEM methodology when appropriate
- **Use generic names for reusable components**

```scss
// ✅ Good naming - Generic and reusable
.page-container {}
.table-container {}
.table-header {}
.table-actions {}
.data-form {}
.form-section {}
.content-card {}
.profile-section {}

// ❌ Avoid specific names - Not reusable
.users-table {}
.products-header {}
.order-actions {}
.user-profile {}
```

### CSS Custom Properties
- Use descriptive prefixes
- Group related properties

```scss
// Colors
--primary-color
--text-primary
--background-card

// Spacing
--spacing-sm
--spacing-md
--spacing-lg

// Dimensions
--border-radius-sm
--shadow-md
--form-field-height-normal
```

## Best Practices

### 1. Reusability
- Use mixins for common patterns
- Leverage utility classes
- Create generic, reusable components

### 2. Maintainability
- Keep component SCSS files minimal
- Use CSS custom properties for values
- Follow consistent naming conventions

### 3. Performance
- Avoid deep nesting (max 3 levels)
- Use efficient selectors
- Minimize duplicate styles

### 4. Accessibility
- Ensure sufficient color contrast
- Use semantic HTML elements
- Include focus states for interactive elements

## Material 3 Compliance

The system follows Material 3 design principles:
- Modern color system with tonal palettes
- Improved typography scale
- Enhanced component designs
- Better spacing and proportions
- Consistent elevation system

## Examples

### Creating a New Form Component
```typescript
// my-component.component.ts
@Component({
  selector: 'app-my-component',
  template: `
    <div class="page-container">
      <div class="content-card">
        <div class="card-header">
          <h2>My Component</h2>
        </div>
        <form class="data-form">
          <div class="form-section">
            <div class="form-grid">
              <mat-form-field class="grid-item">
                <mat-label>First Name</mat-label>
                <input matInput>
              </mat-form-field>
              <mat-form-field class="grid-item">
                <mat-label>Last Name</mat-label>
                <input matInput>
              </mat-form-field>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./my-component.component.scss']
})
export class MyComponent {}
```

```scss
// my-component.component.scss
@import 'themes/index';

.my-component {
  // Use generic classes from the global theme
  // .page-container, .data-form, .content-card, etc.
  
  // Only add component-specific overrides here
}
```

### Creating a New Data Table Component
```typescript
// data-list.component.ts
@Component({
  selector: 'app-data-list',
  template: `
    <div class="table-container">
      <div class="table-header">
        <h2 class="table-title">Data List</h2>
        <div class="table-actions">
          <button mat-raised-button color="primary">Add New</button>
        </div>
      </div>
      <div class="table-filters">
        <mat-form-field>
          <mat-label>Search</mat-label>
          <input matInput>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Status</mat-label>
          <mat-select>
            <mat-option value="all">All</mat-option>
            <mat-option value="active">Active</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <table mat-table [dataSource]="dataSource" class="mat-elevation-z0">
        <!-- Table columns here -->
      </table>
    </div>
  `,
  styleUrls: ['./data-list.component.scss']
})
export class DataListComponent {}
```

```scss
// data-list.component.scss
@import 'themes/index';

.data-list-container {
  @include data-table-base();
  @include data-table-responsive();
  @include data-table-with-actions();
  @include data-table-status();
}
```

## Two-Panel Layout Pattern

### Overview
The two-panel layout is a responsive, reusable pattern for data management interfaces like lookup tables, user management, settings, etc.

### Usage
Use the two-panel layout for components that need a list/navigation panel on the left and a details/editing panel on the right.

```html
<div class="page-container">
  <div class="two-panel-container">
    <!-- Left Panel - Data List -->
    <div class="left-panel data-list-panel">
      <mat-card class="content-card">
        <mat-card-header>
          <mat-card-title>Data List</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search...</mat-label>
            <input matInput>
          </mat-form-field>
          
          <mat-nav-list class="data-list">
            <mat-list-item *ngFor="let item of items" 
                          [class.selected]="selectedItem?.id === item.id">
              <div matListItemTitle>{{ item.name }}</div>
              <div matListItemLine>{{ item.description }}</div>
              <div matListItemMeta class="data-category">{{ item.category }}</div>
            </mat-list-item>
          </mat-nav-list>
        </mat-card-content>
      </mat-card>
    </div>
    
    <!-- Right Panel - Data Details -->
    <div class="right-panel data-details-panel">
      <mat-card class="content-card">
        <mat-card-header>
          <mat-card-title>{{ selectedItem?.name }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="data-info">
            <div class="info-row">
              <span class="info-label">Category:</span>
              <span class="info-value">{{ selectedItem?.category }}</span>
            </div>
          </div>
          
          <div class="action-buttons">
            <button mat-raised-button color="primary">
              <mat-icon>add</mat-icon>
              Add New
            </button>
          </div>
          
          <div class="data-table-container">
            <table mat-table [dataSource]="data" class="data-table">
              <!-- Table columns here -->
            </table>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  </div>
</div>
```

### Variants
- **Default**: `.two-panel-container` - 1fr:2fr ratio, 96% width
- **Compact**: `.two-panel-container.compact` - 1fr:1.5fr ratio, 98% width
- **Wide**: `.two-panel-container.wide` - 1fr:3fr ratio, 94% width

### Component Classes
- `.two-panel-container` - Main container with responsive grid
- `.left-panel.data-list-panel` - Left column for lists/navigation
- `.right-panel.data-details-panel` - Right column for details/editing
- `.data-list` - Scrollable list container
- `.data-info` - Information display area
- `.data-table-container` - Table container with overflow handling
- `.data-table` - Table with responsive columns
- `.data-category` - Category/tag styling
- `.action-buttons` - Button group with proper spacing

### Responsive Behavior
- **Desktop**: Two-column layout with specified ratios
- **Tablet/Mobile**: Single column, stacked layout
- **Table**: Horizontal scroll on mobile for wide tables

### SCSS Mixin
```scss
@include two-panel-layout($gap, $left-width, $right-width, $container-width);
```

### Best Practices
1. Always wrap in `.page-container` for consistent spacing
2. Use semantic class names (.data-list-panel, .data-details-panel)
3. Include empty state in right panel when no item is selected
4. Ensure table containers have proper overflow handling
5. Test on mobile devices for horizontal scroll behavior

## Compact Data Layout Patterns

For data-heavy components that need to maximize space for displaying information:

### Compact Two-Panel Layout
```html
<div class="page-container">
  <div class="two-panel-container">
    <!-- Left panel for navigation/selection -->
    <div class="left-panel data-list-panel">
      <mat-card class="content-card">
        <mat-card-header>
          <mat-card-title>Data List</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <!-- Compact search and list -->
        </mat-card-content>
      </mat-card>
    </div>
    
    <!-- Right panel for data details with minimal padding -->
    <div class="right-panel data-details-panel">
      <mat-card class="content-card">
        <mat-card-header>
          <mat-card-title>Data Details</mat-card-title>
          <mat-card-subtitle>Compact header</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <!-- Maximum space for data visualization -->
        </mat-card-content>
      </mat-card>
    </div>
  </div>
</div>
```

### Compact Utility Classes
```html
<!-- Compact header styling -->
<mat-card-header class="compact-header">
  <mat-card-title>Title</mat-card-title>
</mat-card-header>

<!-- Minimal content padding -->
<mat-card-content class="compact-content">
  <!-- Your data content -->
</mat-card-content>

<!-- Compact table styling -->
<table mat-table class="compact-table">
  <!-- Table content -->
</table>

<!-- Compact form fields -->
<mat-form-field class="compact-form-field">
  <input matInput>
</mat-form-field>

<!-- Compact button group -->
<div class="action-buttons compact-buttons">
  <button mat-raised-button>Action</button>
</div>
```

### CSS Custom Properties for Compact Layouts
```scss
// Available spacing variables (updated for better visual consistency)
--spacing-xs: 6px;     // Small gaps, button spacing
--spacing-sm: 8px;     // Icon margins, mobile padding
--spacing-md: 12px;    // Standard container padding, form gaps
--spacing-lg: 16px;    // Card padding, section spacing
--spacing-xl: 20px;    // Large section spacing
--spacing-xxl: 24px;   // Major layout spacing

// Component and layout spacing
--header-height: 64px;           // Main header toolbar height
--footer-height: 40px;           // Reduced footer height with matching header background
--sidenav-width: 250px;          // Sidebar navigation width
--sidenav-header-height: 97px;  // Sidenav header height to match top header area
--container-padding: 12px;  // Reduced from 16px for better visual balance
--form-field-gap: 12px;
--card-padding: 20px;

// Compact density overrides
--compact-padding: 6px;
--compact-margin: 8px;
--compact-header-height: 64px;
--compact-row-height: 44px;
--compact-button-height: 36px;
```

## Breadcrumb Navigation Pattern

The breadcrumb component provides consistent navigation throughout the application.

### When to Use
- Use breadcrumbs for hierarchical navigation
- Show user's current location in the app structure
- Provide quick navigation back to parent pages
- Ideal for multi-level content structures

### Basic Usage
```html
<!-- Breadcrumb is automatically included in main app layout -->
<app-breadcrumb></app-breadcrumb>
```

### Route Configuration
Configure routes with breadcrumb data for better labels:
```typescript
export const routes: Routes = [
  { 
    path: 'users', 
    component: Users,
    data: { breadcrumb: 'Users', icon: 'people' }
  },
  { 
    path: 'settings/general', 
    component: Settings,
    data: { breadcrumb: 'General Settings', icon: 'tune' }
  }
];
```

### Features
- **Responsive Design**: Adapts to mobile with icon-only display
- **Material Design 3**: Uses consistent theming and colors
- **Accessibility**: Proper ARIA labels and semantic structure
- **Click Navigation**: Navigate back to any level
- **Current Page Indicator**: Highlights current location
- **Icon Support**: Optional icons for each breadcrumb level

### Example Breadcrumb Trails
```
Dashboard
Dashboard > Users
Dashboard > Settings > General
Dashboard > Lookup Management
```

### Mobile Behavior
On mobile devices:
- Shows only icons for intermediate levels
- Always shows current page label
- Maintains first level (Dashboard) label

### Styling
The breadcrumb uses global theme variables defined in `/themes/material/_material3-overrides.scss`:
- Primary color for current page
- Neutral colors for navigation links
- Hover states with surface color changes
- Consistent spacing and typography
- Responsive breakpoints with mobile optimizations
- Accessibility features (high contrast, reduced motion support)

## Troubleshooting

### Common Issues

1. **Styles not applying**: Ensure you're importing the theme index file
2. **CSS custom properties not working**: Check that the properties are defined in the root
3. **Responsive styles not working**: Verify media query breakpoints
4. **Inconsistent spacing**: Use utility classes or CSS custom properties

### Getting Help

- Check the existing components for examples
- Review the mixin definitions in `/themes/mixins/`
- Look at Material 3 overrides in `/themes/material/_material3-overrides.scss`
- Use browser dev tools to inspect CSS custom properties

This styling system provides a solid foundation for building consistent, responsive, and maintainable UI components that follow Material 3 design principles.

## Uniform Button System

The system provides consistent button styling across all components using global classes:

### Action Buttons
```html
<!-- Primary action button -->
<button mat-raised-button class="action-button-primary">
  <mat-icon>save</mat-icon>
  Save
</button>

<!-- Secondary action button -->
<button mat-outlined-button class="action-button-secondary">
  <mat-icon>cancel</mat-icon>
  Cancel
</button>

<!-- Accent action button -->
<button mat-raised-button class="action-button-accent">
  <mat-icon>edit</mat-icon>
  Edit
</button>

<!-- Warning action button -->
<button mat-raised-button class="action-button-warning">
  <mat-icon>delete</mat-icon>
  Delete
</button>
```

### Action Bar Container
```html
<!-- Standard action bar (left aligned) -->
<div class="action-bar">
  <button mat-raised-button class="action-button-primary">Save</button>
  <button mat-outlined-button class="action-button-secondary">Cancel</button>
</div>

<!-- Centered action bar -->
<div class="action-bar center">
  <button mat-raised-button class="action-button-primary">Submit</button>
</div>

<!-- Right aligned action bar -->
<div class="action-bar end">
  <button mat-raised-button class="action-button-primary">Finish</button>
</div>
```

### Common Button Combinations
```html
<!-- Save/Cancel pattern -->
<div class="save-cancel-buttons">
  <button mat-raised-button class="save-button">Save</button>
  <button mat-outlined-button class="cancel-button">Cancel</button>
</div>

<!-- Add/Save pattern -->
<div class="add-save-buttons">
  <button mat-raised-button class="add-button">Add New</button>
  <button mat-raised-button class="save-button">Save Changes</button>
</div>
```

### Icon Buttons
```html
<!-- Status toggle buttons -->
<button mat-icon-button class="action-icon-button primary-icon">
  <mat-icon>check_circle</mat-icon>
</button>

<!-- Delete action buttons -->
<button mat-icon-button class="action-icon-button error-icon">
  <mat-icon>delete</mat-icon>
</button>
```

### Button Specifications
- **Minimum width**: 140px for action buttons
- **Height**: 40px for consistency
- **Icon spacing**: 8px margin-right
- **Font weight**: Medium (500)
- **Text transform**: None (no uppercase)
