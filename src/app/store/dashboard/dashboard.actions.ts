import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DashboardData, SystemActivity } from './dashboard.state';

export const DashboardActions = createActionGroup({
  source: 'Dashboard',
  events: {
    // Load dashboard data
    'Load Dashboard Data': emptyProps(),
    'Load Dashboard Data Success': props<{ dashboardData: DashboardData }>(),
    'Load Dashboard Data Failure': props<{ error: string }>(),

    // Refresh dashboard
    'Refresh Dashboard': emptyProps(),

    // Clear error
    'Clear Error': emptyProps(),

    // Update single stat (for real-time updates)
    'Update Stat': props<{ title: string; value: string | number; trend?: { value: number; isPositive: boolean } }>(),

    // Add new activity (for real-time updates)
    'Add Activity': props<{ activity: Omit<SystemActivity, 'id'> }>(),
  },
});