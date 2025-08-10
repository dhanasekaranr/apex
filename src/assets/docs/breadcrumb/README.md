# Breadcrumb Component

A flexible, responsive breadcrumb navigation component with multiple style variants and automatic route-based generation.

## Features

- ✅ **Multiple Style Variants** - 6 different visual styles
- ✅ **Responsive Design** - Mobile-optimized with truncation
- ✅ **Accessibility** - Full ARIA support and keyboard navigation
- ✅ **Route Integration** - Automatic breadcrumb generation
- ✅ **Customizable** - Icons, separators, and styling options

## Quick Usage

```html
<app-breadcrumb 
  [breadcrumbs]="currentBreadcrumbs"
  style="pill">
</app-breadcrumb>
```

```typescript
export class MyComponent {
  currentBreadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Users', url: '/users' },
    { label: 'Profile' } // Current page (no URL)
  ];
}
```

## Style Variants

| Style | Description | Use Case |
|-------|-------------|----------|
| `minimal` | Clean, simple design | Default, minimal interfaces |
| `pill` | Rounded button-style | Modern, friendly UI |
| `card` | Card-based design | Structured layouts |
| `underline` | Underlined text | Traditional, text-heavy |
| `subtle` | Low-contrast | Secondary navigation |
| `ultra-dark` | High-contrast dark | Dark themes, accessibility |

## Interface

```typescript
interface BreadcrumbItem {
  label: string;
  url?: string;
  icon?: string;
  disabled?: boolean;
}
```

## Styling

All styles are globally available through the theme system. To switch styles:

```html
<app-breadcrumb style="card">
```

The component automatically applies the appropriate CSS classes based on the style attribute.

## Global Integration

The breadcrumb component is integrated into the main app layout and uses consistent styling with the rest of the application through the global theme system.

For detailed styling documentation, see `/docs/STYLING_SYSTEM.md`.

## Style Variants

### 1. Default
- Clean Material Design 3 styling
- Standard font family (Roboto)
- Balanced spacing and colors
- Hover effects with subtle elevation

### 2. Minimal
- Clean and subtle appearance
- Uppercase text with letter spacing
- Minimal backgrounds and borders
- Perfect for content-focused layouts

### 3. Pill
- Rounded pill-shaped buttons
- Modern gradient effects
- Scale animations on hover
- Great for modern, playful interfaces

### 4. Card
- Each breadcrumb as a small card
- Box shadows and elevation
- Hover animations with depth
- Suitable for dashboard layouts

### 5. Underline
- Text-based with animated underlines
- No backgrounds or borders
- Smooth underline animations
- Ideal for minimalist designs

### 6. Elegant
- Sophisticated serif typography (Georgia)
- Glass-morphism effects with backdrop blur
- Refined color gradients
- Perfect for premium or content-rich applications

### 7. Compact
- Space-efficient design
- Condensed font family (Roboto Condensed)
- Smaller sizing and spacing
- Great for dense information layouts

### 8. Bold
- Strong, high-contrast typography
- Large, bold fonts with text shadows
- Dramatic hover effects
- Ideal for applications requiring high visibility

## Font Families Used

- **Default/Minimal/Pill/Card/Underline**: `Roboto` (Material Design standard)
- **Elegant**: `Georgia, Times New Roman` (Serif for sophistication)
- **Compact**: `Roboto Condensed, Arial Narrow` (Space-efficient)
- **Bold**: `Roboto` (With enhanced typography treatments)

The component automatically detects the current route and builds appropriate breadcrumbs.

### Route Configuration

To get better breadcrumb labels, configure your routes with data:

```typescript
export const routes: Routes = [
  { 
    path: 'dashboard', 
    component: Dashboard,
    data: { breadcrumb: 'Dashboard', icon: 'dashboard' }
  },
  { 
    path: 'users', 
    component: Users,
    data: { breadcrumb: 'Users', icon: 'people' }
  },
  // ... other routes
];
```

## Component Structure

### Properties

- `breadcrumbs: BreadcrumbItem[]` - Array of breadcrumb items
- `breadcrumbStyle: BreadcrumbStyle` - Style variant ('default' | 'minimal' | 'pill' | 'card' | 'underline' | 'elegant' | 'compact' | 'bold')
- `routeLabels` - Static mapping of route segments to labels and icons

### BreadcrumbItem Interface

```typescript
interface BreadcrumbItem {
  label: string;    // Display text for the breadcrumb
  url: string;      // Navigation URL
  icon?: string;    // Optional Material icon name
}
```

### Methods

- `buildBreadcrumbs()` - Builds breadcrumb array from current route
- `navigateTo(url: string)` - Navigates to specified URL
- `isCurrentRoute(url: string)` - Checks if URL is the current route
- `formatSegment(segment: string)` - Converts kebab-case to Title Case

## Styling

The component uses the global Material Design 3 theme defined in `/themes/material/_material3-overrides.scss`. All breadcrumb styles are centralized there for better reusability and maintenance.

### Global Styles Location
- **Main styles**: `/themes/material/_material3-overrides.scss` (search for "BREADCRUMB NAVIGATION COMPONENT")
- **Component file**: Contains only component-specific overrides (if needed)

### Design Features
- Responsive behavior (mobile-first design)
- Hover and focus states with proper accessibility
- Consistent color contrast using CSS custom properties
- Material Design 3 typography and spacing variables

### CSS Classes

- `.breadcrumb-container` - Main container
- `.breadcrumb-list` - Flex container for breadcrumb items
- `.breadcrumb-item` - Individual breadcrumb wrapper
- `.breadcrumb-link` - Clickable breadcrumb button
- `.breadcrumb-current` - Current page indicator
- `.breadcrumb-icon` - Icon styling
- `.breadcrumb-separator` - Separator between items

## Responsive Behavior

- **Desktop**: Shows full breadcrumb trail with labels and icons
- **Tablet**: Shows abbreviated breadcrumbs with selective label hiding
- **Mobile**: Shows only icons and current page label

## Accessibility

- Uses semantic `<nav>` element with `aria-label`
- Proper `<ol>` list structure
- `aria-current="page"` for current page
- Descriptive `aria-label` attributes for navigation buttons
- Keyboard navigation support

## Examples

### Dashboard Page
```
Dashboard
```

### Users Page
```
Dashboard > Users
```

### Settings Page
```
Dashboard > Settings > General
```

### Lookup Management
```
Dashboard > Lookup Management
```

## Integration

The breadcrumb component is automatically included in the main app layout and appears on all pages. It's positioned between the top navigation and the main content area.

## Customization

### Adding New Route Labels

Update the `routeLabels` object in the component:

```typescript
private routeLabels: { [key: string]: { label: string; icon?: string } } = {
  'my-new-route': { label: 'My New Page', icon: 'new_releases' },
  // ... existing labels
};
```

### Styling Customization

Override the component styles in your global theme or component-specific SCSS:

```scss
.breadcrumb-container {
  // Custom styling
}
```

## Future Enhancements

- Dynamic route data loading
- Custom breadcrumb configuration per route
- Animation transitions
- More complex hierarchical routing support
