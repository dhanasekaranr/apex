# Styling System Guide

## Overview

The Apex Dashboard uses a custom Material Design 3 theming system with Bank of America brand colors, built on SCSS with modular structure and reusable mixins.

## Theme Structure

```
src/themes/
├── _index.scss                    # Main theme entry
├── material3-components.scss      # Material 3 components
├── material3-typography.scss      # Typography system
├── material3-elevation.scss       # Elevation/shadows
├── variables/
│   ├── _colors.scss              # Color palette
│   ├── _typography.scss          # Font definitions
│   ├── _spacing.scss             # Spacing scale
│   └── _dimensions.scss          # Layout dimensions
├── mixins/
│   ├── _cards.scss               # Card patterns
│   ├── _forms.scss               # Form elements
│   ├── _tables.scss              # Table styles
│   └── _layout.scss              # Layout utilities
└── utilities/
    └── _utilities.scss           # Helper classes
```

## Color System

### Primary Colors (Bank of America)
```scss
$primary-blue: #012169;
$primary-red: #E31837;
$accent-blue: #0057B8;
```

### Using Colors
```scss
// In component styles
.custom-element {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}
```

## Typography

Material 3 typography scale with custom font stack:
```scss
$font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
```

Typography classes available:
- `.mat-headline-large` - Page titles
- `.mat-headline-medium` - Section titles
- `.mat-body-large` - Body text
- `.mat-label-large` - Button labels

## Component Styling

### Component-Specific Styles
Keep styles scoped to components:
```scss
// In component.scss
:host {
  display: block;
  padding: 16px;
}
```

### Using Mixins
```scss
@use '@themes/mixins/cards' as cards;

.custom-card {
  @include cards.elevation-2;
  @include cards.rounded-corners;
}
```

## Spacing System

Consistent spacing scale:
- `4px` - Extra small
- `8px` - Small
- `16px` - Medium (base)
- `24px` - Large
- `32px` - Extra large

Use spacing variables:
```scss
@use '@themes/variables/spacing';

.container {
  padding: spacing.$md;
  margin-bottom: spacing.$lg;
}
```

## Best Practices

1. **Use CSS Variables**: Prefer Material 3 design tokens over hardcoded values
2. **Component Scoping**: Keep styles in component files when possible
3. **Theme Mixins**: Leverage existing mixins for consistency
4. **Responsive**: Use breakpoint mixins for responsive designs
5. **Accessibility**: Ensure proper contrast ratios (4.5:1 minimum)

## Customization

To customize the theme, modify variables in `src/themes/variables/` and the theme will rebuild automatically during development.
