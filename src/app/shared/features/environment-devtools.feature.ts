import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import { withHooks } from '@ngrx/signals';
import { EnvironmentService } from '../../core/services/environment.service';

/**
 * Environment-aware DevTools feature for Signal Stores
 * Uses environment configuration instead of isDevMode()
 *
 * Usage:
 * export const MyStore = signalStore(
 *   { providedIn: 'root' },
 *   withState(initialState),
 *   withComputed(...),
 *   withMethods(...),
 *   withEnvironmentDevTools('MyStoreName') // 🎯 Environment-controlled debugging!
 * );
 */
export function withEnvironmentDevTools(storeName: string) {
  return [
    // Conditionally apply DevTools based on environment
    ...(() => {
      const envService = inject(EnvironmentService);
      const config = envService.getDevToolsConfig(storeName);

      if (!config.enabled) {
        return []; // No debugging in this environment
      }

      return [
        // Apply NgRx Toolkit DevTools
        withDevtools(storeName),

        // Add environment-aware debugging hooks
        withHooks((storeInstance: any) => ({
          onInit() {
            if (config.console) {
              console.log(
                `🏪 ${config.name} initialized with environment-controlled debugging`
              );
              console.log(`🔧 Config:`, config);
            }

            // Performance tracking if enabled
            if (config.performance) {
              console.time(`${storeName} initialization`);
              console.timeEnd(`${storeName} initialization`);
            }

            // Manual Redux DevTools connection with environment-specific settings
            if (
              typeof window !== 'undefined' &&
              (window as any).__REDUX_DEVTOOLS_EXTENSION__
            ) {
              try {
                const devtools = (
                  window as any
                ).__REDUX_DEVTOOLS_EXTENSION__.connect({
                  name: config.name,
                  instanceId: `${storeName.toLowerCase()}-env`,
                  maxAge: config.maxHistory,
                  features: {
                    pause: true,
                    lock: true,
                    persist: config.stateExport,
                    export: config.stateExport,
                    import: config.stateExport,
                    jump: true,
                    skip: true,
                    reorder: true,
                    dispatch: true,
                    test: true,
                  },
                });

                // Get current state dynamically
                const currentState: Record<string, any> = {};

                // Extract all state properties safely
                Object.keys(storeInstance).forEach((key) => {
                  if (typeof storeInstance[key] === 'function') {
                    try {
                      const value = storeInstance[key]();
                      if (typeof value !== 'function') {
                        currentState[key] = value;
                      }
                    } catch (e) {
                      // Skip properties that can't be called
                    }
                  }
                });

                devtools.init(currentState);

                if (config.console) {
                  console.log(`🔗 ${config.name} connected to Redux DevTools`);
                }
              } catch (error) {
                if (config.console) {
                  console.warn(
                    `⚠️ ${config.name} DevTools connection failed:`,
                    error
                  );
                }
              }
            } else if (config.console) {
              console.warn(
                `⚠️ ${config.name}: Redux DevTools extension not found`
              );
            }
          },

          onDestroy() {
            if (config.console) {
              console.log(`🏪 ${config.name} destroyed`);
            }
          },
        })),
      ];
    })(),
  ];
}

/**
 * Simplified version that only applies DevTools if enabled in environment
 */
export function withConditionalDevTools(storeName: string) {
  return withHooks((store) => {
    const envService = inject(EnvironmentService);

    return {
      onInit() {
        if (envService.shouldDebugStore(storeName)) {
          const config = envService.getDevToolsConfig(storeName);

          if (config.console) {
            console.log(
              `🏪 ${config.name} initialized (environment-controlled)`
            );
          }

          // Manual Redux DevTools connection
          if (
            typeof window !== 'undefined' &&
            (window as any).__REDUX_DEVTOOLS_EXTENSION__
          ) {
            try {
              const devtools = (
                window as any
              ).__REDUX_DEVTOOLS_EXTENSION__.connect({
                name: config.name,
                instanceId: `${storeName.toLowerCase()}-env`,
                maxAge: config.maxHistory,
              });

              // Get current state dynamically (only capture signals, skip methods)
              const currentState: Record<string, any> = {};

              // Common method names to skip (rxMethods and action methods)
              const methodNamesToSkip = new Set([
                'loadUsers',
                'addUser',
                'updateUser',
                'deleteUser',
                'selectUser',
                'clearError',
                'reset',
                'load',
                'loadAll',
                'create',
                'update',
                'remove',
                'delete',
                'refresh',
                'save',
                'fetch',
                'initialize',
                'loadAllNavigationData',
                'loadNavigationConfig',
                'loadSidenavConfig',
                'loadBreadcrumbConfig',
                'setActiveTab',
                'updateBreadcrumbs',
                'setBreadcrumbStyle',
                'loadNotifications',
                'loadConfiguration',
                'markAsRead',
                'markAllAsRead',
                'deleteNotification',
                'updateSettings',
                'applyFilters',
                'setSortOptions',
                'loadCategories',
                'loadTypes',
                'loadDashboardData',
                'refreshDashboard',
                'loadGeneralSettings',
                'updateGeneralSettings',
                'loadUserPreferences',
                'updateUserPreferences',
                'loadSecuritySettings',
                'updateSecuritySettings',
                'loadSystemInformation',
                'loadLookupItems',
                'addLookupItem',
                'updateLookupItem',
                'deleteLookupItem',
              ]);

              Object.keys(store).forEach((key) => {
                // Skip known method names
                if (methodNamesToSkip.has(key)) {
                  return;
                }

                if (typeof store[key] === 'function') {
                  try {
                    // Try to call the function to see if it's a signal
                    const value = store[key]();

                    // Only include if it's a signal (returns a non-function, non-undefined value)
                    if (value !== undefined && typeof value !== 'function') {
                      currentState[key] = value;
                    }
                  } catch (e) {
                    // Skip properties that throw errors when called
                  }
                }
              });

              devtools.init(currentState);

              if (config.console) {
                console.log(`🔗 ${config.name} connected to Redux DevTools`);
              }
            } catch (error) {
              if (config.console) {
                console.warn(
                  `⚠️ ${config.name} DevTools connection failed:`,
                  error
                );
              }
            }
          }
        }
      },
    };
  });
}

/**
 * Get environment-specific DevTools configuration
 */
export function getDevToolsConfig(storeName: string) {
  const envService = inject(EnvironmentService);
  return envService.getDevToolsConfig(storeName);
}
