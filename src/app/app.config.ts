import { provideDevtoolsConfig } from '@angular-architects/ngrx-toolkit';
import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { coreProviders } from './core/core.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    // Traditional NgRx Store (required for DevTools infrastructure)
    provideStore(),
    // Redux DevTools for traditional stores and Signal Stores
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
      connectInZone: true,
      name: 'Apex Dashboard',
    }),
    // NgRx Toolkit DevTools configuration for Signal Stores
    provideDevtoolsConfig({
      name: 'Signal Stores',
    }),
    ...coreProviders,
  ],
};
