import { createReducer, on } from '@ngrx/store';
import { UsersActions } from './users.actions';
import { UsersState } from './users.state';

export const initialUsersState: UsersState = {
  users: [],
  loading: false,
  error: null,
  selectedUser: null,
};

export const usersReducer = createReducer(
  initialUsersState,

  // Load users
  on(UsersActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false,
    error: null,
  })),

  on(UsersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add user
  on(UsersActions.addUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.addUserSuccess, (state, { user }) => ({
    ...state,
    users: [...state.users, user],
    loading: false,
    error: null,
  })),

  on(UsersActions.addUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update user
  on(UsersActions.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map((u) => (u.id === user.id ? user : u)),
    loading: false,
    error: null,
    selectedUser:
      state.selectedUser?.id === user.id ? user : state.selectedUser,
  })),

  on(UsersActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete user
  on(UsersActions.deleteUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.deleteUserSuccess, (state, { id }) => ({
    ...state,
    users: state.users.filter((user) => user.id !== id),
    loading: false,
    error: null,
    selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
  })),

  on(UsersActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Select user
  on(UsersActions.selectUser, (state, { user }) => ({
    ...state,
    selectedUser: user,
  })),

  // Clear error
  on(UsersActions.clearError, (state) => ({
    ...state,
    error: null,
  }))
);
