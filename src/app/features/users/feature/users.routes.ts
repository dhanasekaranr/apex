import { Routes } from '@angular/router';
import { UsersStore } from '../data-access/users.store';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../ui/users').then((m) => m.Users),
    providers: [UsersStore],
    data: { breadcrumb: 'Users', icon: 'people' },
  },
];
