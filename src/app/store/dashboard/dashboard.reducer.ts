import { createReducer, on } from '@ngrx/store';
import { DashboardActions } from './dashboard.actions';
import { DashboardState, initialDashboardState, SystemActivity } from './dashboard.state';

export const dashboardReducer = createReducer(
  initialDashboardState,
  
  // Load dashboard data
  on(DashboardActions.loadDashboardData, DashboardActions.refreshDashboard, (state): DashboardState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(DashboardActions.loadDashboardDataSuccess, (state, { dashboardData }): DashboardState => ({
    ...state,
    dashboardData,
    loading: false,
    error: null,
    lastRefresh: new Date().toISOString(),
  })),

  on(DashboardActions.loadDashboardDataFailure, (state, { error }): DashboardState => ({
    ...state,
    loading: false,
    error,
  })),

  // Clear error
  on(DashboardActions.clearError, (state): DashboardState => ({
    ...state,
    error: null,
  })),

  // Update single stat (for real-time updates)
  on(DashboardActions.updateStat, (state, { title, value, trend }): DashboardState => {
    if (!state.dashboardData) return state;

    // Since stats is now an object, we need to update the specific property
    let updatedStats = { ...state.dashboardData.stats };
    
    switch (title) {
      case 'Active Users':
        updatedStats.activeUsers = typeof value === 'number' ? value : parseInt(value) || 0;
        break;
      case 'System Modules':
        updatedStats.systemModules = typeof value === 'number' ? value : parseInt(value) || 0;
        break;
      case 'Lookup Items':
        updatedStats.lookupItems = typeof value === 'number' ? value : parseInt(value) || 0;
        break;
      case 'Active Sessions':
        updatedStats.activeSessions = typeof value === 'number' ? value : parseInt(value) || 0;
        break;
    }

    return {
      ...state,
      dashboardData: {
        ...state.dashboardData,
        stats: updatedStats,
      },
    };
  }),

  // Add new activity (for real-time updates)
  on(DashboardActions.addActivity, (state, { activity }): DashboardState => {
    if (!state.dashboardData) return state;

    const newActivity: SystemActivity = {
      ...activity,
      id: (Math.max(...state.dashboardData.activities.map(a => parseInt(a.id))) + 1).toString(),
    };

    return {
      ...state,
      dashboardData: {
        ...state.dashboardData,
        activities: [newActivity, ...state.dashboardData.activities].slice(0, 20), // Keep only latest 20 activities
      },
    };
  })
);