// Environment configuration for development
export const environment = {
  production: false,
  environmentName: 'development',

  // API Configuration
  api: {
    baseUrl: 'http://localhost:3001',
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
    enableDebugMode: true,
    enableAnalytics: false,
    enableExperimentalFeatures: true,
  },

  // Logging Configuration
  logging: {
    level: 'debug', // 'error', 'warn', 'info', 'debug'
    enableConsoleLogging: true,
    enableRemoteLogging: false,
    logApiCalls: true,
    logStateChanges: true,
  },

  // Performance Settings
  performance: {
    enableServiceWorker: false,
    enableLazyLoading: true,
    cacheTimeout: 300000, // 5 minutes
    debounceTime: 300, // milliseconds
  },

  // UI Configuration
  ui: {
    theme: 'material3',
    enableAnimations: true,
    sidenavMode: 'side', // 'over' | 'push' | 'side'
    defaultPageSize: 10,
    maxPageSize: 100,
  },

  // Security Settings
  security: {
    sessionTimeout: 3600000, // 1 hour in milliseconds
    enableCSRF: false,
    requireHTTPS: false,
  },
};
