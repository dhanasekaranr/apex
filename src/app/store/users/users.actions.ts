import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from './users.state';

export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    // Load users
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: User[] }>(),
    'Load Users Failure': props<{ error: string }>(),

    // Add user
    'Add User': props<{ user: Omit<User, 'id'> }>(),
    'Add User Success': props<{ user: User }>(),
    'Add User Failure': props<{ error: string }>(),

    // Update user
    'Update User': props<{ user: User }>(),
    'Update User Success': props<{ user: User }>(),
    'Update User Failure': props<{ error: string }>(),

    // Delete user
    'Delete User': props<{ id: number }>(),
    'Delete User Success': props<{ id: number }>(),
    'Delete User Failure': props<{ error: string }>(),

    // Select user
    'Select User': props<{ user: User | null }>(),

    // Clear error
    'Clear Error': emptyProps(),
  },
});
