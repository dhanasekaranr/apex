# Material 3 Theme System Documentation

## Overview
Your Angular application now has a complete Material Design 3 implementation that follows Google's latest design system guidelines. This includes proper color tokens, typography scale, elevation system, and component styling.

## File Structure
```
src/themes/
├── material3-theme.scss          # Core Material 3 theme with color palettes
├── material3-typography.scss     # Complete Material 3 typography scale
├── material3-components.scss     # Material 3 component implementations
├── material3-elevation.scss      # Elevation, shadows, and state layers
├── material3-utilities.scss      # Utility classes for quick styling
├── variables/
│   ├── _colors-material3.scss    # Material 3 color tokens
│   └── _typography-material3.scss # Material 3 typography tokens
└── material/
    └── _material3-overrides.scss # Legacy Angular Material overrides
```

## Color System

### Using Material 3 Colors
The theme provides CSS custom properties for all Material 3 color tokens:

```scss
// Primary colors
--md-sys-color-primary
--md-sys-color-on-primary
--md-sys-color-primary-container
--md-sys-color-on-primary-container

// Secondary colors
--md-sys-color-secondary
--md-sys-color-on-secondary
--md-sys-color-secondary-container
--md-sys-color-on-secondary-container

// Surface colors
--md-sys-color-surface
--md-sys-color-on-surface
--md-sys-color-surface-container
--md-sys-color-surface-container-low
--md-sys-color-surface-container-high
--md-sys-color-surface-container-highest
```

### Color Utility Classes
```html
<!-- Background colors -->
<div class="bg-primary">Primary background</div>
<div class="bg-primary-container">Primary container</div>
<div class="bg-surface-container">Surface container</div>

<!-- Text colors -->
<span class="text-primary">Primary text</span>
<span class="text-on-surface-variant">Secondary text</span>
```

## Typography System

### Material 3 Typography Scale
```html
<!-- Display styles for hero sections -->
<h1 class="display-large">Display Large</h1>
<h1 class="display-medium">Display Medium</h1>
<h1 class="display-small">Display Small</h1>

<!-- Headlines for page sections -->
<h2 class="headline-large">Headline Large</h2>
<h3 class="headline-medium">Headline Medium</h3>
<h4 class="headline-small">Headline Small</h4>

<!-- Titles for subsections -->
<h5 class="title-large">Title Large</h5>
<h6 class="title-medium">Title Medium</h6>
<div class="title-small">Title Small</div>

<!-- Body text for content -->
<p class="body-large">Body Large - Main content</p>
<p class="body-medium">Body Medium - Secondary content</p>
<p class="body-small">Body Small - Captions</p>

<!-- Labels for components -->
<button class="label-large">Button Text</button>
<span class="label-medium">Tab Label</span>
<span class="label-small">Small Label</span>
```

## Elevation System

### Using Elevation
```html
<!-- Cards with different elevations -->
<div class="elevation-1">Low elevation card</div>
<div class="elevation-2">Medium elevation card</div>
<div class="elevation-3">High elevation modal</div>
```

### State Layers
```html
<!-- Interactive elements with state layers -->
<button class="state-layer state-layer-primary">Interactive Button</button>
<div class="state-layer state-layer-on-surface">Clickable Card</div>
```

## Shape System

### Shape Utilities
```html
<!-- Different corner radius options -->
<div class="shape-none">No radius</div>
<div class="shape-small">Small radius (8px)</div>
<div class="shape-medium">Medium radius (12px)</div>
<div class="shape-large">Large radius (16px)</div>
<div class="shape-extra-large">Extra large radius (28px)</div>
<div class="shape-full">Fully rounded</div>
```

## Component Styling

### Buttons
All Material buttons now follow Material 3 guidelines:
- Proper typography (Label Large)
- Correct state layers
- Material 3 colors

```html
<button mat-raised-button color="primary">Filled Button</button>
<button mat-outlined-button>Outlined Button</button>
<button mat-button>Text Button</button>
```

### Form Fields
Form fields use Material 3 typography and colors:
```html
<mat-form-field appearance="outline">
  <mat-label>Material 3 Input</mat-label>
  <input matInput>
</mat-form-field>
```

### Cards
Cards automatically use Material 3 elevation and surface colors:
```html
<mat-card>
  <mat-card-title>Material 3 Card</mat-card-title>
  <mat-card-content>Content with proper typography</mat-card-content>
</mat-card>
```

## Motion System

### Animation Utilities
```html
<!-- Standard motion -->
<div class="motion-standard">Standard transition</div>

<!-- Emphasized motion for important changes -->
<div class="motion-emphasized">Emphasized transition</div>

<!-- Duration variants -->
<div class="motion-short">Quick transition</div>
<div class="motion-medium">Medium transition</div>
<div class="motion-long">Slow transition</div>
```

## Dark Theme Support

### Enabling Dark Theme
Add the `dark-theme` class to your root element:
```html
<html class="dark-theme">
```

Or toggle programmatically:
```typescript
document.documentElement.classList.toggle('dark-theme');
```

## Layout Utilities

### Container and Spacing
```html
<!-- Responsive container padding -->
<div class="container-padding">
  <!-- Content with proper Material 3 spacing -->
</div>

<!-- Content spacing -->
<div class="content-spacing">
  <!-- Items with proper gaps -->
</div>
```

### Responsive Utilities
```html
<!-- Hide/show content based on screen size -->
<div class="hide-mobile">Hidden on mobile</div>
<div class="show-desktop">Only shown on desktop</div>
```

## Interactive States

### Focus and Interaction
```html
<!-- Proper focus indicators -->
<button class="focus-indicator">Accessible button</button>

<!-- Interactive behavior -->
<div class="interactive">Clickable element</div>

<!-- Loading state -->
<div class="loading">Loading content...</div>

<!-- Disabled state -->
<div class="disabled">Disabled element</div>
```

## Migration from Old Theme

### Automatic Updates
Most existing components will automatically use the new Material 3 styles. However, you may want to:

1. **Update color references**: Replace custom color variables with Material 3 tokens
2. **Use new typography classes**: Replace old typography with Material 3 scale
3. **Apply elevation utilities**: Use the new elevation system for cards and modals
4. **Add state layers**: Enhance interactive elements with proper state feedback

### Example Migration
**Before:**
```html
<div class="custom-card" style="background: #f5f5f5; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
  <h3 style="font-size: 18px; font-weight: 500;">Card Title</h3>
  <p style="font-size: 14px; color: #666;">Card content</p>
</div>
```

**After:**
```html
<div class="bg-surface-container elevation-2 shape-medium container-padding">
  <h3 class="title-large">Card Title</h3>
  <p class="body-medium text-on-surface-variant">Card content</p>
</div>
```

## Best Practices

1. **Use semantic color tokens**: Always use `--md-sys-color-*` instead of hardcoded colors
2. **Follow typography hierarchy**: Use the proper typography scale for content hierarchy
3. **Apply consistent elevation**: Use elevation consistently across similar components
4. **Implement proper state layers**: Add interactive feedback to clickable elements
5. **Test dark theme**: Ensure your components work in both light and dark themes
6. **Use utility classes**: Leverage the utility classes for common styling needs

## CSS Custom Properties Reference

All Material 3 tokens are available as CSS custom properties. You can use them in your custom CSS:

```css
.custom-component {
  background-color: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);
  border-radius: var(--md-sys-shape-corner-medium);
  box-shadow: var(--md-sys-elevation-level2);
  font-family: var(--md-sys-typescale-body-large-font);
  font-size: var(--md-sys-typescale-body-large-size);
}
```

This implementation provides a complete, production-ready Material 3 theme system that follows Google's latest design guidelines while maintaining compatibility with your existing Angular Material components.
