import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { UsersActions } from './state/users.actions';
import {
  selectActiveUsers,
  selectSelectedUser,
  selectUsers,
  selectUsersCount,
  selectUsersError,
  selectUsersLoading,
} from './state/users.selectors';
import { User } from './state/users.state';

@Injectable({
  providedIn: 'root',
})
export class UsersFacade {
  private readonly store = inject(Store);

  // Selectors
  readonly users$ = this.store.select(selectUsers);
  readonly selectedUser$ = this.store.select(selectSelectedUser);
  readonly usersCount$ = this.store.select(selectUsersCount);
  readonly activeUsers$ = this.store.select(selectActiveUsers);
  readonly isLoading$ = this.store.select(selectUsersLoading);
  readonly error$ = this.store.select(selectUsersError);

  // Actions
  loadUsers(): void {
    this.store.dispatch(UsersActions.loadUsers());
  }

  selectUser(user: User | null): void {
    this.store.dispatch(UsersActions.selectUser({ user }));
  }

  addUser(user: User): void {
    this.store.dispatch(UsersActions.addUser({ user }));
  }

  updateUser(user: User): void {
    this.store.dispatch(UsersActions.updateUser({ user }));
  }

  deleteUser(id: number): void {
    this.store.dispatch(UsersActions.deleteUser({ id }));
  }

  clearError(): void {
    this.store.dispatch(UsersActions.clearError());
  }
}
