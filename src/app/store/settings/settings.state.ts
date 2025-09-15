// General Settings
export interface GeneralSettings {
  id: string;
  applicationName: string;
  version: string;
  environment: string;
  defaultLanguage: string;
  defaultCurrency: string;
  dateFormat: string;
  timeFormat: string;
  timezone: string;
  companyName: string;
  companyLogo: string;
  supportEmail: string;
  supportPhone: string;
  maxFileUploadSize: number;
  allowedFileTypes: string[];
  maintenanceMode: boolean;
  maintenanceMessage: string;
  lastUpdated: string;
  updatedBy: string;
}

// User Preferences
export interface NotificationSettings {
  email: boolean;
  browser: boolean;
  sound: boolean;
  desktop: boolean;
}

export interface DashboardSettings {
  showWelcome: boolean;
  defaultView: string;
  refreshInterval: number;
  showQuickActions: boolean;
  compactCards: boolean;
}

export interface TableSettings {
  defaultPageSize: number;
  showDensity: string;
  stickyHeader: boolean;
  showColumnResize: boolean;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}

export interface UserPreferences {
  id: string;
  theme: string;
  primaryColor: string;
  accentColor: string;
  fontSize: string;
  compactMode: boolean;
  showAnimations: boolean;
  autoSave: boolean;
  autoSaveInterval: number;
  notifications: NotificationSettings;
  dashboard: DashboardSettings;
  tables: TableSettings;
  accessibility: AccessibilitySettings;
  lastUpdated: string;
  updatedBy: string;
}

// Security Settings
export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxAge: number;
  preventReuse: number;
  lockoutThreshold: number;
  lockoutDuration: number;
}

export interface SessionManagement {
  timeoutWarning: number;
  sessionTimeout: number;
  maxConcurrentSessions: number;
  requireReauth: boolean;
  rememberMe: boolean;
  rememberMeDuration: number;
}

export interface TwoFactorAuth {
  enabled: boolean;
  methods: string[];
  defaultMethod: string;
  backupCodes: boolean;
  required: boolean;
}

export interface ApiSecurity {
  rateLimiting: boolean;
  maxRequestsPerMinute: number;
  corsEnabled: boolean;
  allowedOrigins: string[];
  encryptionEnabled: boolean;
  auditLogging: boolean;
}

export interface DataProtection {
  dataRetentionPeriod: number;
  automaticBackup: boolean;
  backupFrequency: string;
  encryptData: boolean;
  anonymizeData: boolean;
}

export interface SecuritySettings {
  id: string;
  passwordPolicy: PasswordPolicy;
  sessionManagement: SessionManagement;
  twoFactorAuth: TwoFactorAuth;
  apiSecurity: ApiSecurity;
  dataProtection: DataProtection;
  lastUpdated: string;
  updatedBy: string;
}

// System Information
export interface ServerInfo {
  hostname: string;
  ipAddress: string;
  port: number;
  protocol: string;
  uptime: number;
  lastRestart: string;
}

export interface DatabaseInfo {
  type: string;
  version: string;
  host: string;
  port: number;
  name: string;
  connectionPool: number;
  status: string;
}

export interface PerformanceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  avgResponseTime: number;
  requestsPerSecond: number;
}

export interface MonitoringInfo {
  healthCheckUrl: string;
  statusPageUrl: string;
  logLevel: string;
  metricsEnabled: boolean;
  alertingEnabled: boolean;
}

export interface IntegrationStatus {
  provider: string;
  status: string;
  lastSync: string;
}

export interface SystemIntegrations {
  paymentGateway: IntegrationStatus;
  emailService: IntegrationStatus;
  smsService: IntegrationStatus;
}

export interface SystemInformation {
  id: string;
  server: ServerInfo;
  database: DatabaseInfo;
  performance: PerformanceMetrics;
  monitoring: MonitoringInfo;
  integrations: SystemIntegrations;
  lastUpdated: string;
}

// Root Settings State
export interface SettingsState {
  generalSettings: GeneralSettings | null;
  userPreferences: UserPreferences | null;
  securitySettings: SecuritySettings | null;
  systemInformation: SystemInformation | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}
