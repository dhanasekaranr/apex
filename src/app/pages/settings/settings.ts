import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { BreadcrumbStyle } from '../../shared/components/breadcrumb/breadcrumb.component';
import {
  GeneralSettings,
  SecuritySettings,
  SettingsActions,
  SettingsSelectors,
  UserPreferences,
} from '../../store/settings';

@Component({
  selector: 'app-settings',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  selectedCategory: string = 'general';

  // Forms for different settings categories
  generalForm: FormGroup;
  userPreferencesForm: FormGroup;
  securityForm: FormGroup;

  // Observable data from store
  loading$ = this.store.select(SettingsSelectors.selectSettingsLoading);
  error$ = this.store.select(SettingsSelectors.selectSettingsError);
  allSettingsLoaded$ = this.store.select(
    SettingsSelectors.selectAllSettingsLoaded
  );

  generalSettings$ = this.store.select(SettingsSelectors.selectGeneralSettings);
  userPreferences$ = this.store.select(SettingsSelectors.selectUserPreferences);
  securitySettings$ = this.store.select(
    SettingsSelectors.selectSecuritySettings
  );
  systemInformation$ = this.store.select(
    SettingsSelectors.selectSystemInformation
  );

  settingsOverview$ = this.store.select(
    SettingsSelectors.selectSettingsOverview
  );
  securityScore$ = this.store.select(SettingsSelectors.selectSecurityScore);

  // Combined loading state for UI
  settingsData$ = combineLatest([
    this.generalSettings$,
    this.userPreferences$,
    this.securitySettings$,
    this.systemInformation$,
    this.loading$,
  ]).pipe(
    map(([general, user, security, system, loading]) => ({
      general,
      user,
      security,
      system,
      loading,
      hasData: !!(general && user && security && system),
    }))
  );

  // Breadcrumb style demo properties
  selectedBreadcrumbStyle: BreadcrumbStyle = 'default';

  breadcrumbStyles = [
    { value: 'default', label: 'Default - Material Design 3' },
    { value: 'minimal', label: 'Minimal - Clean & Subtle' },
    { value: 'pill', label: 'Pill - Modern Rounded' },
    { value: 'card', label: 'Card - Elevated Cards' },
    { value: 'underline', label: 'Underline - Animated' },
    { value: 'elegant', label: 'Elegant - Serif Typography' },
    { value: 'compact', label: 'Compact - Space Efficient' },
    { value: 'bold', label: 'Bold - High Contrast' },
  ] as const;

  // Theme and language options
  themeOptions = [
    { value: 'light', label: 'Light Theme' },
    { value: 'dark', label: 'Dark Theme' },
    { value: 'auto', label: 'Auto (System)' },
  ];

  languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
  ];

  currencyOptions = [
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
    { value: 'JPY', label: 'Japanese Yen (JPY)' },
    { value: 'CAD', label: 'Canadian Dollar (CAD)' },
  ];

  timezoneOptions = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Europe/Paris', label: 'Paris' },
    { value: 'Asia/Tokyo', label: 'Tokyo' },
  ];

  constructor() {
    // Initialize forms
    this.generalForm = this.fb.group({
      applicationName: [''],
      defaultLanguage: [''],
      defaultCurrency: [''],
      dateFormat: [''],
      timeFormat: [''],
      timezone: [''],
      companyName: [''],
      supportEmail: [''],
      supportPhone: [''],
      maxFileUploadSize: [0],
    });

    this.userPreferencesForm = this.fb.group({
      theme: [''],
      primaryColor: [''],
      accentColor: [''],
      fontSize: [''],
      compactMode: [false],
      showAnimations: [true],
      autoSave: [true],
      autoSaveInterval: [30000],
      // Notifications
      emailNotifications: [true],
      browserNotifications: [true],
      soundNotifications: [true],
      desktopNotifications: [true],
      // Dashboard
      showWelcome: [true],
      defaultView: ['grid'],
      refreshInterval: [30000],
      showQuickActions: [true],
      compactCards: [false],
      // Tables
      defaultPageSize: [25],
      showDensity: ['standard'],
      stickyHeader: [true],
      showColumnResize: [true],
      // Accessibility
      highContrast: [false],
      reducedMotion: [false],
      screenReader: [false],
      keyboardNavigation: [true],
    });

    this.securityForm = this.fb.group({
      // Password Policy
      passwordMinLength: [8],
      requireUppercase: [true],
      requireLowercase: [true],
      requireNumbers: [true],
      requireSpecialChars: [true],
      passwordMaxAge: [90],
      preventPasswordReuse: [5],
      lockoutThreshold: [5],
      lockoutDuration: [30],
      // Two Factor Auth
      twoFactorEnabled: [false],
      twoFactorRequired: [false],
      // Session Management
      sessionTimeoutWarning: [5],
      sessionTimeout: [60],
      maxConcurrentSessions: [3],
      requireReauth: [true],
      rememberMe: [true],
      rememberMeDuration: [30],
      // API Security
      rateLimiting: [true],
      maxRequestsPerMinute: [100],
      corsEnabled: [true],
      encryptionEnabled: [true],
      auditLogging: [true],
    });
  }

  ngOnInit() {
    console.log('🔄 Settings component initializing');

    // Check if settings are already loaded before dispatching load action
    this.allSettingsLoaded$.pipe(take(1)).subscribe((allLoaded) => {
      if (!allLoaded) {
        console.log('📡 Settings not in store, loading from API');
        this.store.dispatch(SettingsActions.loadAllSettings());
      } else {
        console.log('✅ Settings already in store, using cached data');
      }
    });

    // Subscribe to settings data and populate forms
    this.settingsData$.subscribe(({ general, user, security, hasData }) => {
      if (hasData) {
        console.log('✅ Settings data loaded, populating forms');
        this.populateForms(general!, user!, security!);
      }
    });
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    console.log(`📂 Settings category changed to: ${category}`);
  }

  refreshSystemInformation() {
    console.log('🔄 Refreshing system information');
    this.store.dispatch(SettingsActions.refreshSystemInformation());
  }

  saveGeneralSettings() {
    if (this.generalForm.valid) {
      const formValue = this.generalForm.value;

      this.generalSettings$
        .pipe(
          map((settings) => (settings ? { ...settings, ...formValue } : null))
        )
        .subscribe((updatedSettings) => {
          if (updatedSettings) {
            console.log('💾 Saving general settings');
            this.store.dispatch(
              SettingsActions.updateGeneralSettings({
                generalSettings: updatedSettings,
              })
            );
          }
        });
    }
  }

  saveUserPreferences() {
    if (this.userPreferencesForm.valid) {
      const formValue = this.userPreferencesForm.value;

      this.userPreferences$
        .pipe(
          map((preferences) =>
            preferences
              ? {
                  ...preferences,
                  theme: formValue.theme,
                  primaryColor: formValue.primaryColor,
                  accentColor: formValue.accentColor,
                  fontSize: formValue.fontSize,
                  compactMode: formValue.compactMode,
                  showAnimations: formValue.showAnimations,
                  autoSave: formValue.autoSave,
                  autoSaveInterval: formValue.autoSaveInterval,
                  notifications: {
                    email: formValue.emailNotifications,
                    browser: formValue.browserNotifications,
                    sound: formValue.soundNotifications,
                    desktop: formValue.desktopNotifications,
                  },
                  dashboard: {
                    showWelcome: formValue.showWelcome,
                    defaultView: formValue.defaultView,
                    refreshInterval: formValue.refreshInterval,
                    showQuickActions: formValue.showQuickActions,
                    compactCards: formValue.compactCards,
                  },
                  tables: {
                    defaultPageSize: formValue.defaultPageSize,
                    showDensity: formValue.showDensity,
                    stickyHeader: formValue.stickyHeader,
                    showColumnResize: formValue.showColumnResize,
                  },
                  accessibility: {
                    highContrast: formValue.highContrast,
                    reducedMotion: formValue.reducedMotion,
                    screenReader: formValue.screenReader,
                    keyboardNavigation: formValue.keyboardNavigation,
                  },
                }
              : null
          )
        )
        .subscribe((updatedPreferences) => {
          if (updatedPreferences) {
            console.log('💾 Saving user preferences');
            this.store.dispatch(
              SettingsActions.updateUserPreferences({
                userPreferences: updatedPreferences,
              })
            );
          }
        });
    }
  }

  saveSecuritySettings() {
    if (this.securityForm.valid) {
      const formValue = this.securityForm.value;

      this.securitySettings$
        .pipe(
          map((settings) =>
            settings
              ? {
                  ...settings,
                  passwordPolicy: {
                    minLength: formValue.passwordMinLength,
                    requireUppercase: formValue.requireUppercase,
                    requireLowercase: formValue.requireLowercase,
                    requireNumbers: formValue.requireNumbers,
                    requireSpecialChars: formValue.requireSpecialChars,
                    maxAge: formValue.passwordMaxAge,
                    preventReuse: formValue.preventPasswordReuse,
                    lockoutThreshold: formValue.lockoutThreshold,
                    lockoutDuration: formValue.lockoutDuration,
                  },
                  twoFactorAuth: {
                    ...settings.twoFactorAuth,
                    enabled: formValue.twoFactorEnabled,
                    required: formValue.twoFactorRequired,
                  },
                  sessionManagement: {
                    timeoutWarning: formValue.sessionTimeoutWarning,
                    sessionTimeout: formValue.sessionTimeout,
                    maxConcurrentSessions: formValue.maxConcurrentSessions,
                    requireReauth: formValue.requireReauth,
                    rememberMe: formValue.rememberMe,
                    rememberMeDuration: formValue.rememberMeDuration,
                  },
                  apiSecurity: {
                    ...settings.apiSecurity,
                    rateLimiting: formValue.rateLimiting,
                    maxRequestsPerMinute: formValue.maxRequestsPerMinute,
                    corsEnabled: formValue.corsEnabled,
                    encryptionEnabled: formValue.encryptionEnabled,
                    auditLogging: formValue.auditLogging,
                  },
                }
              : null
          )
        )
        .subscribe((updatedSettings) => {
          if (updatedSettings) {
            console.log('💾 Saving security settings');
            this.store.dispatch(
              SettingsActions.updateSecuritySettings({
                securitySettings: updatedSettings,
              })
            );
          }
        });
    }
  }

  private populateForms(
    general: GeneralSettings,
    user: UserPreferences,
    security: SecuritySettings
  ) {
    // Populate General Settings form
    this.generalForm.patchValue({
      applicationName: general.applicationName,
      defaultLanguage: general.defaultLanguage,
      defaultCurrency: general.defaultCurrency,
      dateFormat: general.dateFormat,
      timeFormat: general.timeFormat,
      timezone: general.timezone,
      companyName: general.companyName,
      supportEmail: general.supportEmail,
      supportPhone: general.supportPhone,
      maxFileUploadSize: general.maxFileUploadSize,
    });

    // Populate User Preferences form
    this.userPreferencesForm.patchValue({
      theme: user.theme,
      primaryColor: user.primaryColor,
      accentColor: user.accentColor,
      fontSize: user.fontSize,
      compactMode: user.compactMode,
      showAnimations: user.showAnimations,
      autoSave: user.autoSave,
      autoSaveInterval: user.autoSaveInterval,
      emailNotifications: user.notifications.email,
      browserNotifications: user.notifications.browser,
      soundNotifications: user.notifications.sound,
      desktopNotifications: user.notifications.desktop,
      showWelcome: user.dashboard.showWelcome,
      defaultView: user.dashboard.defaultView,
      refreshInterval: user.dashboard.refreshInterval,
      showQuickActions: user.dashboard.showQuickActions,
      compactCards: user.dashboard.compactCards,
      defaultPageSize: user.tables.defaultPageSize,
      showDensity: user.tables.showDensity,
      stickyHeader: user.tables.stickyHeader,
      showColumnResize: user.tables.showColumnResize,
      highContrast: user.accessibility.highContrast,
      reducedMotion: user.accessibility.reducedMotion,
      screenReader: user.accessibility.screenReader,
      keyboardNavigation: user.accessibility.keyboardNavigation,
    });

    // Populate Security Settings form
    this.securityForm.patchValue({
      passwordMinLength: security.passwordPolicy.minLength,
      requireUppercase: security.passwordPolicy.requireUppercase,
      requireLowercase: security.passwordPolicy.requireLowercase,
      requireNumbers: security.passwordPolicy.requireNumbers,
      requireSpecialChars: security.passwordPolicy.requireSpecialChars,
      passwordMaxAge: security.passwordPolicy.maxAge,
      preventPasswordReuse: security.passwordPolicy.preventReuse,
      lockoutThreshold: security.passwordPolicy.lockoutThreshold,
      lockoutDuration: security.passwordPolicy.lockoutDuration,
      twoFactorEnabled: security.twoFactorAuth.enabled,
      twoFactorRequired: security.twoFactorAuth.required,
      sessionTimeoutWarning: security.sessionManagement.timeoutWarning,
      sessionTimeout: security.sessionManagement.sessionTimeout,
      maxConcurrentSessions: security.sessionManagement.maxConcurrentSessions,
      requireReauth: security.sessionManagement.requireReauth,
      rememberMe: security.sessionManagement.rememberMe,
      rememberMeDuration: security.sessionManagement.rememberMeDuration,
      rateLimiting: security.apiSecurity.rateLimiting,
      maxRequestsPerMinute: security.apiSecurity.maxRequestsPerMinute,
      corsEnabled: security.apiSecurity.corsEnabled,
      encryptionEnabled: security.apiSecurity.encryptionEnabled,
      auditLogging: security.apiSecurity.auditLogging,
    });
  }
}
