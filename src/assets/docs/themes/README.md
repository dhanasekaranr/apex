# Theme System

Production-ready Material 3 theming system for rapid component development.

## Structure

```
src/themes/
├── _index.scss                    # Main entry point
├── variables/                     # Design tokens
├── mixins/                        # Reusable patterns  
├── material/                      # Material overrides
├── utilities/                     # Utility classes
└── variants/                      # Theme variants
```

## Quick Start

```scss
// Import theme system
@import 'themes/index';

.my-component {
  @include chosen-mixin();
  // Component-specific styles only
}
```

## Documentation

For complete documentation, see:
- `/docs/STYLING_SYSTEM.md` - Comprehensive guide
- `STYLING_GUIDE.md` - Detailed usage examples

## Features

- ✅ Material 3 compliant
- ✅ Responsive design system  
- ✅ 120+ CSS custom properties
- ✅ 100+ utility classes
- ✅ Generic reusable patterns
- ✅ Zero code duplication
- **Latest MDC Components**: All overrides use the latest Material Design Components (MDC) selectors
- **Modern Design Tokens**: CSS custom properties for runtime theme switching
- **Density Levels**: Support for compact, standard, and comfortable density modes
- **Accessibility**: High contrast theme and reduced motion support

### Reusable Architecture
- **Component Isolation**: Component-specific styles remain in component files
- **Global Overrides**: All Material component customizations centralized in themes
- **Utility Classes**: Bootstrap-like utility classes for rapid development
- **Theme Variants**: Easy switching between different UI densities

## 🔧 Usage

### In Component Files
Component SCSS files should only contain component-specific styles:

```scss
// ✅ Good - Component-specific styles
.my-component {
  .custom-header {
    color: var(--primary-color);
  }
}

// ❌ Avoid - Global Material overrides
.mat-mdc-button {
  height: 40px !important;
}
```

### Theme Switching
Switch themes dynamically by adding CSS classes to the body:

```typescript
// Density modes
document.body.className = 'theme-compact';     // High density
document.body.className = 'theme-standard';    // Default density
document.body.className = 'theme-comfortable'; // Low density

// Color themes
document.body.className = 'theme-dark';        // Dark mode
document.body.className = 'theme-high-contrast'; // Accessibility
```

### Utility Classes
Use utility classes for rapid styling:

```html
<!-- Layout utilities -->
<div class="d-flex justify-between align-center">
  <span class="font-weight-medium">Title</span>
  <button class="ml-auto">Action</button>
</div>

<!-- Spacing utilities -->
<div class="p-4 m-2 border rounded">
  Content with padding, margin, border, and rounded corners
</div>
```

## 📋 Material 3 Components Covered

### Form Components
- ✅ Form fields (input, select, textarea)
- ✅ Floating labels with proper centering
- ✅ Compact form field heights (40px)
- ✅ Proper label positioning for empty/filled states

### Interactive Components
- ✅ Buttons (all variants)
- ✅ Icon buttons
- ✅ Checkboxes
- ✅ Chips and chip sets
- ✅ Menus and dropdowns

### Layout Components
- ✅ Tables with compact rows
- ✅ Cards with Material 3 border radius
- ✅ Dialogs with proper styling
- ✅ Paginator with compact design

### Feedback Components
- ✅ Snackbars
- ✅ Tooltips
- ✅ Progress indicators

## 🎯 Customization Guide

### Adding New Theme Variants
1. Create new variant in `variants/_theme-variants.scss`
2. Define CSS custom properties
3. Add component-specific overrides

```scss
.theme-my-custom {
  --primary-color: #your-color;
  --spacing-md: 16px;
  
  .mat-mdc-button {
    border-radius: 20px !important;
  }
}
```

### Adding New Utility Classes
Add utilities to `utilities/_utilities.scss`:

```scss
// Custom spacing utilities
.gap-2 { gap: 8px !important; }
.gap-4 { gap: 16px !important; }

// Custom text utilities
.text-primary { color: var(--primary-color) !important; }
```

### Component-Specific Overrides
For component-specific Material overrides:

```scss
// In your component.scss file
:host {
  .mat-mdc-form-field {
    // Component-specific form field styling
    .mat-mdc-form-field-wrapper {
      background: var(--background-secondary);
    }
  }
}
```

## 🗂️ Reusable Table Components

The theme now includes a complete set of reusable table components that can be used across any component:

### Table Structure Classes
```html
<!-- Complete table layout -->
<div class="your-component-container">
  <!-- Table Header -->
  <div class="table-header">
    <div class="header-content">
      <mat-icon>your_icon</mat-icon>
      <div class="header-text">
        <h1>Your Title</h1>
        <p>Your description</p>
      </div>
    </div>
  </div>

  <!-- Table Filters -->
  <div class="table-filters">
    <div class="filter-row">
      <mat-form-field class="filter-field">...</mat-form-field>
      <button class="filter-action-btn">...</button>
    </div>
  </div>

  <!-- Table Container -->
  <div class="table-container">
    <table mat-table class="data-table">
      <!-- Use .data-info, .data-code, .data-name classes -->
    </table>
  </div>
</div>
```

### Available Table Classes
- **`.table-header`** - Styled header section with icon and title
- **`.table-filters`** - Filter section with form fields and action buttons
- **`.table-container`** - Main table wrapper with proper scrolling
- **`.data-table`** - Table styling with proper spacing and typography
- **`.data-info`** - Info column wrapper (name, subtitle)
- **`.data-code`** - Code/ID column styling
- **`.data-row`** - Row styling with expansion support
- **`.detail-container`** - Expandable detail section
- **`.detail-content`** - Detail content wrapper
- **`.no-data`** - Empty state styling

### Chip Classes (with Material 3 light backgrounds)
- **`.role-chip`** - Role-based chips (.admin-role, .manager-role, etc.)
- **`.status-chip`** - Status-based chips (.active-status, .inactive-status, etc.)

### Example Usage
```html
<!-- In any component -->
<div class="orders-container">
  <div class="table-header">
    <div class="header-content">
      <mat-icon>shopping_cart</mat-icon>
      <div class="header-text">
        <h1>Order Management</h1>
        <p>Manage customer orders and fulfillment</p>
      </div>
    </div>
  </div>
  <!-- Rest of table structure... -->
</div>
```

This approach ensures:
- ✅ **Consistency** across all tables in the application
- ✅ **Minimal component-level styles** - most styling comes from theme
- ✅ **Material 3 compliance** with proper spacing and colors
- ✅ **Responsive design** built-in
- ✅ **Easy maintenance** - update theme to affect all tables

## 📊 Reusable Dashboard Components

The theme includes a complete set of reusable dashboard components for creating consistent dashboard layouts:

### Dashboard Layout Classes
```html
<!-- Complete dashboard layout -->
<div class="dashboard-container">
  <h1 class="dashboard-title">Your Dashboard Title</h1>
  
  <!-- Stats/KPI Grid -->
  <div class="stats-grid">
    <mat-card class="stat-card widget-card">
      <mat-card-content>
        <div class="stat-content">
          <div class="stat-icon" [style.background-color]="color">
            <mat-icon>your_icon</mat-icon>
          </div>
          <div class="stat-info">
            <h3 class="stat-value">123</h3>
            <p class="stat-title">Your Metric</p>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  </div>

  <!-- Content Grid (Charts + Activities) -->
  <div class="content-grid">
    <mat-card class="chart-card widget-card">
      <mat-card-header>
        <mat-card-title>Chart Title</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="chart-placeholder">
          <mat-icon class="chart-icon">trending_up</mat-icon>
          <p class="chart-title">Chart placeholder</p>
        </div>
      </mat-card-content>
    </mat-card>

    <mat-card class="activities-card widget-card">
      <mat-card-header>
        <mat-card-title>Recent Activities</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="activity-list">
          <div class="activity-item">
            <mat-icon class="activity-icon">notifications</mat-icon>
            <div class="activity-content">
              <p class="activity-action">Action description</p>
              <span class="activity-time">2 hours ago</span>
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  </div>

  <!-- Actions Grid -->
  <mat-card class="actions-card widget-card">
    <mat-card-header>
      <mat-card-title>Quick Actions</mat-card-title>
    </mat-card-header>
    <mat-card-content>
      <div class="actions-grid">
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon>
          Action Button
        </button>
      </div>
    </mat-card-content>
  </mat-card>
</div>
```

### Available Dashboard Classes
- **`.dashboard-container`** - Main dashboard wrapper with max-width and centering
- **`.dashboard-title`** - Dashboard page title styling
- **`.stats-grid`** - Responsive grid for KPI/stat cards
- **`.stat-card`** - Individual stat card component
- **`.content-grid`** - 2-column layout for charts and activities (responsive)
- **`.chart-card`** - Chart/graph container with placeholder styling
- **`.activities-card`** - Activity feed container
- **`.actions-card`** - Quick actions button grid
- **`.widget-card`** - Base widget styling for consistent card headers

### Dashboard Component Features
- ✅ **Responsive Grid Layouts**: Auto-adjusting grids for different screen sizes
- ✅ **Consistent Card Styling**: Unified header, content, and spacing
- ✅ **Material 3 Colors**: Uses theme color variables throughout
- ✅ **Activity Feed**: Pre-styled activity items with icons and timestamps
- ✅ **Chart Placeholders**: Ready-to-use chart containers
- ✅ **Mobile Optimized**: Single-column layouts on small screens

### Example Usage in Any Component
```typescript
// In products-dashboard.component.html
<div class="dashboard-container">
  <h1 class="dashboard-title">Products Dashboard</h1>
  <div class="stats-grid">
    <!-- Your product-specific stats -->
  </div>
  <!-- Rest of dashboard structure... -->
</div>
```

This approach ensures all dashboards in your application have:
- ✅ **Consistent Layouts** and spacing
- ✅ **Material 3 Compliance** with proper typography and colors
- ✅ **Mobile Responsiveness** built-in
- ✅ **Easy Maintenance** through centralized theme styling

## 🏗️ App Layout Components

The theme includes comprehensive app-level layout components for consistent application structure:

### Main Layout Classes
```html
<!-- Complete app layout structure -->
<mat-sidenav-container class="sidenav-container">
  <mat-sidenav class="sidenav">
    <!-- Sidebar content -->
  </mat-sidenav>
  
  <mat-sidenav-content>
    <!-- Header -->
    <mat-toolbar class="header-toolbar">
      <span class="app-title">Your App</span>
      <span class="spacer"></span>
      <div class="header-actions">
        <button mat-icon-button class="has-notifications">
          <mat-icon>notifications</mat-icon>
          <span class="notification-badge">5</span>
        </button>
      </div>
    </mat-toolbar>
    
    <!-- Horizontal Menu Bar -->
    <div class="horizontal-menu-bar">
      <nav class="menu-nav">
        <div class="menu-item-container">
          <button mat-button class="menu-item dropdown">
            <mat-icon>dashboard</mat-icon>
            Dashboard
            <mat-icon class="dropdown-arrow">expand_more</mat-icon>
          </button>
        </div>
      </nav>
    </div>
    
    <!-- Main Content Area -->
    <div class="main-content">
      <router-outlet></router-outlet>
    </div>
    
    <!-- Footer -->
    <mat-toolbar class="footer-toolbar">
      <div class="footer-content">
        <div class="footer-left">© 2025 Your App</div>
        <div class="footer-right">
          <button mat-icon-button>
            <mat-icon>help</mat-icon>
          </button>
        </div>
      </div>
    </mat-toolbar>
  </mat-sidenav-content>
</mat-sidenav-container>
```

### Available Layout Classes
- **`.sidenav-container`** - Main layout container
- **`.sidenav`** - Sidebar navigation styling
- **`.header-toolbar`** - Top header with primary color background
- **`.horizontal-menu-bar`** - Secondary navigation bar below header
- **`.footer-toolbar`** - Bottom footer with secondary background
- **`.main-content`** - Content area with proper scrolling

### Navigation Components
- **`.menu-nav`** - Navigation items container
- **`.menu-item`** - Individual menu button styling
- **`.dropdown`** - Dropdown menu items with arrows
- **`.custom-menu`** - Dropdown menu panel styling

### Header Components
- **`.app-title`** - Application title styling
- **`.header-actions`** - Action buttons container
- **`.notification-badge`** - Notification counter badge (enhanced z-index)
- **`.has-notifications`** - Special styling for notification icons

### Enhanced Features
- ✅ **Improved Font Sizes**: Horizontal menu text increased from small to medium
- ✅ **Better Icon Sizing**: Menu icons increased from 18px to 20px for visibility
- ✅ **Fixed Notification Badge**: Proper z-index and positioning behind bell icon
- ✅ **Enhanced Contrast**: Better text colors and hover states
- ✅ **Material 3 Typography**: Uses theme font variables throughout
- ✅ **Responsive Design**: Mobile-optimized layouts

## 🔧 CSS Custom Properties

The theme uses CSS custom properties (CSS variables) for runtime theme switching:

```css
:root {
  --primary-color: #3f51b5;
  --spacing-md: 8px;
  --font-size-lg: 14px;
}
```

## 🎛️ Theme Variants

### Compact Theme
```html
<div class="theme-compact">
  <!-- Tighter spacing and smaller fonts -->
</div>
```

### Comfortable Theme
```html
<div class="theme-comfortable">
  <!-- More generous spacing -->
</div>
```

### Dark Theme (Future)
```html
<div data-theme="dark">
  <!-- Dark color scheme -->
</div>
```

## 🧩 Available Mixins

### Form Mixins
- `@include form-field-compact()` - Compact form fields
- `@include form-grid($min-width, $gap)` - Responsive grid
- `@include form-section($padding)` - Section styling

### Layout Mixins
- `@include two-column-layout($gap, $breakpoint)` - Two-column responsive layout
- `@include responsive-container($max-width)` - Responsive container
- `@include flex-center()` - Centered flex layout
- `@include flex-between()` - Space-between flex layout

### Card Mixins
- `@include card-base($padding)` - Basic card styling
- `@include card-header($gradient)` - Card header with gradient
- `@include card-actions($gap)` - Card action buttons

### Control Mixins
- `@include checkbox-group-compact($gap)` - Compact checkbox groups
- `@include radio-group-compact($gap)` - Compact radio groups
- `@include toggle-group-compact()` - Compact toggle switches
- `@include terms-section-compact($padding)` - Terms section styling

### Button Mixins
- `@include button-compact($height)` - Compact buttons
- `@include button-primary()` - Primary button styling
- `@include button-secondary()` - Secondary button styling

## 📱 Responsive Design

The theme includes comprehensive responsive breakpoints:
- Desktop: > 1024px (Two-column layouts)
- Tablet: 768px - 1024px (Single column)
- Mobile: < 768px (Compact spacing)
- Small Mobile: < 480px (Minimal spacing)

## 🎯 Benefits

1. **Consistency** - Unified design tokens across the application
2. **Maintainability** - Centralized styling logic
3. **Reusability** - Mixins can be used across components
4. **Flexibility** - Easy theme switching and customization
5. **Performance** - CSS custom properties for efficient updates
6. **Scalability** - Easy to add new components and themes

## 🔄 Adding New Components

1. Create a new file in `components/` folder: `_my-component.scss`
2. Import required variables and mixins
3. Define component-specific styles using the theme system
4. Import in `_index.scss`
5. Use in component SCSS: `@import '../../../themes/components/my-component';`

## 🎨 Customizing Themes

To customize colors, spacing, or typography:
1. Modify variables in the `variables/` folder
2. The changes will propagate through CSS custom properties
3. Components using the theme will automatically update

This architecture provides a robust foundation for maintaining consistent, scalable, and flexible styling across the entire application.
