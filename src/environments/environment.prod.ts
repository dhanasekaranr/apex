// Environment configuration for production
export const environment = {
  production: true,
  environmentName: 'production',

  // API Configuration
  api: {
    baseUrl: 'https://api.yourdomain.com', // Replace with your production API URL
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
  },

  // Feature Flags
  features: {
    enableNotifications: true,
    enableBreadcrumbs: true,
    enableUserManagement: true,
    enableLookupManagement: true,
    enableDashboard: true,
    enableDebugMode: false,
    enableAnalytics: true,
    enableExperimentalFeatures: false,
  },

  // Logging Configuration
  logging: {
    level: 'error', // Only log errors in production
    enableConsoleLogging: false,
    enableRemoteLogging: true,
    logApiCalls: false,
    logStateChanges: false,
  },

  // Performance Settings
  performance: {
    enableServiceWorker: true,
    enableLazyLoading: true,
    cacheTimeout: 3600000, // 1 hour
    debounceTime: 500, // milliseconds
  },

  // UI Configuration
  ui: {
    theme: 'material3',
    enableAnimations: true,
    sidenavMode: 'over', // Better for mobile
    defaultPageSize: 25,
    maxPageSize: 100,
  },

  // Security Settings
  security: {
    sessionTimeout: 1800000, // 30 minutes in production
    enableCSRF: true,
    requireHTTPS: true,
  },
};
