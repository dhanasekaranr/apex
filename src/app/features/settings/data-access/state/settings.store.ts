import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, forkJoin, of, pipe, switchMap, tap } from 'rxjs';
import { SettingsApiService } from '../settings-api.service';
import {
  GeneralSettings,
  SecuritySettings,
  SettingsState,
  UserPreferences,
} from './settings.state';

type SettingsStoreState = SettingsState;

const initialState: SettingsStoreState = {
  generalSettings: null,
  userPreferences: null,
  securitySettings: null,
  systemInformation: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

export const SettingsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    // Loading states
    allSettingsLoaded: computed(() => {
      const state = store;
      return !!(
        state.generalSettings() &&
        state.userPreferences() &&
        state.securitySettings() &&
        state.systemInformation()
      );
    }),

    // Settings overview for dashboard
    settingsOverview: computed(() => {
      const generalSettings = store.generalSettings();
      const userPreferences = store.userPreferences();
      const securitySettings = store.securitySettings();

      if (!generalSettings || !userPreferences || !securitySettings) {
        return null;
      }

      return {
        applicationName: generalSettings.applicationName,
        version: generalSettings.version,
        environment: generalSettings.environment,
        theme: userPreferences.theme,
        twoFactorEnabled: securitySettings.twoFactorAuth.enabled,
        maintenanceMode: generalSettings.maintenanceMode,
      };
    }),

    // Security score calculation
    securityScore: computed(() => {
      const securitySettings = store.securitySettings();
      if (!securitySettings) return 0;

      let score = 0;
      const policy = securitySettings.passwordPolicy;
      const twoFactor = securitySettings.twoFactorAuth;

      // Password policy scoring
      if (policy.minLength >= 8) score += 20;
      if (policy.requireUppercase && policy.requireLowercase) score += 15;
      if (policy.requireNumbers) score += 10;
      if (policy.requireSpecialChars) score += 10;
      if (policy.maxAge <= 90) score += 10;

      // Two-factor authentication scoring
      if (twoFactor.enabled) score += 25;
      if (twoFactor.required) score += 10;

      return Math.min(score, 100);
    }),
  })),
  withMethods((store, settingsApi = inject(SettingsApiService)) => ({
    // Load all settings - combine individual API calls since getAllSettings is not available
    loadSettings: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          forkJoin({
            generalSettings: settingsApi.getGeneralSettings(),
            userPreferences: settingsApi.getUserPreferences(),
            securitySettings: settingsApi.getSecuritySettings(),
            systemInformation: settingsApi.getSystemInformation(),
          }).pipe(
            tap((settings: any) => {
              console.log('✅ Settings loaded successfully:', settings);
              patchState(store, {
                generalSettings:
                  settings.generalSettings[0] || settings.generalSettings, // Handle array response
                userPreferences:
                  settings.userPreferences[0] || settings.userPreferences,
                securitySettings:
                  settings.securitySettings[0] || settings.securitySettings,
                systemInformation:
                  settings.systemInformation[0] || settings.systemInformation,
                loading: false,
                lastUpdated: new Date().toISOString(),
              });
            }),
            catchError((error: any) => {
              console.error('❌ Error loading settings:', error);
              patchState(store, {
                loading: false,
                error: error.message || 'Failed to load settings',
              });
              return of();
            })
          )
        )
      )
    ),

    // Update general settings
    updateGeneralSettings: rxMethod<GeneralSettings>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((settings) =>
          settingsApi.updateGeneralSettings(settings).pipe(
            tap((updatedSettings: GeneralSettings) => {
              console.log('✅ General settings updated:', updatedSettings);
              patchState(store, {
                generalSettings: updatedSettings,
                loading: false,
                lastUpdated: new Date().toISOString(),
              });
            }),
            catchError((error: any) => {
              console.error('❌ Error updating general settings:', error);
              patchState(store, {
                loading: false,
                error: error.message || 'Failed to update general settings',
              });
              return of();
            })
          )
        )
      )
    ),

    // Update user preferences
    updateUserPreferences: rxMethod<UserPreferences>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((preferences) =>
          settingsApi.updateUserPreferences(preferences).pipe(
            tap((updatedPreferences: UserPreferences) => {
              console.log('✅ User preferences updated:', updatedPreferences);
              patchState(store, {
                userPreferences: updatedPreferences,
                loading: false,
                lastUpdated: new Date().toISOString(),
              });
            }),
            catchError((error: any) => {
              console.error('❌ Error updating user preferences:', error);
              patchState(store, {
                loading: false,
                error: error.message || 'Failed to update user preferences',
              });
              return of();
            })
          )
        )
      )
    ),

    // Update security settings
    updateSecuritySettings: rxMethod<SecuritySettings>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((settings) =>
          settingsApi.updateSecuritySettings(settings).pipe(
            tap((updatedSettings: SecuritySettings) => {
              console.log('✅ Security settings updated:', updatedSettings);
              patchState(store, {
                securitySettings: updatedSettings,
                loading: false,
                lastUpdated: new Date().toISOString(),
              });
            }),
            catchError((error: any) => {
              console.error('❌ Error updating security settings:', error);
              patchState(store, {
                loading: false,
                error: error.message || 'Failed to update security settings',
              });
              return of();
            })
          )
        )
      )
    ),

    // Clear error
    clearError: () => {
      patchState(store, { error: null });
    },

    // Reset store
    reset: () => {
      patchState(store, initialState);
    },
  }))
);
