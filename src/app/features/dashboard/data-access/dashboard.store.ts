import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { DashboardApiService } from './api/dashboard-api.service';
import { DashboardData, DashboardStat } from './state/dashboard.state';

// Define the state interface
interface DashboardState {
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string | null;
  lastRefresh: string | null;
}

// Initial state
const initialState: DashboardState = {
  dashboardData: null,
  loading: false,
  error: null,
  lastRefresh: null,
};

export const DashboardStore = signalStore(
  { providedIn: 'root' },

  // Define state
  withState(initialState),

  // Define computed signals
  withComputed(({ dashboardData, loading, error }) => ({
    // Stats computed signals
    stats: computed(() =>
      dashboardData()?.stats
        ? ([
            {
              title: 'Active Users',
              value: dashboardData()!.stats.activeUsers,
              icon: 'people',
              color: 'primary',
              trend: { value: 12, isPositive: true },
            },
            {
              title: 'System Modules',
              value: dashboardData()!.stats.systemModules,
              icon: 'extension',
              color: 'accent',
              trend: { value: 5, isPositive: true },
            },
            {
              title: 'Lookup Items',
              value: dashboardData()!.stats.lookupItems,
              icon: 'list',
              color: 'warn',
            },
            {
              title: 'Active Sessions',
              value: dashboardData()!.stats.activeSessions,
              icon: 'devices',
              color: 'primary',
              trend: { value: 8, isPositive: false },
            },
          ] as DashboardStat[])
        : []
    ),

    // Activities computed signals
    recentActivities: computed(() => dashboardData()?.activities || []),

    // System health computed signals
    systemHealth: computed(() => dashboardData()?.systemHealth || null),

    // Status computed signals
    hasData: computed(() => !!dashboardData()),
    hasError: computed(() => !!error()),
    isRefreshing: computed(() => loading()),

    // System health status computed signals
    cpuStatus: computed(() => {
      const health = dashboardData()?.systemHealth;
      if (!health) return 'unknown';
      return health.cpuUsage > 80
        ? 'critical'
        : health.cpuUsage > 60
        ? 'warning'
        : 'good';
    }),

    memoryStatus: computed(() => {
      const health = dashboardData()?.systemHealth;
      if (!health) return 'unknown';
      return health.memoryUsage > 85
        ? 'critical'
        : health.memoryUsage > 70
        ? 'warning'
        : 'good';
    }),

    diskStatus: computed(() => {
      const health = dashboardData()?.systemHealth;
      if (!health) return 'unknown';
      return health.diskSpace > 90
        ? 'critical'
        : health.diskSpace > 75
        ? 'warning'
        : 'good';
    }),
  })),

  // Define methods
  withMethods((store, dashboardApi = inject(DashboardApiService)) => ({
    // Load dashboard data
    loadDashboard: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          dashboardApi.getDashboardData().pipe(
            tap((dashboardData: DashboardData) => {
              console.log(
                '✅ Dashboard data loaded successfully:',
                dashboardData
              );
              patchState(store, {
                dashboardData,
                loading: false,
                error: null,
                lastRefresh: new Date().toISOString(),
              });
            }),
            catchError((error: any) => {
              console.error('❌ Error loading dashboard data:', error);
              patchState(store, {
                loading: false,
                error: error.message || 'Failed to load dashboard data',
              });
              return of(null);
            })
          )
        )
      )
    ),

    // Refresh dashboard data
    refreshDashboard: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          dashboardApi.refreshDashboard().pipe(
            tap((dashboardData: DashboardData) => {
              console.log(
                '✅ Dashboard data refreshed successfully:',
                dashboardData
              );
              patchState(store, {
                dashboardData,
                loading: false,
                error: null,
                lastRefresh: new Date().toISOString(),
              });
            }),
            catchError((error: any) => {
              console.error('❌ Error refreshing dashboard data:', error);
              patchState(store, {
                loading: false,
                error: error.message || 'Failed to refresh dashboard data',
              });
              return of(null);
            })
          )
        )
      )
    ),

    // Clear error state
    clearError(): void {
      patchState(store, { error: null });
    },

    // Reset state to initial values
    reset(): void {
      patchState(store, initialState);
    },

    // Update last refresh timestamp
    updateLastRefresh(): void {
      patchState(store, { lastRefresh: new Date().toISOString() });
    },
  }))
);
