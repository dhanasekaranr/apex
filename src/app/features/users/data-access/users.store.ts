import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { UsersApiService } from './api/users-api.service';
import { User } from './state/users.state';

// Define the state interface
interface UsersState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UsersState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

export const UsersStore = signalStore(
  { providedIn: 'root' },

  // Define state
  withState(initialState),

  // Define computed signals
  withComputed(({ users, selectedUser, error }) => ({
    usersCount: computed(() => users().length),
    activeUsers: computed(() =>
      users().filter((user) => user.status === 'Active')
    ),
    inactiveUsers: computed(() =>
      users().filter((user) => user.status === 'Inactive')
    ),
    suspendedUsers: computed(() =>
      users().filter((user) => user.status === 'Suspended')
    ),
    hasUsers: computed(() => users().length > 0),
    hasError: computed(() => !!error()),
  })),

  // Define methods
  withMethods((store, usersApi = inject(UsersApiService)) => ({
    // Load users from API
    loadUsers: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          usersApi.getUsers().pipe(
            tap((users: User[]) => {
              console.log(
                '✅ Users loaded successfully:',
                users.length,
                'users'
              );
              patchState(store, {
                users,
                loading: false,
                error: null,
              });
            }),
            catchError((error: any) => {
              console.error('❌ Error loading users:', error);
              patchState(store, {
                loading: false,
                error: error.message || 'Failed to load users',
              });
              return of([]);
            })
          )
        )
      )
    ),

    // Add a new user
    addUser: rxMethod<User>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((user) =>
          usersApi.addUser(user).pipe(
            tap((newUser: User) => {
              console.log('✅ User added successfully:', newUser);
              patchState(store, {
                users: [...store.users(), newUser],
                loading: false,
                error: null,
              });
            }),
            catchError((error: any) => {
              console.error('❌ Error adding user:', error);
              patchState(store, {
                loading: false,
                error: error.message || 'Failed to add user',
              });
              return of();
            })
          )
        )
      )
    ),

    // Update an existing user
    updateUser: rxMethod<User>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((user) =>
          usersApi.updateUser(user).pipe(
            tap((updatedUser: User) => {
              console.log('✅ User updated successfully:', updatedUser);
              const users = store
                .users()
                .map((u) => (u.id === updatedUser.id ? updatedUser : u));
              patchState(store, {
                users,
                selectedUser:
                  store.selectedUser()?.id === updatedUser.id
                    ? updatedUser
                    : store.selectedUser(),
                loading: false,
                error: null,
              });
            }),
            catchError((error: any) => {
              console.error('❌ Error updating user:', error);
              patchState(store, {
                loading: false,
                error: error.message || 'Failed to update user',
              });
              return of();
            })
          )
        )
      )
    ),

    // Delete a user
    deleteUser: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((id) =>
          usersApi.deleteUser(id).pipe(
            tap(() => {
              console.log('✅ User deleted successfully:', id);
              const users = store.users().filter((u) => u.id !== id);
              const selectedUser =
                store.selectedUser()?.id === id ? null : store.selectedUser();
              patchState(store, {
                users,
                selectedUser,
                loading: false,
                error: null,
              });
            }),
            catchError((error: any) => {
              console.error('❌ Error deleting user:', error);
              patchState(store, {
                loading: false,
                error: error.message || 'Failed to delete user',
              });
              return of();
            })
          )
        )
      )
    ),

    // Select a user (local state only)
    selectUser(user: User | null): void {
      patchState(store, { selectedUser: user });
    },

    // Clear error state
    clearError(): void {
      patchState(store, { error: null });
    },

    // Reset state to initial values
    reset(): void {
      patchState(store, initialState);
    },
  }))
);
