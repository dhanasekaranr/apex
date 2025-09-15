import { createReducer, on } from '@ngrx/store';
import { SettingsActions } from './settings.actions';
import { SettingsState } from './settings.state';

export const initialSettingsState: SettingsState = {
  generalSettings: null,
  userPreferences: null,
  securitySettings: null,
  systemInformation: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

export const settingsReducer = createReducer(
  initialSettingsState,

  // Load All Settings
  on(SettingsActions.loadAllSettings, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    SettingsActions.loadAllSettingsSuccess,
    (
      state,
      { generalSettings, userPreferences, securitySettings, systemInformation }
    ) => ({
      ...state,
      generalSettings,
      userPreferences,
      securitySettings,
      systemInformation,
      loading: false,
      error: null,
      lastUpdated: new Date().toISOString(),
    })
  ),

  on(SettingsActions.loadAllSettingsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // General Settings
  on(SettingsActions.loadGeneralSettings, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    SettingsActions.loadGeneralSettingsSuccess,
    (state, { generalSettings }) => ({
      ...state,
      generalSettings,
      loading: false,
      error: null,
      lastUpdated: new Date().toISOString(),
    })
  ),

  on(SettingsActions.loadGeneralSettingsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(SettingsActions.updateGeneralSettings, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    SettingsActions.updateGeneralSettingsSuccess,
    (state, { generalSettings }) => ({
      ...state,
      generalSettings,
      loading: false,
      error: null,
      lastUpdated: new Date().toISOString(),
    })
  ),

  on(SettingsActions.updateGeneralSettingsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // User Preferences
  on(SettingsActions.loadUserPreferences, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    SettingsActions.loadUserPreferencesSuccess,
    (state, { userPreferences }) => ({
      ...state,
      userPreferences,
      loading: false,
      error: null,
      lastUpdated: new Date().toISOString(),
    })
  ),

  on(SettingsActions.loadUserPreferencesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(SettingsActions.updateUserPreferences, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    SettingsActions.updateUserPreferencesSuccess,
    (state, { userPreferences }) => ({
      ...state,
      userPreferences,
      loading: false,
      error: null,
      lastUpdated: new Date().toISOString(),
    })
  ),

  on(SettingsActions.updateUserPreferencesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Security Settings
  on(SettingsActions.loadSecuritySettings, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    SettingsActions.loadSecuritySettingsSuccess,
    (state, { securitySettings }) => ({
      ...state,
      securitySettings,
      loading: false,
      error: null,
      lastUpdated: new Date().toISOString(),
    })
  ),

  on(SettingsActions.loadSecuritySettingsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(SettingsActions.updateSecuritySettings, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    SettingsActions.updateSecuritySettingsSuccess,
    (state, { securitySettings }) => ({
      ...state,
      securitySettings,
      loading: false,
      error: null,
      lastUpdated: new Date().toISOString(),
    })
  ),

  on(SettingsActions.updateSecuritySettingsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // System Information
  on(SettingsActions.loadSystemInformation, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    SettingsActions.loadSystemInformationSuccess,
    (state, { systemInformation }) => ({
      ...state,
      systemInformation,
      loading: false,
      error: null,
      lastUpdated: new Date().toISOString(),
    })
  ),

  on(SettingsActions.loadSystemInformationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(SettingsActions.refreshSystemInformation, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  // Clear Error
  on(SettingsActions.clearError, (state) => ({
    ...state,
    error: null,
  })),

  // Reset All Settings
  on(SettingsActions.resetAllSettings, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(SettingsActions.resetAllSettingsSuccess, (state) => ({
    ...initialSettingsState,
    lastUpdated: new Date().toISOString(),
  })),

  on(SettingsActions.resetAllSettingsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
