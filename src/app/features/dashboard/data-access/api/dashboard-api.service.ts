import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardData } from '../state/dashboard.state';

@Injectable({
  providedIn: 'root',
})
export class DashboardApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3001';

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.baseUrl}/dashboard`);
  }

  refreshDashboard(): Observable<DashboardData> {
    return this.http.post<DashboardData>(
      `${this.baseUrl}/dashboard/refresh`,
      {}
    );
  }
}
