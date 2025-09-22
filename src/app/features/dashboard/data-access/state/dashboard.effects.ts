import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { DashboardActions } from './dashboard.actions';
import { DashboardData } from './dashboard.state';

@Injectable()
export class DashboardEffects {
  private apiUrl = 'http://localhost:3001/dashboard';
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  loadDashboardData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        DashboardActions.loadDashboardData,
        DashboardActions.refreshDashboard
      ),
      switchMap(() =>
        this.http.get<DashboardData>(this.apiUrl).pipe(
          map((dashboardData) =>
            DashboardActions.loadDashboardDataSuccess({ dashboardData })
          ),
          catchError((error) =>
            of(
              DashboardActions.loadDashboardDataFailure({
                error: error.message || 'Failed to load dashboard data',
              })
            )
          )
        )
      )
    );
  });
}
