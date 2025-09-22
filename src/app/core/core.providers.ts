import { isDevMode } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

// Core state reducers - LEGACY (migrated to signal stores)
// import { navigationReducer } from './state/navigation/navigation.reducer';
// import { notificationsReducer } from './state/notifications/notifications.reducer';

// Core effects - LEGACY (migrated to signal stores)
// import { NavigationEffects } from './state/navigation/navigation.effects';
// import { NotificationsEffects } from './state/notifications/notifications.effects';

// Global facades - LEGACY (migrated to signal stores)
// import { NavigationFacade } from './state/navigation/navigation.facade';
// import { NotificationsFacade } from './state/notifications/notifications.facade';

// Global services
import { DialogService } from './services/dialog.service';
import { EnvironmentService } from './services/environment.service';

/**
 * Core providers for the application
 * Contains only truly global state and singletons
 */
export const coreProviders = [
  // Global services
  DialogService,
  EnvironmentService,

  // NOTE: Legacy NgRx Store/Effects/Facades have been migrated to Signal Stores
  // All features now use their respective signal stores:
  // - NavigationStore (replaces NavigationFacade + reducer + effects)
  // - NotificationsStore (replaces NotificationsFacade + reducer + effects)
  // - UsersStore, DashboardStore, LookupItemsStore

  // Minimal NgRx setup for DevTools only (can be removed if not needed)
  provideStore({}),
  provideEffects([]),

  // DevTools (only in development)
  provideStoreDevtools({
    maxAge: 25,
    logOnly: !isDevMode(),
    autoPause: true,
    trace: false,
    traceLimit: 75,
  }),
];
