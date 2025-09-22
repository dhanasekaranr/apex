import { Routes } from '@angular/router';
import { DashboardStore } from '../data-access/dashboard.store';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../ui/dashboard').then((m) => m.Dashboard),
    providers: [DashboardStore],
    data: { breadcrumb: 'Dashboard', icon: 'dashboard' },
  },
];
