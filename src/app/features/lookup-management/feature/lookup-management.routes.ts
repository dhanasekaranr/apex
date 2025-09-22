import { Routes } from '@angular/router';
import { LookupItemsStore } from '../data-access/lookup-items.store';

export const LOOKUP_MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../ui/lookup-management').then((m) => m.LookupManagement),
    providers: [LookupItemsStore],
    data: { breadcrumb: 'Lookup Management', icon: 'manage_search' },
  },
];
