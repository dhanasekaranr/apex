import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { UsersActions } from './users.actions';
import { User } from './users.state';

@Injectable()
export class UsersEffects {
  private apiUrl = 'http://localhost:3001/users';
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      exhaustMap(() => {
        console.log('🔄 Loading users from API:', this.apiUrl);
        return this.http.get<User[]>(this.apiUrl).pipe(
          map((users) => {
            console.log('✅ Users loaded successfully:', users.length, 'users');
            return UsersActions.loadUsersSuccess({ users });
          }),
          catchError((error) => {
            console.error('❌ Error loading users:', error);
            return of(
              UsersActions.loadUsersFailure({
                error: error.message || 'Failed to load users',
              })
            );
          })
        );
      })
    )
  );

  addUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.addUser),
      exhaustMap(({ user }) =>
        this.http.post<User>(this.apiUrl, user).pipe(
          map((newUser) => UsersActions.addUserSuccess({ user: newUser })),
          catchError((error) =>
            of(UsersActions.addUserFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      exhaustMap(({ user }) =>
        this.http.put<User>(`${this.apiUrl}/${user.id}`, user).pipe(
          map((updatedUser) =>
            UsersActions.updateUserSuccess({ user: updatedUser })
          ),
          catchError((error) =>
            of(UsersActions.updateUserFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deleteUser),
      exhaustMap(({ id }) =>
        this.http.delete(`${this.apiUrl}/${id}`).pipe(
          map(() => UsersActions.deleteUserSuccess({ id })),
          catchError((error) =>
            of(UsersActions.deleteUserFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
