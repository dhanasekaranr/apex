import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin, of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { SettingsActions } from './settings.actions';
import {
  GeneralSettings,
  SecuritySettings,
  SystemInformation,
  UserPreferences,
} from './settings.state';

@Injectable()
export class SettingsEffects {
  private apiUrl = 'http://localhost:3001';
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  // Load All Settings
  loadAllSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.loadAllSettings),
      exhaustMap(() => {
        console.log('🔄 Loading all settings from API');

        // Load all settings in parallel
        const generalSettings$ = this.http.get<GeneralSettings[]>(
          `${this.apiUrl}/generalSettings`
        );
        const userPreferences$ = this.http.get<UserPreferences[]>(
          `${this.apiUrl}/userPreferences`
        );
        const securitySettings$ = this.http.get<SecuritySettings[]>(
          `${this.apiUrl}/securitySettings`
        );
        const systemInformation$ = this.http.get<SystemInformation[]>(
          `${this.apiUrl}/systemInformation`
        );

        return forkJoin({
          generalSettings: generalSettings$,
          userPreferences: userPreferences$,
          securitySettings: securitySettings$,
          systemInformation: systemInformation$,
        }).pipe(
          map((responses) => {
            console.log('✅ All settings loaded successfully');
            return SettingsActions.loadAllSettingsSuccess({
              generalSettings: responses.generalSettings[0],
              userPreferences: responses.userPreferences[0],
              securitySettings: responses.securitySettings[0],
              systemInformation: responses.systemInformation[0],
            });
          }),
          catchError((error) => {
            console.error('❌ Error loading all settings:', error);
            return of(
              SettingsActions.loadAllSettingsFailure({
                error: error.message || 'Failed to load settings',
              })
            );
          })
        );
      })
    )
  );

  // Load General Settings
  loadGeneralSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.loadGeneralSettings),
      exhaustMap(() => {
        console.log('🔄 Loading general settings from API');
        return this.http
          .get<GeneralSettings[]>(`${this.apiUrl}/generalSettings`)
          .pipe(
            map((settings) => {
              console.log('✅ General settings loaded successfully');
              return SettingsActions.loadGeneralSettingsSuccess({
                generalSettings: settings[0],
              });
            }),
            catchError((error) => {
              console.error('❌ Error loading general settings:', error);
              return of(
                SettingsActions.loadGeneralSettingsFailure({
                  error: error.message || 'Failed to load general settings',
                })
              );
            })
          );
      })
    )
  );

  // Update General Settings
  updateGeneralSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.updateGeneralSettings),
      exhaustMap(({ generalSettings }) => {
        console.log('🔄 Updating general settings');
        return this.http
          .put<GeneralSettings>(
            `${this.apiUrl}/generalSettings/${generalSettings.id}`,
            generalSettings
          )
          .pipe(
            map((updatedSettings) => {
              console.log('✅ General settings updated successfully');
              return SettingsActions.updateGeneralSettingsSuccess({
                generalSettings: updatedSettings,
              });
            }),
            catchError((error) => {
              console.error('❌ Error updating general settings:', error);
              return of(
                SettingsActions.updateGeneralSettingsFailure({
                  error: error.message || 'Failed to update general settings',
                })
              );
            })
          );
      })
    )
  );

  // Load User Preferences
  loadUserPreferences$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.loadUserPreferences),
      exhaustMap(() => {
        console.log('🔄 Loading user preferences from API');
        return this.http
          .get<UserPreferences[]>(`${this.apiUrl}/userPreferences`)
          .pipe(
            map((preferences) => {
              console.log('✅ User preferences loaded successfully');
              return SettingsActions.loadUserPreferencesSuccess({
                userPreferences: preferences[0],
              });
            }),
            catchError((error) => {
              console.error('❌ Error loading user preferences:', error);
              return of(
                SettingsActions.loadUserPreferencesFailure({
                  error: error.message || 'Failed to load user preferences',
                })
              );
            })
          );
      })
    )
  );

  // Update User Preferences
  updateUserPreferences$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.updateUserPreferences),
      exhaustMap(({ userPreferences }) => {
        console.log('🔄 Updating user preferences');
        return this.http
          .put<UserPreferences>(
            `${this.apiUrl}/userPreferences/${userPreferences.id}`,
            userPreferences
          )
          .pipe(
            map((updatedPreferences) => {
              console.log('✅ User preferences updated successfully');
              return SettingsActions.updateUserPreferencesSuccess({
                userPreferences: updatedPreferences,
              });
            }),
            catchError((error) => {
              console.error('❌ Error updating user preferences:', error);
              return of(
                SettingsActions.updateUserPreferencesFailure({
                  error: error.message || 'Failed to update user preferences',
                })
              );
            })
          );
      })
    )
  );

  // Load Security Settings
  loadSecuritySettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.loadSecuritySettings),
      exhaustMap(() => {
        console.log('🔄 Loading security settings from API');
        return this.http
          .get<SecuritySettings[]>(`${this.apiUrl}/securitySettings`)
          .pipe(
            map((settings) => {
              console.log('✅ Security settings loaded successfully');
              return SettingsActions.loadSecuritySettingsSuccess({
                securitySettings: settings[0],
              });
            }),
            catchError((error) => {
              console.error('❌ Error loading security settings:', error);
              return of(
                SettingsActions.loadSecuritySettingsFailure({
                  error: error.message || 'Failed to load security settings',
                })
              );
            })
          );
      })
    )
  );

  // Update Security Settings
  updateSecuritySettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.updateSecuritySettings),
      exhaustMap(({ securitySettings }) => {
        console.log('🔄 Updating security settings');
        return this.http
          .put<SecuritySettings>(
            `${this.apiUrl}/securitySettings/${securitySettings.id}`,
            securitySettings
          )
          .pipe(
            map((updatedSettings) => {
              console.log('✅ Security settings updated successfully');
              return SettingsActions.updateSecuritySettingsSuccess({
                securitySettings: updatedSettings,
              });
            }),
            catchError((error) => {
              console.error('❌ Error updating security settings:', error);
              return of(
                SettingsActions.updateSecuritySettingsFailure({
                  error: error.message || 'Failed to update security settings',
                })
              );
            })
          );
      })
    )
  );

  // Load System Information
  loadSystemInformation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        SettingsActions.loadSystemInformation,
        SettingsActions.refreshSystemInformation
      ),
      exhaustMap(() => {
        console.log('🔄 Loading system information from API');
        return this.http
          .get<SystemInformation[]>(`${this.apiUrl}/systemInformation`)
          .pipe(
            map((info) => {
              console.log('✅ System information loaded successfully');
              return SettingsActions.loadSystemInformationSuccess({
                systemInformation: info[0],
              });
            }),
            catchError((error) => {
              console.error('❌ Error loading system information:', error);
              return of(
                SettingsActions.loadSystemInformationFailure({
                  error: error.message || 'Failed to load system information',
                })
              );
            })
          );
      })
    )
  );
}
