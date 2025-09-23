# Architecture Guide: NgRx Signal Stores & Reusable Patterns

## Overview

The Apex Dashboard application uses a modern, scalable architecture built around NgRx Signal Stores and reusable base patterns. This document outlines the architectural decisions, patterns, and best practices used throughout the application.

## State Management Architecture

### NgRx Signal Stores

We use NgRx Signal Stores instead of traditional NgRx Store for the following benefits:

- **Simplified API**: No need for actions, reducers, selectors, or effects
- **Better Performance**: Built-in signal reactivity with Angular 20
- **Type Safety**: Full TypeScript support with minimal boilerplate
- **Reactive**: Seamless integration with Angular's signal system

### Store Structure

Each feature has its own signal store following this pattern:

```typescript
export const FeatureStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    // Computed properties derived from state
  })),
  withMethods((store, apiService = inject(ApiService)) => ({
    // Methods for state mutations and side effects
  }))
);
```

### Current Stores

1. **DashboardStore** (`/features/dashboard/data-access/dashboard.store.ts`)
   - Manages dashboard data, statistics, and activity feeds
   - Handles data refresh and loading states

2. **UsersStore** (`/features/users/data-access/users.store.ts`)
   - User management operations (CRUD)
   - User filtering and status management
   - Selected user state

3. **LookupItemsStore** (`/features/lookup-management/data-access/lookup-items.store.ts`)
   - Lookup data management with categories
   - Search and filtering capabilities
   - Category-based organization

4. **SettingsStore** (`/features/settings/data-access/state/settings.store.ts`)
   - Application settings and user preferences
   - Security settings and system information
   - Settings validation and updates

5. **NavigationStore** (`/core/state/navigation/navigation.store.ts`)
   - Navigation menu state and active routes
   - Breadcrumb management
   - Menu collapse/expand state

6. **NotificationsStore** (`/core/state/notifications/notifications.store.ts`)
   - User notifications and alerts
   - Read/unread status management
   - Notification filtering and grouping

## Reusable Architecture Patterns

### 1. BaseApiService

All API services extend from a common base class to eliminate duplication:

```typescript
export abstract class BaseApiService {
  protected abstract readonly endpoint: string;
  
  protected get<T>(path?: string): Observable<T>
  protected post<T>(data: any, path?: string): Observable<T>
  protected put<T>(data: any, path?: string): Observable<T>
  protected delete<T>(path?: string): Observable<T>
}
```

**Benefits:**
- Consistent URL building with EnvironmentService
- Standardized HTTP methods across all services
- Reduced code duplication
- Easier testing and maintenance

### 2. Base State Interface

Common state properties shared across all stores:

```typescript
export interface BaseState {
  loading: boolean;
  error: string | null;
}
```

**Usage:**
```typescript
interface FeatureState extends BaseState {
  data: FeatureData[];
  selectedItem: FeatureData | null;
}
```

### 3. Store Utilities

Utility functions for common store operations:

```typescript
// Set loading state
setLoading(store);

// Handle success with state update
setSuccess(store, { data: newData });

// Handle errors
setError(store, 'Error message');

// Execute operations with automatic loading state
executeWithLoadingState(store, operation, successCallback);
```

**Benefits:**
- Consistent error handling across all stores
- Standardized loading state management
- Reduced boilerplate code
- Better debugging with console logging

## API Service Patterns

### Before (Legacy Pattern)
```typescript
@Injectable()
export class UsersApiService {
  private http = inject(HttpClient);
  private envService = inject(EnvironmentService);

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(
      this.envService.buildApiUrl('/users')
    );
  }
}
```

### After (Reusable Pattern)
```typescript
@Injectable()
export class UsersApiService extends BaseApiService {
  protected readonly endpoint = '/users';

  getUsers(): Observable<User[]> {
    return this.get<User[]>();
  }
}
```

## Store Patterns

### Loading State Management
All stores use consistent loading state patterns:

```typescript
withMethods((store, apiService = inject(ApiService)) => ({
  loadData: rxMethod<void>(
    pipe(
      tap(() => setLoading(store)),
      switchMap(() =>
        apiService.getData().pipe(
          tap(data => setSuccess(store, { data })),
          handleError(store, 'Failed to load data')
        )
      )
    )
  )
}))
```

### Computed Properties
Consistent computed property patterns:

```typescript
withComputed(({ data, loading, error }) => ({
  hasData: computed(() => data().length > 0),
  hasError: computed(() => !!error()),
  isLoading: computed(() => loading())
}))
```

## Best Practices

### 1. Consistent Naming
- Stores: `FeatureStore`
- API Services: `FeatureApiService`
- States: `FeatureState`
- Components: `Feature` or `FeatureComponent`

### 2. Error Handling
- Always use the shared `handleError` utility
- Provide meaningful error messages
- Log errors for debugging

### 3. Loading States
- Use `setLoading` at the start of async operations
- Use `setSuccess` or `setError` to complete operations
- Provide loading feedback in UI components

### 4. Type Safety
- Define strong TypeScript interfaces for all data
- Use generic types in base classes
- Avoid `any` types where possible

### 5. Testing
- Mock base services for unit tests
- Test computed properties separately
- Use the store utilities in test scenarios

## Migration Notes

### From Legacy NgRx to Signal Stores
The application was migrated from traditional NgRx (Store/Effects/Reducers) to Signal Stores:

**Removed:**
- Actions files (`*.actions.ts`)
- Effects files (`*.effects.ts`)
- Reducers files (`*.reducer.ts`)
- Selectors files (`*.selectors.ts`)
- Facade files (`*.facade.ts`)

**Added:**
- Signal Store files (`*.store.ts`)
- Base API service pattern
- Shared state utilities
- Consistent error handling

### Component Updates
Components were updated to use signal stores directly:

```typescript
// Before
constructor(private store: Store) {}
users$ = this.store.select(selectUsers);

// After
private usersStore = inject(UsersStore);
users = this.usersStore.users; // Signal
```

## Performance Benefits

1. **Reduced Bundle Size**: Eliminated NgRx boilerplate code
2. **Better Tree Shaking**: Unused code is automatically removed
3. **Signal Reactivity**: More efficient change detection
4. **Less Memory Usage**: Fewer objects and subscriptions
5. **Faster Development**: Less boilerplate, more productivity

## Future Enhancements

1. **Caching Layer**: Add shared caching utilities for API responses
2. **Offline Support**: Implement offline-first patterns with stores
3. **Real-time Updates**: WebSocket integration with signal stores
4. **Advanced Filtering**: Shared filtering utilities for list-based stores
5. **Optimistic Updates**: Patterns for immediate UI feedback

This architecture provides a solid foundation for scalable, maintainable Angular applications with modern state management patterns.