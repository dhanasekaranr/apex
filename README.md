# Apex Dashboard

A modern, responsive dashboard application built with Angular 20 and Material Design 3. Features a complete layout with header, sidebar navigation, footer, and dashboard components with a comprehensive theming system.

## Features

- ✨ **Angular 20** with zoneless change detection
- 🎨 **Material Design 3** components and theming
- 📱 **Responsive Design** with mobile-first approach
- 🧭 **Dynamic Navigation** with collapsible sidebar and data-driven menus
- 📊 **Dashboard** with stats cards, charts, and activity feed
- 🎯 **Modern Architecture** using standalone components
- 🚀 **TypeScript** with strict type checking
- 💅 **SCSS** theming system with Material 3 compliance
- 🔧 **Production-Ready** styling system for rapid development

## Quick Start

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation & Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200/`

## Architecture Overview

### Component Structure
- **App Component**: Main layout with Material sidenav container
- **Header Component**: Responsive toolbar with user profile and action buttons
- **Sidenav Component**: Navigation menu with expandable sections
- **Top Navigation**: Dynamic data-driven horizontal menu system
- **Dashboard Component**: Main content area with statistics and activities
- **Footer Component**: Bottom toolbar with links and copyright

### Key Technologies
- Angular 20 with standalone components
- Material Design 3 (Angular Material 20)
- Angular CDK for responsive layouts
- RxJS for reactive programming
- SCSS with comprehensive theming system

## 🎨 Styling System

### **PRODUCTION-READY** Theming Architecture

The dashboard includes a comprehensive styling system optimized for:
- ✅ **Material 3 Compliance** - Modern design tokens and components
- ✅ **Responsive Design** - Mobile-first with adaptive layouts
- ✅ **Reusability** - Generic class names and mixins for rapid development
- ✅ **Maintainability** - Organized SCSS structure with no duplication

#### File Structure
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
│   └── _material3-overrides.scss # Material component customizations
├── utilities/
│   └── _utilities.scss           # Utility classes
└── variants/
    └── _theme-variants.scss      # Theme density variants
```

#### Quick Usage Examples

**Building a Form Component:**
```scss
@import 'themes/index';

.my-form {
  @include form-grid(200px, 16px);
  
  .form-section {
    @include form-section();
  }
}
```

**Building a Data Table:**
```scss
@import 'themes/index';

.my-table {
  @include data-table-base();
  @include data-table-responsive();
  @include data-table-with-actions();
}
```

**Using Global Layout Patterns:**
```html
<div class="page-container">
  <div class="two-panel-container">
    <div class="left-panel"><!-- Content --></div>
    <div class="right-panel"><!-- Content --></div>
  </div>
</div>
```

### Features Available
- **120+ CSS Custom Properties** for consistent theming
- **100+ Utility Classes** for rapid styling
- **Comprehensive Mixin Library** for common patterns
- **Responsive Breakpoints** (480px, 768px, 1024px+)
- **Multiple Theme Variants** (compact, standard, comfortable)

## 🧭 Navigation System

### Dynamic Menu Configuration
The application uses a data-driven menu system that can be easily configured:

```typescript
// Menu sections are configured in MenuService
{
  id: 'resources',
  label: 'Resources', 
  order: 2,
  items: [
    {
      id: 'resources-main',
      label: 'Resources',
      icon: 'people',
      children: [
        // Nested menu items...
      ]
    }
  ]
}
```

### Breadcrumb System
Global breadcrumb component with multiple style variants:
- Minimal, Pill, Card, Underline, Subtle, Ultra-dark styles
- Automatic route-based breadcrumb generation
- Responsive design with mobile adaptations

## 🚀 Development

### Adding New Components

1. **Use Global Patterns:**
   ```html
   <div class="page-container">
     <div class="content-card">
       <!-- Your content -->
     </div>
   </div>
   ```

2. **Import Theme System:**
   ```scss
   @import 'themes/index';
   
   .my-component {
     @include your-chosen-mixin();
   }
   ```

3. **Follow Naming Conventions:**
   - Use generic class names (`.page-container`, `.content-card`, `.data-form`)
   - Avoid component-specific names that can't be reused

### Building for Production

```bash
ng build --configuration production
```

### Running Tests

```bash
# Unit tests
ng test

# End-to-end tests  
ng e2e
```

## 📚 Documentation

For detailed styling system usage, see:
- `src/themes/STYLING_GUIDE.md` - Comprehensive styling guide
- `docs/` folder for additional documentation

## 🛠️ Development Tools

### Code Scaffolding
```bash
# Generate new component
ng generate component component-name

# Generate new service
ng generate service service-name

# See all available schematics
ng generate --help
```

### Useful Commands
```bash
# Development server
ng serve

# Build for production
ng build

# Run tests
ng test

# Lint code
ng lint
```

## 📝 Recent Updates

- ✅ Refactored to Material Design 3 compliance
- ✅ Created comprehensive theming system
- ✅ Implemented dynamic navigation with data-driven menus
- ✅ Added global breadcrumb component with multiple styles
- ✅ Optimized for responsive design and accessibility
- ✅ Consolidated styling patterns for rapid development

## 🤝 Contributing

1. Follow the established naming conventions
2. Use the global styling system for consistency
3. Test responsiveness on multiple screen sizes
4. Ensure accessibility compliance
5. Document any new patterns or components

## 📄 License

This project is licensed under the MIT License.

---

For detailed technical documentation, see the `assets/docs` folder and theme-specific guides in `assets/docs/themes/`.
