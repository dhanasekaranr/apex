# Styling System Documentation

## Overview

The Apex Dashboard includes a production-ready styling system that is **Material 3 compliant**, **fully responsive**, and **highly reusable**. This system has been optimized for rapid component development while maintaining consistency and maintainability.

## System Status: ✅ PRODUCTION READY

The styling system is ready for building new components and has been comprehensively tested and optimized.

## Architecture

### File Structure
```
src/themes/
├── _index.scss                    # Main theme entry point
├── variables/                     # Design tokens
│   ├── _colors.scss              # Color palette & semantic colors
│   ├── _spacing.scss             # Spacing scale & grid system
│   ├── _typography.scss          # Typography scale & font system
│   └── _dimensions.scss          # Border radius, shadows, dimensions
├── mixins/                        # Reusable patterns
│   ├── _forms.scss               # Form field & input patterns
│   ├── _cards.scss               # Card component patterns
│   ├── _layout.scss              # Layout & button patterns
│   ├── _controls.scss            # Control component patterns
│   ├── _tables.scss              # Data table patterns
│   └── _tabs.scss                # Tab component patterns
├── material/
│   └── _material3-overrides.scss # All Material component customizations
├── utilities/
│   └── _utilities.scss           # Utility classes (spacing, colors, layout)
├── variants/
│   └── _theme-variants.scss      # Theme density variants
└── STYLING_GUIDE.md              # Comprehensive usage guide
```

## Key Features

### ✅ Material 3 Compliance
- Modern color system with tonal palettes and CSS custom properties
- Enhanced typography scale with proper font weights and line heights
- Improved component designs following Material 3 specifications
- Consistent elevation system with proper shadow definitions
- Balanced proportions for better usability and accessibility

### ✅ Responsive Design System
- Mobile-first approach with proper breakpoints (480px, 768px, 1024px+)
- Responsive utility classes for all screen sizes
- Adaptive component layouts (tables convert to cards, tabs to accordions)
- Flexible grid systems with auto-fit columns
- Touch-friendly sizing for mobile devices

### ✅ Reusability & Maintainability
- Semantic naming conventions for easy component identification
- CSS custom properties for consistent theming and runtime switching
- Modular mixin system for common patterns
- Generic class names that can be shared across components
- No code duplication across component files

## Design Tokens

### CSS Custom Properties (120+ properties)
```scss
// Colors
--primary-color, --text-primary, --background-card

// Spacing  
--spacing-xs through --spacing-xxl

// Typography
--font-size-xs through --font-size-display
--font-weight-light through --font-weight-extrabold

// Dimensions
--border-radius-sm through --border-radius-xl
--shadow-sm through --shadow-2xl
```

### Color System
- **Status colors**: success, warning, error, info with light and dark variants
- **Background colors**: hover, zebra, and semantic background colors
- **Extended palette**: comprehensive color tokens for all use cases

## Component Mixins

### Table Mixins
- `@mixin data-table-base` - Basic responsive table layout
- `@mixin data-table-compact` - Compact table variant
- `@mixin data-table-with-actions` - Tables with action buttons
- `@mixin data-table-responsive` - Mobile-responsive tables
- `@mixin data-table-status` - Tables with status indicators

### Tab Mixins
- `@mixin tab-group-base` - Basic tab group styling
- `@mixin tab-group-compact` - Compact tab variant
- `@mixin tab-group-pills` - Pill-style tabs
- `@mixin tab-group-vertical` - Vertical tab layout
- `@mixin tab-group-with-icons` - Tabs with icons
- `@mixin tab-group-responsive` - Mobile-responsive tabs

### Form Mixins
- `@mixin form-grid()` - Responsive form layouts
- `@mixin form-section()` - Form section styling
- `@mixin form-field-compact()` - Compact form fields

### Layout Mixins
- `@mixin two-panel-layout()` - Split panel layouts
- `@mixin action-bar()` - Action button bars
- `@mixin page-container()` - Standard page layouts

## Usage Examples

### Building a Data Table Component
```scss
@import 'themes/index';

.my-data-table {
  @include data-table-base();
  @include data-table-responsive();
  @include data-table-with-actions();
  @include data-table-status();
}
```

### Building a Tab Interface
```scss
@import 'themes/index';

.my-tab-interface {
  @include tab-group-base();
  @include tab-group-with-icons();
  @include tab-group-responsive();
}
```

### Building a Form Component
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

### Using Global Layout Patterns
```html
<div class="page-container">
  <div class="two-panel-container">
    <!-- Left panel for navigation/selection -->
    <div class="left-panel data-list-panel">
      <mat-card class="content-card">
        <!-- Content -->
      </mat-card>
    </div>
    
    <!-- Right panel for details -->
    <div class="right-panel data-details-panel">
      <mat-card class="content-card">
        <!-- Content -->
      </mat-card>
    </div>
  </div>
</div>
```

## Utility Classes (100+ classes)

### Layout
- `.d-flex`, `.d-grid`, `.d-block`, `.d-none`
- `.justify-center`, `.align-items-center`
- `.flex-column`, `.flex-row`

### Spacing
- `.m-{size}`, `.p-{size}` (xs, sm, md, lg, xl, xxl)
- `.mt-{size}`, `.mb-{size}`, `.ml-{size}`, `.mr-{size}`
- `.pt-{size}`, `.pb-{size}`, `.pl-{size}`, `.pr-{size}`

### Typography
- `.text-{size}` (xs, sm, md, lg, xl, xxl)
- `.text-{weight}` (light, normal, medium, bold)
- `.text-{align}` (left, center, right)

### Colors
- `.text-primary`, `.text-secondary`, `.text-success`
- `.bg-primary`, `.bg-surface`, `.bg-card`

### Responsive Utilities
- `.d-{breakpoint}-{display}` (sm, md, lg)
- `.text-{breakpoint}-{align}`

## Theme Variants

### Density Levels
- **Compact**: `theme-compact` - Dense layouts for power users
- **Standard**: Default - Balanced for general use
- **Comfortable**: `theme-comfortable` - Spacious for accessibility

### Applying Theme Variants
```html
<body class="theme-compact">
  <!-- Compact theme applied -->
</body>
```

## Responsive Features

### Breakpoint System
```scss
// Mobile: max-width: 480px
// Tablet: max-width: 768px  
// Desktop: min-width: 769px
```

### Component Responsiveness
- **Tables**: Automatically convert to card layout on mobile
- **Tabs**: Transform to accordion interface on small screens
- **Forms**: Stack horizontally laid out fields vertically
- **Navigation**: Collapsible sidebar with mobile-optimized interactions

## Best Practices

### Component Development
1. **Always import the theme system**: `@import 'themes/index';`
2. **Use generic class names**: `.page-container`, `.content-card`, `.data-form`
3. **Leverage existing mixins**: Don't recreate common patterns
4. **Follow Mobile-First**: Design for mobile, enhance for desktop
5. **Test responsiveness**: Verify behavior on all breakpoints

### Naming Conventions
- **Generic over specific**: `.data-table` instead of `.users-table`
- **Semantic meaning**: `.content-card` instead of `.blue-card`
- **BEM methodology**: `.component__element--modifier`
- **Consistent prefixes**: `.page-`, `.content-`, `.data-`

### Performance
- **Minimal component SCSS**: Keep component files small
- **Use utility classes**: Leverage existing utilities before custom CSS
- **Avoid !important**: Use proper CSS specificity
- **Optimize imports**: Only import what you need

## Migration Guide

### From Legacy Styles
1. **Replace hardcoded values** with CSS custom properties
2. **Use generic class names** instead of component-specific ones
3. **Import theme system** in component SCSS files
4. **Apply utility classes** for common styling needs

### Example Migration
```scss
// Before ❌
.users-container {
  padding: 24px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

// After ✅
.page-container {
  padding: var(--spacing-lg);
  background: var(--background-card);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
}
```

## Future Enhancements

### Planned Features
- **Dark mode support**: Using CSS custom properties
- **High contrast themes**: For accessibility compliance
- **Custom brand themes**: Easy color system customization
- **Animation system**: Consistent transitions and animations

### Extensibility
The system is designed to be easily extended with:
- New component mixins
- Additional utility classes
- Custom theme variants
- Brand-specific customizations

---

For more detailed usage examples, see `src/themes/STYLING_GUIDE.md`.
