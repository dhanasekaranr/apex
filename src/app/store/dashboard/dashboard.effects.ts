import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { DataService } from '../../services/data.service';
import { DashboardActions } from './dashboard.actions';

@Injectable()
export class DashboardEffects {
  private actions$ = inject(Actions);
  private dataService = inject(DataService);

  loadDashboardData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DashboardActions.loadDashboardData, DashboardActions.refreshDashboard),
      switchMap(() =>
        this.dataService.getDashboardData().pipe(
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