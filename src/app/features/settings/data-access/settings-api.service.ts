import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../shared/services/base-api.service';
import {
  GeneralSettings,
  SecuritySettings,
  SystemInformation,
  UserPreferences,
} from './state/settings.state';

@Injectable({
  providedIn: 'root',
})
export class SettingsApiService extends BaseApiService {
  protected readonly endpoint = ''; // Empty because JSON server endpoints are at root level

  // Get all settings - combine separate endpoints since JSON server has them split
  getAllSettings(): Observable<{
    generalSettings: GeneralSettings;
    userPreferences: UserPreferences;
    securitySettings: SecuritySettings;
    systemInformation: SystemInformation;
  }> {
    // For now, return individual endpoints - this should be handled by the store
    throw new Error(
      'Use individual settings endpoints - getAllSettings not supported by current JSON server setup'
    );
  }

  // General Settings
  getGeneralSettings(): Observable<GeneralSettings> {
    return this.get<GeneralSettings>('/generalSettings');
  }

  updateGeneralSettings(
    settings: GeneralSettings
  ): Observable<GeneralSettings> {
    return this.put<GeneralSettings>(settings, '/generalSettings/general');
  }

  // User Preferences
  getUserPreferences(): Observable<UserPreferences> {
    return this.get<UserPreferences>('/userPreferences');
  }

  updateUserPreferences(
    preferences: UserPreferences
  ): Observable<UserPreferences> {
    return this.put<UserPreferences>(
      preferences,
      '/userPreferences/preferences'
    );
  }

  // Security Settings
  getSecuritySettings(): Observable<SecuritySettings> {
    return this.get<SecuritySettings>('/securitySettings');
  }

  updateSecuritySettings(
    settings: SecuritySettings
  ): Observable<SecuritySettings> {
    return this.put<SecuritySettings>(settings, '/securitySettings/security');
  }

  // System Information
  getSystemInformation(): Observable<SystemInformation> {
    return this.get<SystemInformation>('/systemInformation');
  }
}
