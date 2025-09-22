import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/feature/dashboard.routes').then(
        (m) => m.DASHBOARD_ROUTES
      ),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./features/users/feature/users.routes').then(
        (m) => m.USERS_ROUTES
      ),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./features/dashboard/feature/dashboard.routes').then(
        (m) => m.DASHBOARD_ROUTES
      ),
    data: { breadcrumb: 'Reports', icon: 'assessment' },
  },
  {
    path: 'lookup-management',
    loadChildren: () =>
      import(
        './features/lookup-management/feature/lookup-management.routes'
      ).then((m) => m.LOOKUP_MANAGEMENT_ROUTES),
  },
  {
    path: 'settings',
    children: [
      {
        path: 'general',
        loadComponent: () =>
          import('./features/settings/ui/settings').then((m) => m.Settings),
        data: { breadcrumb: 'General Settings', icon: 'tune' },
      },
      {
        path: 'preferences',
        loadChildren: () =>
          import('./features/dashboard/feature/dashboard.routes').then(
            (m) => m.DASHBOARD_ROUTES
          ),
        data: { breadcrumb: 'User Preferences', icon: 'person_pin' },
      },
    ],
  },
  {
    path: 'documentation',
    loadComponent: () =>
      import('./features/documentation/ui/documentation-viewer.component').then(
        (m) => m.DocumentationViewerComponent
      ),
    data: { breadcrumb: 'Documentation', icon: 'description' },
  },
  {
    path: 'documentation/:id',
    loadComponent: () =>
      import('./features/documentation/ui/documentation-viewer.component').then(
        (m) => m.DocumentationViewerComponent
      ),
    data: { breadcrumb: 'Documentation', icon: 'description' },
  },
  {
    path: 'help',
    redirectTo: '/documentation',
    pathMatch: 'full',
  },
  {
    path: 'support',
    loadChildren: () =>
      import('./features/dashboard/feature/dashboard.routes').then(
        (m) => m.DASHBOARD_ROUTES
      ),
    data: { breadcrumb: 'Contact Support', icon: 'support_agent' },
  },
  {
    path: 'report-issue',
    loadChildren: () =>
      import('./features/dashboard/feature/dashboard.routes').then(
        (m) => m.DASHBOARD_ROUTES
      ),
    data: { breadcrumb: 'Report Issue', icon: 'bug_report' },
  },
  { path: '**', redirectTo: '/dashboard' },
];
