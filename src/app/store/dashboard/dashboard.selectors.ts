import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardState } from './dashboard.state';

export const selectDashboardState = createFeatureSelector<DashboardState>('dashboard');

export const selectDashboardData = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.dashboardData
);

export const selectDashboardStats = createSelector(
  selectDashboardData,
  (dashboardData) => {
    // Always return an array, even if data is null/undefined
    if (!dashboardData?.stats) {
      return [];
    }
    
    const stats = dashboardData.stats;
    return [
      {
        title: 'Active Users',
        value: stats.activeUsers?.toString() || '0',
        icon: 'people',
        color: '#4CAF50'
      },
      {
        title: 'System Modules',
        value: stats.systemModules?.toString() || '0',
        icon: 'widgets',
        color: '#2196F3'
      },
      {
        title: 'Lookup Items',
        value: stats.lookupItems?.toString() || '0',
        icon: 'list_alt',
        color: '#FF9800'
      },
      {
        title: 'Active Sessions',
        value: stats.activeSessions?.toString() || '0',
        icon: 'login',
        color: '#9C27B0'
      }
    ];
  }
);

export const selectRecentActivities = createSelector(
  selectDashboardData,
  (dashboardData) => dashboardData?.activities || []
);

export const selectSystemHealth = createSelector(
  selectDashboardData,
  (dashboardData) => dashboardData?.systemHealth || null
);

export const selectDashboardLoading = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.loading
);

export const selectDashboardError = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.error
);

export const selectLastRefresh = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.lastRefresh
);

export const selectLastUpdated = createSelector(
  selectDashboardState,
  (state) => state.lastRefresh
);

// Computed selectors
export const selectCriticalActivities = createSelector(
  selectRecentActivities,
  (activities) => activities.filter(
    (activity) => activity.type === 'warning' || activity.type === 'error'
  )
);

export const selectSystemHealthMetrics = createSelector(
  selectSystemHealth,
  (systemHealth) => {
    if (!systemHealth) return [];
    return [
      { name: 'CPU Usage', value: systemHealth.cpuUsage, unit: '%', threshold: 80 },
      { name: 'Memory Usage', value: systemHealth.memoryUsage, unit: '%', threshold: 85 },
      { name: 'Disk Space', value: systemHealth.diskSpace, unit: '%', threshold: 90 },
      { name: 'Network Latency', value: systemHealth.networkLatency, unit: 'ms', threshold: 100 }
    ];
  }
);

export const selectCriticalHealthMetrics = createSelector(
  selectSystemHealthMetrics,
  (metrics) => metrics.filter(metric => metric.value > metric.threshold)
);