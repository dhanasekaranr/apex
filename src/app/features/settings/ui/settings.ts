import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
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
import { BreadcrumbStyle } from '../../../shared/ui/breadcrumb/breadcrumb.component';
import {
  GeneralSettings,
  SecuritySettings,
  UserPreferences,
} from '../data-access/state/settings.state';
import { SettingsStore } from '../data-access/state/settings.store';

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
  private settingsStore = inject(SettingsStore);
  private fb = inject(FormBuilder);

  selectedCategory: string = 'general';

  // Forms for different settings categories
  generalForm: FormGroup;
  userPreferencesForm: FormGroup;
  securityForm: FormGroup;

  // Signal-based store data
  readonly loading = this.settingsStore.loading;
  readonly error = this.settingsStore.error;
  readonly allSettingsLoaded = this.settingsStore.allSettingsLoaded;

  readonly generalSettings = this.settingsStore.generalSettings;
  readonly userPreferences = this.settingsStore.userPreferences;
  readonly securitySettings = this.settingsStore.securitySettings;
  readonly systemInformation = this.settingsStore.systemInformation;

  readonly settingsOverview = this.settingsStore.settingsOverview;
  readonly securityScore = this.settingsStore.securityScore;

  // Computed signals for derived state
  readonly settingsData = computed(() => ({
    general: this.generalSettings(),
    user: this.userPreferences(),
    security: this.securitySettings(),
    system: this.systemInformation(),
    loading: this.loading(),
    hasData: !!(
      this.generalSettings() &&
      this.userPreferences() &&
      this.securitySettings() &&
      this.systemInformation()
    ),
  }));

  // State management signals
  readonly selectedCategorySignal = signal<string>('general');

  // Computed signal for category validation
  readonly isCategoryValid = computed(() => {
    const category = this.selectedCategorySignal();
    return ['general', 'preferences', 'security', 'system'].includes(category);
  });

  // Effects (must be class field initializers to run in injection context)
  private loadSettingsEffect = effect(() => {
    const allLoaded = this.allSettingsLoaded();
    if (!allLoaded) {
      console.log('📡 Settings not in store, loading from API');
      this.settingsStore.loadSettings();
    } else {
      console.log('✅ Settings already in store, using cached data');
    }
  });

  private populateFormsEffect = effect(() => {
    const data = this.settingsData();
    if (data.hasData) {
      console.log('✅ Settings data loaded, populating forms');
      this.populateForms(data.general!, data.user!, data.security!);
    }
  });

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
    // Effects are now handled as class field initializers to run in injection context
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    console.log(`📂 Settings category changed to: ${category}`);
  }

  refreshSystemInformation() {
    console.log('🔄 Refreshing system information');
    // System information is read-only, just reload all settings
    this.settingsStore.loadSettings();
  }

  saveGeneralSettings() {
    if (this.generalForm.valid) {
      const formValue = this.generalForm.value;
      const currentSettings = this.generalSettings();

      if (currentSettings) {
        const updatedSettings = { ...currentSettings, ...formValue };
        console.log('💾 Saving general settings');
        this.settingsStore.updateGeneralSettings(updatedSettings);
      }
    }
  }

  saveUserPreferences() {
    if (this.userPreferencesForm.valid) {
      const formValue = this.userPreferencesForm.value;
      const currentPreferences = this.userPreferences();

      if (currentPreferences) {
        const updatedPreferences = {
          ...currentPreferences,
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
        };

        console.log('💾 Saving user preferences');
        this.settingsStore.updateUserPreferences(updatedPreferences);
      }
    }
  }

  saveSecuritySettings() {
    if (this.securityForm.valid) {
      const formValue = this.securityForm.value;
      const currentSettings = this.securitySettings();

      if (currentSettings) {
        const updatedSettings = {
          ...currentSettings,
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
            ...currentSettings.twoFactorAuth,
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
            ...currentSettings.apiSecurity,
            rateLimiting: formValue.rateLimiting,
            maxRequestsPerMinute: formValue.maxRequestsPerMinute,
            corsEnabled: formValue.corsEnabled,
            encryptionEnabled: formValue.encryptionEnabled,
            auditLogging: formValue.auditLogging,
          },
        };

        console.log('💾 Saving security settings');
        this.settingsStore.updateSecuritySettings(updatedSettings);
      }
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
