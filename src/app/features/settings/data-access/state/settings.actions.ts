import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  GeneralSettings,
  SecuritySettings,
  SystemInformation,
  UserPreferences,
} from './settings.state';

export const SettingsActions = createActionGroup({
  source: 'Settings',
  events: {
    // Load All Settings
    'Load All Settings': emptyProps(),
    'Load All Settings Success': props<{
      generalSettings: GeneralSettings;
      userPreferences: UserPreferences;
      securitySettings: SecuritySettings;
      systemInformation: SystemInformation;
    }>(),
    'Load All Settings Failure': props<{ error: string }>(),

    // Load General Settings
    'Load General Settings': emptyProps(),
    'Load General Settings Success': props<{
      generalSettings: GeneralSettings;
    }>(),
    'Load General Settings Failure': props<{ error: string }>(),

    // Update General Settings
    'Update General Settings': props<{ generalSettings: GeneralSettings }>(),
    'Update General Settings Success': props<{
      generalSettings: GeneralSettings;
    }>(),
    'Update General Settings Failure': props<{ error: string }>(),

    // Load User Preferences
    'Load User Preferences': emptyProps(),
    'Load User Preferences Success': props<{
      userPreferences: UserPreferences;
    }>(),
    'Load User Preferences Failure': props<{ error: string }>(),

    // Update User Preferences
    'Update User Preferences': props<{ userPreferences: UserPreferences }>(),
    'Update User Preferences Success': props<{
      userPreferences: UserPreferences;
    }>(),
    'Update User Preferences Failure': props<{ error: string }>(),

    // Load Security Settings
    'Load Security Settings': emptyProps(),
    'Load Security Settings Success': props<{
      securitySettings: SecuritySettings;
    }>(),
    'Load Security Settings Failure': props<{ error: string }>(),

    // Update Security Settings
    'Update Security Settings': props<{ securitySettings: SecuritySettings }>(),
    'Update Security Settings Success': props<{
      securitySettings: SecuritySettings;
    }>(),
    'Update Security Settings Failure': props<{ error: string }>(),

    // Load System Information
    'Load System Information': emptyProps(),
    'Load System Information Success': props<{
      systemInformation: SystemInformation;
    }>(),
    'Load System Information Failure': props<{ error: string }>(),

    // Refresh System Information (read-only, updated by system)
    'Refresh System Information': emptyProps(),

    // Clear Error
    'Clear Error': emptyProps(),

    // Reset All Settings
    'Reset All Settings': emptyProps(),
    'Reset All Settings Success': emptyProps(),
    'Reset All Settings Failure': props<{ error: string }>(),
  },
});
