import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../../shared/services/base-api.service';
import { DashboardData } from '../state/dashboard.state';

@Injectable({
  providedIn: 'root',
})
export class DashboardApiService extends BaseApiService {
  protected readonly endpoint = '/dashboard';

  getDashboardData(): Observable<DashboardData> {
    return this.get<DashboardData>();
  }

  refreshDashboard(): Observable<DashboardData> {
    return this.post<DashboardData>({}, '/refresh');
  }
}
