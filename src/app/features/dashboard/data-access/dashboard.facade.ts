import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardActions } from './state/dashboard.actions';
import {
  selectDashboardData,
  selectDashboardError,
  selectDashboardLoading,
  selectDashboardStats,
  selectRecentActivities,
  selectSystemHealth,
} from './state/dashboard.selectors';

@Injectable({
  providedIn: 'root',
})
export class DashboardFacade {
  private readonly store = inject(Store);

  // Selectors
  readonly dashboardData$ = this.store.select(selectDashboardData);
  readonly stats$ = this.store.select(selectDashboardStats);
  readonly recentActivities$ = this.store.select(selectRecentActivities);
  readonly systemHealth$ = this.store.select(selectSystemHealth);
  readonly isLoading$ = this.store.select(selectDashboardLoading);
  readonly error$ = this.store.select(selectDashboardError);

  // Actions
  loadDashboard(): void {
    this.store.dispatch(DashboardActions.loadDashboardData());
  }

  refreshDashboard(): void {
    this.store.dispatch(DashboardActions.refreshDashboard());
  }
}
