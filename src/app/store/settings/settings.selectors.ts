import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SettingsState } from './settings.state';

// Feature selector
export const selectSettingsState =
  createFeatureSelector<SettingsState>('settings');

// Base state selectors
export const selectSettingsLoading = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.loading
);

export const selectSettingsError = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.error
);

export const selectSettingsLastUpdated = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.lastUpdated
);

// General Settings selectors
export const selectGeneralSettings = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.generalSettings
);

export const selectGeneralSettingsLoaded = createSelector(
  selectGeneralSettings,
  (generalSettings) => !!generalSettings
);

export const selectApplicationName = createSelector(
  selectGeneralSettings,
  (generalSettings) => generalSettings?.applicationName || 'Apex Application'
);

export const selectApplicationVersion = createSelector(
  selectGeneralSettings,
  (generalSettings) => generalSettings?.version || '1.0.0'
);

export const selectApplicationEnvironment = createSelector(
  selectGeneralSettings,
  (generalSettings) => generalSettings?.environment || 'development'
);

export const selectDefaultLanguage = createSelector(
  selectGeneralSettings,
  (generalSettings) => generalSettings?.defaultLanguage || 'en'
);

export const selectDefaultCurrency = createSelector(
  selectGeneralSettings,
  (generalSettings) => generalSettings?.defaultCurrency || 'USD'
);

export const selectDateFormat = createSelector(
  selectGeneralSettings,
  (generalSettings) => generalSettings?.dateFormat || 'MM/dd/yyyy'
);

export const selectTimeFormat = createSelector(
  selectGeneralSettings,
  (generalSettings) => generalSettings?.timeFormat || '12-hour'
);

export const selectTimeZone = createSelector(
  selectGeneralSettings,
  (generalSettings) => generalSettings?.timezone || 'UTC'
);

export const selectCompanyInfo = createSelector(
  selectGeneralSettings,
  (generalSettings) => ({
    name: generalSettings?.companyName || '',
    logo: generalSettings?.companyLogo || '',
    supportEmail: generalSettings?.supportEmail || '',
    supportPhone: generalSettings?.supportPhone || '',
  })
);

export const selectFileUploadSettings = createSelector(
  selectGeneralSettings,
  (generalSettings) => ({
    maxSize: generalSettings?.maxFileUploadSize || 10485760, // 10MB
    allowedTypes: generalSettings?.allowedFileTypes || [
      'jpg',
      'png',
      'pdf',
      'docx',
    ],
  })
);

export const selectMaintenanceMode = createSelector(
  selectGeneralSettings,
  (generalSettings) => ({
    enabled: generalSettings?.maintenanceMode || false,
    message: generalSettings?.maintenanceMessage || '',
  })
);

// User Preferences selectors
export const selectUserPreferences = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.userPreferences
);

export const selectUserPreferencesLoaded = createSelector(
  selectUserPreferences,
  (userPreferences) => !!userPreferences
);

export const selectUserTheme = createSelector(
  selectUserPreferences,
  (userPreferences) => userPreferences?.theme || 'light'
);

export const selectUserColors = createSelector(
  selectUserPreferences,
  (userPreferences) => ({
    primary: userPreferences?.primaryColor || '#1976d2',
    accent: userPreferences?.accentColor || '#ff4081',
  })
);

export const selectUserDisplaySettings = createSelector(
  selectUserPreferences,
  (userPreferences) => ({
    fontSize: userPreferences?.fontSize || 'medium',
    compactMode: userPreferences?.compactMode || false,
    showAnimations: userPreferences?.showAnimations || true,
  })
);

export const selectUserNotificationSettings = createSelector(
  selectUserPreferences,
  (userPreferences) =>
    userPreferences?.notifications || {
      email: true,
      browser: true,
      sound: true,
      desktop: true,
    }
);

export const selectUserDashboardSettings = createSelector(
  selectUserPreferences,
  (userPreferences) =>
    userPreferences?.dashboard || {
      showWelcome: true,
      defaultView: 'grid',
      refreshInterval: 30000,
      showQuickActions: true,
      compactCards: false,
    }
);

export const selectUserTableSettings = createSelector(
  selectUserPreferences,
  (userPreferences) =>
    userPreferences?.tables || {
      defaultPageSize: 25,
      showDensity: 'standard',
      stickyHeader: true,
      showColumnResize: true,
    }
);

export const selectUserAccessibilitySettings = createSelector(
  selectUserPreferences,
  (userPreferences) =>
    userPreferences?.accessibility || {
      highContrast: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
    }
);

export const selectAutoSaveSettings = createSelector(
  selectUserPreferences,
  (userPreferences) => ({
    enabled: userPreferences?.autoSave || true,
    interval: userPreferences?.autoSaveInterval || 30000, // 30 seconds
  })
);

// Security Settings selectors
export const selectSecuritySettings = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.securitySettings
);

export const selectSecuritySettingsLoaded = createSelector(
  selectSecuritySettings,
  (securitySettings) => !!securitySettings
);

export const selectPasswordPolicy = createSelector(
  selectSecuritySettings,
  (securitySettings) =>
    securitySettings?.passwordPolicy || {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxAge: 90,
      preventReuse: 5,
      lockoutThreshold: 5,
      lockoutDuration: 30,
    }
);

export const selectSessionManagement = createSelector(
  selectSecuritySettings,
  (securitySettings) =>
    securitySettings?.sessionManagement || {
      timeoutWarning: 5,
      sessionTimeout: 60,
      maxConcurrentSessions: 3,
      requireReauth: true,
      rememberMe: true,
      rememberMeDuration: 30,
    }
);

export const selectTwoFactorAuth = createSelector(
  selectSecuritySettings,
  (securitySettings) =>
    securitySettings?.twoFactorAuth || {
      enabled: false,
      methods: ['totp', 'sms'],
      defaultMethod: 'totp',
      backupCodes: true,
      required: false,
    }
);

export const selectApiSecurity = createSelector(
  selectSecuritySettings,
  (securitySettings) =>
    securitySettings?.apiSecurity || {
      rateLimiting: true,
      maxRequestsPerMinute: 100,
      corsEnabled: true,
      allowedOrigins: ['*'],
      encryptionEnabled: true,
      auditLogging: true,
    }
);

export const selectDataProtection = createSelector(
  selectSecuritySettings,
  (securitySettings) =>
    securitySettings?.dataProtection || {
      dataRetentionPeriod: 365,
      automaticBackup: true,
      backupFrequency: 'daily',
      encryptData: true,
      anonymizeData: false,
    }
);

// System Information selectors
export const selectSystemInformation = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.systemInformation
);

export const selectSystemInformationLoaded = createSelector(
  selectSystemInformation,
  (systemInformation) => !!systemInformation
);

export const selectServerInfo = createSelector(
  selectSystemInformation,
  (systemInformation) =>
    systemInformation?.server || {
      hostname: 'localhost',
      ipAddress: '127.0.0.1',
      port: 3001,
      protocol: 'http',
      uptime: 0,
      lastRestart: new Date().toISOString(),
    }
);

export const selectDatabaseInfo = createSelector(
  selectSystemInformation,
  (systemInformation) =>
    systemInformation?.database || {
      type: 'JSON Server',
      version: '0.17.4',
      host: 'localhost',
      port: 3001,
      name: 'apex-db',
      connectionPool: 1,
      status: 'connected',
    }
);

export const selectPerformanceMetrics = createSelector(
  selectSystemInformation,
  (systemInformation) =>
    systemInformation?.performance || {
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 0,
      networkLatency: 0,
      avgResponseTime: 0,
      requestsPerSecond: 0,
    }
);

export const selectMonitoringInfo = createSelector(
  selectSystemInformation,
  (systemInformation) =>
    systemInformation?.monitoring || {
      healthCheckUrl: '/health',
      statusPageUrl: '/status',
      logLevel: 'info',
      metricsEnabled: true,
      alertingEnabled: true,
    }
);

export const selectSystemIntegrations = createSelector(
  selectSystemInformation,
  (systemInformation) =>
    systemInformation?.integrations || {
      paymentGateway: {
        provider: 'Stripe',
        status: 'active',
        lastSync: new Date().toISOString(),
      },
      emailService: {
        provider: 'SendGrid',
        status: 'active',
        lastSync: new Date().toISOString(),
      },
      smsService: {
        provider: 'Twilio',
        status: 'active',
        lastSync: new Date().toISOString(),
      },
    }
);

// Combined/Computed selectors
export const selectAllSettingsLoaded = createSelector(
  selectGeneralSettingsLoaded,
  selectUserPreferencesLoaded,
  selectSecuritySettingsLoaded,
  selectSystemInformationLoaded,
  (generalLoaded, userLoaded, securityLoaded, systemLoaded) =>
    generalLoaded && userLoaded && securityLoaded && systemLoaded
);

export const selectSettingsOverview = createSelector(
  selectGeneralSettings,
  selectUserPreferences,
  selectSecuritySettings,
  selectSystemInformation,
  (general, user, security, system) => ({
    general: {
      applicationName: general?.applicationName || 'Apex Application',
      version: general?.version || '1.0.0',
      environment: general?.environment || 'development',
      language: general?.defaultLanguage || 'en',
      timezone: general?.timezone || 'UTC',
    },
    user: {
      theme: user?.theme || 'light',
      fontSize: user?.fontSize || 'medium',
      compactMode: user?.compactMode || false,
      notifications: user?.notifications?.email || true,
      pageSize: user?.tables?.defaultPageSize || 25,
    },
    security: {
      twoFactorEnabled: security?.twoFactorAuth?.enabled || false,
      sessionTimeout: security?.sessionManagement?.sessionTimeout || 60,
      passwordMinLength: security?.passwordPolicy?.minLength || 8,
      auditEnabled: security?.apiSecurity?.auditLogging || true,
    },
    system: {
      serverStatus: system?.server?.protocol || 'http',
      databaseStatus: system?.database?.status || 'unknown',
      uptime: system?.server?.uptime || 0,
      performance: {
        cpu: system?.performance?.cpuUsage || 0,
        memory: system?.performance?.memoryUsage || 0,
        disk: system?.performance?.diskUsage || 0,
      },
    },
  })
);

export const selectSecurityScore = createSelector(
  selectPasswordPolicy,
  selectTwoFactorAuth,
  selectSessionManagement,
  selectApiSecurity,
  (password, twoFactor, session, api) => {
    let score = 0;

    // Password policy score (0-25)
    if (password.minLength >= 8) score += 5;
    if (password.requireUppercase && password.requireLowercase) score += 5;
    if (password.requireNumbers) score += 5;
    if (password.requireSpecialChars) score += 5;
    if (password.maxAge <= 90 && password.maxAge > 0) score += 5;

    // Two-factor auth score (0-25)
    if (twoFactor.enabled) score += 15;
    if (twoFactor.required) score += 5;
    if (twoFactor.backupCodes) score += 5;

    // Session management score (0-25)
    if (session.sessionTimeout <= 120 && session.sessionTimeout > 0)
      score += 10;
    if (session.maxConcurrentSessions <= 5) score += 5;
    if (session.requireReauth) score += 10;

    // API security score (0-25)
    if (api.rateLimiting) score += 5;
    if (api.encryptionEnabled) score += 10;
    if (api.auditLogging) score += 5;
    if (api.corsEnabled && api.allowedOrigins.length > 0) score += 5;

    return Math.min(score, 100);
  }
);

// Export all selectors as a single object for convenience
export const SettingsSelectors = {
  // State
  selectSettingsState,
  selectSettingsLoading,
  selectSettingsError,
  selectSettingsLastUpdated,

  // General Settings
  selectGeneralSettings,
  selectGeneralSettingsLoaded,
  selectApplicationName,
  selectApplicationVersion,
  selectApplicationEnvironment,
  selectDefaultLanguage,
  selectDefaultCurrency,
  selectDateFormat,
  selectTimeFormat,
  selectTimeZone,
  selectCompanyInfo,
  selectFileUploadSettings,
  selectMaintenanceMode,

  // User Preferences
  selectUserPreferences,
  selectUserPreferencesLoaded,
  selectUserTheme,
  selectUserColors,
  selectUserDisplaySettings,
  selectUserNotificationSettings,
  selectUserDashboardSettings,
  selectUserTableSettings,
  selectUserAccessibilitySettings,
  selectAutoSaveSettings,

  // Security Settings
  selectSecuritySettings,
  selectSecuritySettingsLoaded,
  selectPasswordPolicy,
  selectSessionManagement,
  selectTwoFactorAuth,
  selectApiSecurity,
  selectDataProtection,

  // System Information
  selectSystemInformation,
  selectSystemInformationLoaded,
  selectServerInfo,
  selectDatabaseInfo,
  selectPerformanceMetrics,
  selectMonitoringInfo,
  selectSystemIntegrations,

  // Combined
  selectAllSettingsLoaded,
  selectSettingsOverview,
  selectSecurityScore,
};
