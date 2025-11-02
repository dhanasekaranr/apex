# Navigation System Guide# Navigation System# Navigation System Documentation



## Overview



The Apex Dashboard uses a dynamic, data-driven navigation system powered by NgRx Signal Store. Navigation items are configured via JSON and support multi-level nesting, icons, and breadcrumb trails.## Overview## Overview



## Architecture



### Core ComponentsThe application uses a dynamic navigation system with signal-based state management.The Apex Dashboard features a sophisticated, data-driven navigation system that includes both sidebar navigation and dynamic top navigation with multi-level dropdowns.

- **TopNav**: Horizontal navigation bar (data-driven from API)

- **Sidenav**: Vertical navigation menu (template-based)

- **Breadcrumbs**: Dynamic breadcrumb trail based on active route

## Components## Architecture

### Navigation Store

Located in `src/app/store/navigation/`, the navigation store:

- Loads navigation items from API

- Tracks active navigation item### 1. Sidenav (Vertical Navigation)### Components

- Manages navigation state reactively

Collapsible sidebar with menu items:- **Sidenav Component**: Left sidebar with expandable sections

## Configuration

- Collapses to icon-only mode (260px → 72px)- **Top Navigation**: Horizontal menu bar with dropdown menus

### Adding Navigation Items

- Supports nested menu items- **Breadcrumb Component**: Route-based breadcrumb navigation

Navigation items are defined in `api/data/navigation.json`:

- Keyboard accessible- **Menu Service**: Centralized menu configuration and state management

```json

{

  "navigation": [

    {### 2. Topnav (Horizontal Navigation)  ## Sidenav Navigation

      "id": "dashboard",

      "label": "Dashboard",Top menu bar with:

      "route": "/dashboard",

      "icon": "dashboard",- Search box (left side)### Features

      "children": []

    },- Dynamic menu items (center)- Expandable/collapsible sections

    {

      "id": "users",- Action buttons (right side)- Icon-based navigation items

      "label": "Users",

      "route": "/users",- Disabled states with tooltips

      "icon": "people"

    }### 3. Breadcrumbs- Nested menu support

  ]

}Auto-generated navigation trail:- Responsive design

```

- Shows current location

### Navigation Item Properties

- `id` - Unique identifier- Clickable path navigation### Configuration

- `label` - Display text

- `route` - Angular route path- Always starts with Dashboard```typescript

- `icon` - Material icon name

- `children` - Optional nested navigation items// In sidenav.ts



## Usage## ConfigurationnavItems: NavItem[] = [



### Top Navigation  {

The top navigation bar automatically loads items from the navigation store:

```typescript### Menu Data Structure    name: 'Dashboard',

// In topnav.component.ts

navigationItems = this.navigationStore.navItems;```json    icon: 'dashboard',

```

{    route: '/dashboard',

### Side Navigation

Template-based menu in sidenav component:  "menuSections": [    type: 'item'

```html

<mat-nav-list>    {  },

  <a mat-list-item routerLink="/dashboard">

    <mat-icon>dashboard</mat-icon>      "id": "main",  {

    Dashboard

  </a>      "items": [    name: 'Access Management',

</mat-nav-list>

```        {    icon: 'security',



### Breadcrumbs          "id": "dashboard",    type: 'expandable',

Automatically generated based on route configuration with `data.breadcrumb`:

```typescript          "label": "Dashboard",    expanded: false,

{

  path: 'users',          "icon": "dashboard",    children: [

  component: UsersComponent,

  data: { breadcrumb: 'Users' }          "routerLink": "/dashboard"      {

}

```        }        name: 'User Access',



## Accessibility      ]        icon: 'person',



All navigation components include:    }        route: '/access/users',

- Proper ARIA labels

- Keyboard navigation support  ]        type: 'item'

- Screen reader announcements

- Focus management}      }


```      // More items...

    ]

### Breadcrumb Mapping  }

```json];

{```

  "/dashboard": {

    "label": "Dashboard",### NavItem Interface

    "icon": "dashboard"```typescript

  },interface NavItem {

  "/users": {  name: string;

    "label": "Users",  icon: string;

    "icon": "people"  route?: string;

  }  disabled?: boolean;

}  disabledReason?: string;

```  children?: NavItem[];

  expanded?: boolean;

## Navigation Store  type?: 'item' | 'expandable' | 'divider';

}

Centralized state management for all navigation:```



```typescript## Top Navigation System

// Access in components

private navigationStore = inject(NavigationStore);### Features

- Data-driven menu configuration

// Get menu items- Multi-level dropdown menus

menuItems = this.navigationStore.menuItems;- Dynamic menu sections

- Action buttons with badges

// Get breadcrumbs- Search functionality

breadcrumbs = this.navigationStore.breadcrumbs;

```### Menu Service Configuration



## Adding New Routes#### Menu Structure

```typescript

1. Add to `navigation.json`:interface TopNavConfig {

```json  menuSections: MenuSection[];

{  actionButtons: ActionButton[];

  "id": "my-feature",}

  "label": "My Feature",

  "icon": "star",interface MenuSection {

  "routerLink": "/my-feature"  id: string;

}  label: string;

```  order: number;

  items: MenuItem[];

2. Add to breadcrumb mapping:}

```json

{interface MenuItem {

  "/my-feature": {  id: string;

    "label": "My Feature",  label: string;

    "icon": "star"  icon: string;

  }  routerLink?: string;

}  action?: string;

```  children?: MenuItem[];

  badge?: BadgeConfig;

3. Define Angular route:  dividerAfter?: boolean;

```typescript}

{```

  path: 'my-feature',

  component: MyFeatureComponent#### Example Configuration

}

```### Current Menu Sections



## Accessibility1. **Health** - System monitoring and status

2. **Documents** - Reports and document management

All navigation components are ADA compliant:3. **Settings** - System and user preferences

- ✅ ARIA labels on interactive elements4. **Audit** - Activity logging and tracking

- ✅ Keyboard navigation support

- ✅ Focus indicators### Action Buttons

- ✅ Screen reader friendly```typescript

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
