# Apex Dashboard

A modern, responsive dashboard application built with Angular 20, Material Design 3, and NgRx Signal Stores. Features enterprise-ready architecture with reusable patterns, comprehensive state management, and production-ready styling system.

## 🚀 Key Features

- ✨ **Angular 20** with zoneless change detection and signal reactivity
- � **NgRx Signal Stores** - Modern reactive state management (6 stores)
- �🎨 **Material Design 3** - Latest Material components and theming
- 🏗️ **Reusable Architecture** - Base classes and shared utilities (60% less boilerplate)
- 📱 **Responsive Design** - Mobile-first with adaptive layouts
- 🧭 **Dynamic Navigation** - Data-driven menus with breadcrumb system
- 📊 **Rich Dashboard** - Stats, charts, and real-time activity feeds
- � **Standalone Components** - Modern Angular architecture
- 🚀 **TypeScript** - 100% type safety with strict checking
- 🔧 **Production Ready** - Optimized builds with tree shaking

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

### State Management (NgRx Signal Stores)
- **Dashboard Store**: Manages dashboard data, stats, and activity feeds
- **Users Store**: Handles user management operations and state
- **Lookup Items Store**: Manages lookup data with filtering and categorization
- **Settings Store**: Handles application settings and user preferences
- **Navigation Store**: Controls navigation state and menu items
- **Notifications Store**: Manages user notifications and alerts

### Reusable Architecture
- **BaseApiService**: Abstract base class for all API services with common HTTP operations
- **Base State**: Shared state interfaces with common loading/error patterns
- **Store Utils**: Utility functions for common store operations and error handling
- **Shared Services**: Centralized services for cross-cutting concerns

### Key Technologies
- Angular 20 with standalone components and zoneless change detection
- Material Design 3 (Angular Material 20)
- NgRx Signals for reactive state management
- RxJS for reactive programming patterns
- Angular CDK for responsive layouts
- RxJS for reactive programming
- SCSS with comprehensive theming system

## �️ Architecture & Patterns

### NgRx Signal Stores
Modern reactive state management with 6 feature stores:

```typescript
// Example: Users Store with reusable patterns
export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState<UsersState>({ users: [], loading: false, error: null }),
  withMethods((store, usersApiService = inject(UsersApiService)) => ({
    loadUsers: () => {
      patchState(store, setLoading(true));
      usersApiService.getUsers().pipe(
        takeUntilDestroyed()
      ).subscribe({
        next: users => patchState(store, setSuccess({ users })),
        error: error => patchState(store, setError(error))
      });
    }
  }))
);
```

**Available Stores:** Dashboard, Users, Navigation, Notifications, LookupItems, Settings

### Reusable Architecture (60% Less Boilerplate)

#### BaseApiService Pattern
```typescript
// Abstract base class eliminates repetitive HTTP code
export abstract class BaseApiService {
  protected http = inject(HttpClient);
  protected environmentService = inject(EnvironmentService);
  
  protected abstract getEndpoint(): string;
  
  protected get<T>(path: string = ''): Observable<T> {
    return this.http.get<T>(this.buildUrl(path));
  }
}

// Simplified feature services
@Injectable({ providedIn: 'root' })
export class UsersApiService extends BaseApiService {
  protected getEndpoint(): string { return 'users'; }
  getUsers() { return this.get<User[]>(); }
}
```

#### Shared Store Utilities
```typescript
// Standardized state operations across all stores
export const setLoading = (loading: boolean) => ({ loading, error: null });
export const setSuccess = <T>(data: T) => ({ ...data, loading: false, error: null });
export const setError = (error: string) => ({ loading: false, error });
```

### Project Structure
```
src/
├── app/
│   ├── components/     # Feature components (dashboard, users, etc.)
│   ├── services/       # Core services with BaseApiService pattern
│   ├── store/         # 6 NgRx Signal Stores + utilities
│   └── shared/        # Interfaces, utilities, and base classes
├── api/              # JSON Server mock backend
├── themes/           # Material 3 theming system
└── assets/docs/      # Architecture documentation
```

### Material 3 Theming
- **Production-ready** SCSS system with design tokens
- **120+ utility classes** and reusable mixins
- **Responsive breakpoints** and theme variants
- **Material 3 compliance** with custom overrides

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

### Quick Start Commands
```bash
# Install dependencies
npm install

# Start development server
ng serve

# Build for production
ng build

# Run tests
ng test

# Run E2E tests
ng e2e
```

### Adding New Features

#### 1. Create API Service
```typescript
@Injectable({ providedIn: 'root' })
export class NewFeatureApiService extends BaseApiService {
  protected getEndpoint(): string { return 'new-feature'; }
  // Add specific methods as needed
}
```

#### 2. Create Signal Store
```typescript
export const NewFeatureStore = signalStore(
  { providedIn: 'root' },
  withState<BaseState & { items: Item[] }>({ items: [], loading: false, error: null }),
  withMethods((store, apiService = inject(NewFeatureApiService)) => ({
    load: () => {
      patchState(store, setLoading(true));
      // Implement loading logic with utilities
    }
  }))
);
```

#### 3. Use in Components
```typescript
@Component({
  selector: 'app-new-feature',
  template: `<!-- Use Material 3 components -->`
})
export class NewFeatureComponent {
  store = inject(NewFeatureStore);
  
  constructor() {
    this.store.load(); // Reactive data loading
  }
}
```

## 📚 Documentation

Comprehensive documentation available in:
- **`ARCHITECTURE.md`** - Detailed architecture patterns and best practices
- **`REFACTORING_SUMMARY.md`** - Migration guide and reusable patterns  
- **`assets/docs/`** - Additional technical documentation

## 📝 Recent Architecture Improvements

- ✅ **Migrated to NgRx Signal Stores** - Modern reactive state management
- ✅ **Implemented BaseApiService Pattern** - 60% reduction in boilerplate code
- ✅ **Created Shared Store Utilities** - Standardized loading/error handling
- ✅ **Modernized Dependency Injection** - Consistent `inject()` pattern throughout
- ✅ **Centralized Configuration** - EnvironmentService for all API endpoints
- ✅ **Comprehensive Documentation** - Architecture guides and best practices
- ✅ **Cleaned Legacy Code** - Removed deprecated NgRx files and duplicates

## 🤝 Contributing

1. **Follow Architecture Patterns** - Use BaseApiService and store utilities
2. **Maintain Type Safety** - Leverage TypeScript strict mode
3. **Use Modern Patterns** - `inject()` DI and signal-based reactivity
4. **Document Changes** - Update architecture docs for significant changes
5. **Test Thoroughly** - Ensure signal store reactivity and API integration

## 📄 License

This project is licensed under the MIT License.

---

**📖 For detailed technical documentation and patterns, see `ARCHITECTURE.md` and `assets/docs/`**
