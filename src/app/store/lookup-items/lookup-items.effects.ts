import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { LookupItemsActions } from './lookup-items.actions';
import { LookupItem } from './lookup-items.state';

@Injectable()
export class LookupItemsEffects {
  private apiUrl = 'http://localhost:3001/lookupItems';
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  loadLookupItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LookupItemsActions.loadLookupItems),
      exhaustMap(() => {
        console.log('🔄 Loading lookup items from API:', this.apiUrl);
        return this.http.get<LookupItem[]>(this.apiUrl).pipe(
          map((lookupItems) => {
            console.log(
              '✅ Lookup items loaded successfully:',
              lookupItems.length,
              'items'
            );
            return LookupItemsActions.loadLookupItemsSuccess({ lookupItems });
          }),
          catchError((error) => {
            console.error('❌ Error loading lookup items:', error);
            return of(
              LookupItemsActions.loadLookupItemsFailure({
                error: error.message || 'Failed to load lookup items',
              })
            );
          })
        );
      })
    )
  );

  loadByCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LookupItemsActions.loadByCategory),
      exhaustMap(({ category }) =>
        this.http.get<LookupItem[]>(`${this.apiUrl}?category=${category}`).pipe(
          map((lookupItems) =>
            LookupItemsActions.loadByCategorySuccess({ lookupItems })
          ),
          catchError((error) =>
            of(
              LookupItemsActions.loadByCategoryFailure({ error: error.message })
            )
          )
        )
      )
    )
  );

  addLookupItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LookupItemsActions.addLookupItem),
      exhaustMap(({ item }) =>
        this.http.post<LookupItem>(this.apiUrl, item).pipe(
          map((newItem) =>
            LookupItemsActions.addLookupItemSuccess({ item: newItem })
          ),
          catchError((error) =>
            of(
              LookupItemsActions.addLookupItemFailure({ error: error.message })
            )
          )
        )
      )
    )
  );

  updateLookupItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LookupItemsActions.updateLookupItem),
      exhaustMap(({ item }) =>
        this.http.put<LookupItem>(`${this.apiUrl}/${item.id}`, item).pipe(
          map((updatedItem) =>
            LookupItemsActions.updateLookupItemSuccess({ item: updatedItem })
          ),
          catchError((error) =>
            of(
              LookupItemsActions.updateLookupItemFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );

  deleteLookupItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LookupItemsActions.deleteLookupItem),
      exhaustMap(({ id }) =>
        this.http.delete(`${this.apiUrl}/${id}`).pipe(
          map(() => LookupItemsActions.deleteLookupItemSuccess({ id })),
          catchError((error) =>
            of(
              LookupItemsActions.deleteLookupItemFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );
}
