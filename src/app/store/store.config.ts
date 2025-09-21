import { isDevMode } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

// Feature reducers
import { dashboardReducer } from './dashboard';
import { lookupItemsReducer } from './lookup-items';
import { navigationReducer } from './navigation';
import { notificationsReducer } from './notifications';
import { settingsReducer } from './settings';
import { usersReducer } from './users';

// Effects
import { DashboardEffects } from './dashboard';
import { LookupItemsEffects } from './lookup-items';
import { NavigationEffects } from './navigation';
import { NotificationsEffects } from './notifications';
import { SettingsEffects } from './settings';
import { UsersEffects } from './users';

// Root state interface
export interface AppState {
  dashboard: ReturnType<typeof dashboardReducer>;
  users: ReturnType<typeof usersReducer>;
  lookupItems: ReturnType<typeof lookupItemsReducer>;
  settings: ReturnType<typeof settingsReducer>;
  navigation: ReturnType<typeof navigationReducer>;
  notifications: ReturnType<typeof notificationsReducer>;
}

// Store providers for dependency injection
export const storeProviders = [
  provideStore({
    dashboard: dashboardReducer,
    users: usersReducer,
    lookupItems: lookupItemsReducer,
    settings: settingsReducer,
    navigation: navigationReducer,
    notifications: notificationsReducer,
  }),
  provideEffects([
    DashboardEffects,
    UsersEffects,
    LookupItemsEffects,
    SettingsEffects,
    NavigationEffects,
    NotificationsEffects,
  ]),
  provideStoreDevtools({
    maxAge: 25,
    logOnly: !isDevMode(),
    autoPause: true,
    trace: false,
    traceLimit: 75,
  }),
];
