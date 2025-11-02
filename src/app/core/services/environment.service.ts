import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Environment Service
 * Provides centralized access to environment configuration
 */
@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  // Direct access to environment object
  get config() {
    return environment;
  }

  // API Configuration
  get apiBaseUrl(): string {
    return environment.api.baseUrl;
  }

  get apiTimeout(): number {
    return environment.api.timeout;
  }

  get retryAttempts(): number {
    return environment.api.retryAttempts;
  }

  // Utility method to build full API URLs
  buildApiUrl(endpoint: string): string {
    return `${this.apiBaseUrl}${endpoint}`;
  }

  // Environment Information
  get isProduction(): boolean {
    return environment.production;
  }

  get isDevelopment(): boolean {
    return !environment.production;
  }

  get environmentName(): string {
    return environment.environmentName;
  }

  // Feature Flags
  isFeatureEnabled(feature: keyof typeof environment.features): boolean {
    return environment.features[feature];
  }

  get enabledFeatures(): string[] {
    return Object.entries(environment.features)
      .filter(([_, enabled]) => enabled)
      .map(([feature, _]) => feature);
  }

  // Logging Configuration
  get logLevel(): string {
    return environment.logging.level;
  }

  get enableConsoleLogging(): boolean {
    return environment.logging.enableConsoleLogging;
  }

  get enableRemoteLogging(): boolean {
    return environment.logging.enableRemoteLogging;
  }

  get logApiCalls(): boolean {
    return environment.logging.logApiCalls;
  }

  get logStateChanges(): boolean {
    return environment.logging.logStateChanges;
  }

  // Performance Settings
  get enableServiceWorker(): boolean {
    return environment.performance.enableServiceWorker;
  }

  get cacheTimeout(): number {
    return environment.performance.cacheTimeout;
  }

  get debounceTime(): number {
    return environment.performance.debounceTime;
  }

  // UI Configuration
  get theme(): string {
    return environment.ui.theme;
  }

  get enableAnimations(): boolean {
    return environment.ui.enableAnimations;
  }

  get sidenavMode(): 'over' | 'push' | 'side' {
    return environment.ui.sidenavMode as 'over' | 'push' | 'side';
  }

  get defaultPageSize(): number {
    return environment.ui.defaultPageSize;
  }

  get maxPageSize(): number {
    return environment.ui.maxPageSize;
  }

  // Security Settings
  get sessionTimeout(): number {
    return environment.security.sessionTimeout;
  }

  get enableCSRF(): boolean {
    return environment.security.enableCSRF;
  }

  get requireHTTPS(): boolean {
    return environment.security.requireHTTPS;
  }

  // Utility Methods
  shouldLog(level: 'error' | 'warn' | 'info' | 'debug'): boolean {
    const levels = ['error', 'warn', 'info', 'debug'];
    const currentLevelIndex = levels.indexOf(environment.logging.level);
    const requestedLevelIndex = levels.indexOf(level);

    return requestedLevelIndex <= currentLevelIndex;
  }

  // DevTools Configuration
  get isReduxDevToolsEnabled(): boolean {
    return environment.devTools?.enableReduxDevTools ?? false;
  }

  get isConsoleDebuggingEnabled(): boolean {
    return environment.devTools?.enableConsoleDebugging ?? false;
  }

  get isPerformanceTrackingEnabled(): boolean {
    return environment.devTools?.enablePerformanceTracking ?? false;
  }

  get isStateExportEnabled(): boolean {
    return environment.devTools?.enableStateExport ?? false;
  }

  get storesToDebug(): string[] {
    return environment.devTools?.storesToDebug ?? [];
  }

  get maxHistorySize(): number {
    return environment.devTools?.maxHistorySize ?? 25;
  }

  /**
   * Check if a specific store should have debugging enabled
   */
  shouldDebugStore(storeName: string): boolean {
    if (!this.isReduxDevToolsEnabled) {
      return false;
    }
    
    const storesToDebug = this.storesToDebug;
    return storesToDebug.includes('*') || storesToDebug.includes(storeName);
  }

  /**
   * Get DevTools configuration for a specific store
   */
  getDevToolsConfig(storeName: string) {
    return {
      enabled: this.shouldDebugStore(storeName),
      console: this.isConsoleDebuggingEnabled,
      performance: this.isPerformanceTrackingEnabled,
      stateExport: this.isStateExportEnabled,
      maxHistory: this.maxHistorySize,
      name: `${storeName} (${environment.environmentName})`
    };
  }

  printEnvironmentInfo(): void {
    if (this.enableConsoleLogging) {
      console.group('🌍 Environment Configuration');
      console.log('📍 Environment:', this.environmentName);
      console.log('🔧 Production:', this.isProduction);
      console.log('🌐 API Base URL:', this.apiBaseUrl);
      console.log('🎯 Enabled Features:', this.enabledFeatures);
      console.log('📊 Log Level:', this.logLevel);
      console.log('🛠️ DevTools Config:', {
        reduxDevTools: this.isReduxDevToolsEnabled,
        consoleDebugging: this.isConsoleDebuggingEnabled,
        performanceTracking: this.isPerformanceTrackingEnabled,
        storesToDebug: this.storesToDebug
      });
      console.groupEnd();
    }
  }
}
