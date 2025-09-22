import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from './users.state';

export const selectUsersFeature = createFeatureSelector<UsersState>('users');

export const selectUsers = createSelector(
  selectUsersFeature,
  (state: UsersState) => state.users
);

export const selectUsersLoading = createSelector(
  selectUsersFeature,
  (state: UsersState) => state.loading
);

export const selectUsersError = createSelector(
  selectUsersFeature,
  (state: UsersState) => state.error
);

export const selectSelectedUser = createSelector(
  selectUsersFeature,
  (state: UsersState) => state.selectedUser
);

export const selectUserById = (id: number) =>
  createSelector(selectUsers, (users) => users.find((user) => user.id === id));

export const selectUsersCount = createSelector(
  selectUsers,
  (users) => users.length
);

export const selectActiveUsers = createSelector(selectUsers, (users) =>
  users.filter((user) => user.status === 'Active')
);

export const selectUsersByRole = (role: string) =>
  createSelector(selectUsers, (users) =>
    users.filter((user) => user.userRole === role)
  );
