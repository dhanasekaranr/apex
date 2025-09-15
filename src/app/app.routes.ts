import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { LookupManagement } from './components/lookup-management/lookup-management';
import { Users } from './components/users/users';
import { DocumentationViewerComponent } from './pages/documentation/documentation-viewer.component';
import { Settings } from './pages/settings/settings';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: Dashboard,
    data: { breadcrumb: 'Dashboard', icon: 'dashboard' },
  },
  {
    path: 'users',
    component: Users,
    data: { breadcrumb: 'Users', icon: 'people' },
  },
  {
    path: 'reports',
    component: Dashboard,
    data: { breadcrumb: 'Reports', icon: 'assessment' },
  },
  {
    path: 'lookup-management',
    component: LookupManagement,
    data: { breadcrumb: 'Lookup Management', icon: 'manage_search' },
  },
  {
    path: 'settings/general',
    component: Settings,
    data: { breadcrumb: 'General Settings', icon: 'tune' },
  },
  {
    path: 'settings/preferences',
    component: Dashboard,
    data: { breadcrumb: 'User Preferences', icon: 'person_pin' },
  },
  {
    path: 'documentation',
    component: DocumentationViewerComponent,
    data: { breadcrumb: 'Documentation', icon: 'description' },
  },
  {
    path: 'documentation/:id',
    component: DocumentationViewerComponent,
    data: { breadcrumb: 'Documentation', icon: 'description' },
  },
  {
    path: 'help',
    redirectTo: '/documentation',
    pathMatch: 'full',
  },
  {
    path: 'support',
    component: Dashboard,
    data: { breadcrumb: 'Contact Support', icon: 'support_agent' },
  },
  {
    path: 'report-issue',
    component: Dashboard,
    data: { breadcrumb: 'Report Issue', icon: 'bug_report' },
  },
  { path: '**', redirectTo: '/dashboard' },
];
