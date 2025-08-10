# Navigation System Documentation

## Overview

The Apex Dashboard features a sophisticated, data-driven navigation system that includes both sidebar navigation and dynamic top navigation with multi-level dropdowns.

## Architecture

### Components
- **Sidenav Component**: Left sidebar with expandable sections
- **Top Navigation**: Horizontal menu bar with dropdown menus
- **Breadcrumb Component**: Route-based breadcrumb navigation
- **Menu Service**: Centralized menu configuration and state management

## Sidenav Navigation

### Features
- Expandable/collapsible sections
- Icon-based navigation items
- Disabled states with tooltips
- Nested menu support
- Responsive design

### Configuration
```typescript
// In sidenav.ts
navItems: NavItem[] = [
  {
    name: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard',
    type: 'item'
  },
  {
    name: 'Access Management',
    icon: 'security',
    type: 'expandable',
    expanded: false,
    children: [
      {
        name: 'User Access',
        icon: 'person',
        route: '/access/users',
        type: 'item'
      }
      // More items...
    ]
  }
];
```

### NavItem Interface
```typescript
interface NavItem {
  name: string;
  icon: string;
  route?: string;
  disabled?: boolean;
  disabledReason?: string;
  children?: NavItem[];
  expanded?: boolean;
  type?: 'item' | 'expandable' | 'divider';
}
```

## Top Navigation System

### Features
- Data-driven menu configuration
- Multi-level dropdown menus
- Dynamic menu sections
- Action buttons with badges
- Search functionality

### Menu Service Configuration

#### Menu Structure
```typescript
interface TopNavConfig {
  menuSections: MenuSection[];
  actionButtons: ActionButton[];
}

interface MenuSection {
  id: string;
  label: string;
  order: number;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  routerLink?: string;
  action?: string;
  children?: MenuItem[];
  badge?: BadgeConfig;
  dividerAfter?: boolean;
}
```

#### Example Configuration
```typescript
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
        {
          id: 'all-resources',
          label: 'All Resources',
          icon: 'list',
          routerLink: '/users',
          action: 'navigate'
        },
        {
          id: 'resource-management',
          label: 'Resource Management',
          icon: 'manage_accounts',
          children: [
            {
              id: 'create-resource',
              label: 'Create Resource',
              icon: 'person_add',
              action: 'createUser'
            }
            // More nested items...
          ]
        }
      ]
    }
  ]
}
```

### Current Menu Sections

1. **Health Check** - System monitoring and status
2. **Resources** - User and resource management
3. **Messaging** - Communication and message handling
4. **Documents** - Reports and document management
5. **Settings** - System and user preferences
6. **Audit Log** - Activity logging and tracking

### Action Buttons
```typescript
actionButtons: [
  {
    id: 'search',
    icon: 'search',
    tooltip: 'Search',
    action: 'performSearch',
    order: 1
  },
  {
    id: 'export',
    icon: 'download',
    tooltip: 'Export Data',
    action: 'exportData',
    order: 2
  }
  // More buttons...
]
```

## Breadcrumb System

### Features
- Automatic route-based breadcrumb generation
- Multiple visual styles
- Responsive design
- Customizable separators

### Style Variants
- **Minimal**: Clean, simple design
- **Pill**: Rounded button-style breadcrumbs
- **Card**: Card-based breadcrumb design
- **Underline**: Underlined text style
- **Subtle**: Low-contrast design
- **Ultra-dark**: High-contrast dark theme

### Usage
```html
<app-breadcrumb 
  [breadcrumbs]="currentBreadcrumbs"
  style="pill">
</app-breadcrumb>
```

### Configuration
```typescript
interface BreadcrumbItem {
  label: string;
  url?: string;
  icon?: string;
  disabled?: boolean;
}
```

## Menu Service API

### Methods
```typescript
class MenuService {
  // Get current configuration
  getTopNavConfig(): TopNavConfig
  
  // Update entire configuration
  updateTopNavConfig(config: TopNavConfig): void
  
  // Add new menu section
  addMenuSection(section: MenuSection): void
  
  // Remove menu section
  removeMenuSection(sectionId: string): void
  
  // Update specific section
  updateMenuSection(sectionId: string, section: Partial<MenuSection>): void
  
  // Active tab management
  setActiveMenuTab(tabId: string): void
  getActiveMenuTab(): string
}
```

### Observable Streams
```typescript
// Subscribe to configuration changes
menuService.topNavConfig$.subscribe(config => {
  // Handle configuration updates
});

// Subscribe to active tab changes
menuService.activeMenuTab$.subscribe(activeTab => {
  // Handle active tab changes
});
```

## Responsive Design

### Mobile Adaptations
- Collapsible sidebar navigation
- Simplified top navigation on small screens
- Touch-friendly interaction targets
- Accessible navigation controls

### Breakpoints
- **Mobile**: < 768px - Collapsed sidebar, simplified navigation
- **Tablet**: 768px - 1024px - Condensed navigation
- **Desktop**: > 1024px - Full navigation display

## Styling

### CSS Classes
```scss
// Sidenav classes
.sidenav-container
.sidenav-header
.nav-item
.nav-item-content
.submenu
.nav-footer

// Top navigation classes
.horizontal-menu-bar
.menu-nav
.menu-item
.menu-item.dropdown
.custom-menu
.custom-submenu
.action-buttons

// Breadcrumb classes
.breadcrumb-container
.breadcrumb-item
.breadcrumb-separator
.breadcrumb-{style}
```

### Customization
```scss
// Override navigation styles
.nav-item {
  --nav-item-height: 48px;
  --nav-item-padding: var(--spacing-md);
  --nav-item-hover-bg: var(--background-hover);
}

.menu-item {
  --menu-item-min-width: 160px;
  --menu-item-padding: var(--spacing-sm) var(--spacing-md);
}
```

## Accessibility

### Features
- Keyboard navigation support
- ARIA labels and roles
- Focus management
- Screen reader compatibility
- High contrast support

### Implementation
```html
<button 
  mat-button
  [attr.aria-expanded]="isExpanded"
  [attr.aria-label]="item.name"
  role="menuitem">
  {{ item.name }}
</button>
```

## Best Practices

### Menu Configuration
1. **Use semantic IDs**: Clear, descriptive identifiers
2. **Logical grouping**: Group related functionality
3. **Consistent icons**: Use Material Design icons
4. **Meaningful labels**: User-friendly text
5. **Proper ordering**: Logical menu sequence

### Performance
1. **Lazy loading**: Load menu data when needed
2. **Caching**: Cache menu configuration
3. **Minimal DOM**: Avoid deep nesting when possible
4. **Efficient updates**: Use reactive patterns

### UX Guidelines
1. **Clear hierarchy**: Obvious menu structure
2. **Consistent behavior**: Predictable interactions
3. **Visual feedback**: Hover and active states
4. **Error handling**: Graceful failure states

## Development Examples

### Adding a New Menu Section
```typescript
const newSection: MenuSection = {
  id: 'analytics',
  label: 'Analytics',
  order: 7,
  items: [
    {
      id: 'analytics-main',
      label: 'Analytics',
      icon: 'analytics',
      children: [
        {
          id: 'dashboard-analytics',
          label: 'Dashboard Analytics',
          icon: 'dashboard',
          routerLink: '/analytics/dashboard',
          action: 'navigate'
        }
      ]
    }
  ]
};

this.menuService.addMenuSection(newSection);
```

### Handling Menu Actions
```typescript
onMenuItemClicked(item: MenuItem): void {
  switch (item.action) {
    case 'navigate':
      if (item.routerLink) {
        this.router.navigate([item.routerLink]);
      }
      break;
    case 'createUser':
      this.openCreateUserDialog();
      break;
    case 'exportData':
      this.exportService.exportData();
      break;
    default:
      console.log('Action not implemented:', item.action);
  }
}
```

### Dynamic Menu Updates
```typescript
// Update menu based on user permissions
updateMenuForUser(userRole: string): void {
  const config = this.menuService.getTopNavConfig();
  
  if (userRole !== 'admin') {
    // Remove admin-only sections
    config.menuSections = config.menuSections.filter(
      section => section.id !== 'system-settings'
    );
  }
  
  this.menuService.updateTopNavConfig(config);
}
```

## Troubleshooting

### Common Issues

1. **Menu not expanding**: Check menu configuration IDs match template references
2. **Icons not showing**: Verify Material Icons are properly imported
3. **Routing issues**: Ensure router links are correct and routes exist
4. **Style conflicts**: Check CSS specificity and import order

### Debug Tips

1. **Use browser dev tools**: Inspect menu structure and styles
2. **Console logging**: Log menu configurations and actions
3. **Network tab**: Check for failed icon or resource loads
4. **Accessibility inspector**: Verify ARIA attributes

---

For implementation details, see the respective component files in `src/app/components/` and `src/app/shared/`.
