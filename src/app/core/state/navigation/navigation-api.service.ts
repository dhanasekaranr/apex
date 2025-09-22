import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvironmentService } from '../../services/environment.service';
import {
  BreadcrumbConfiguration,
  NavigationConfiguration,
  SidenavConfiguration,
} from './navigation.state';

@Injectable({
  providedIn: 'root',
})
export class NavigationApiService {
  private http = inject(HttpClient);
  private envService = inject(EnvironmentService);

  // API Endpoints for navigation service
  private readonly endpoints = {
    navigation: '/navigation',
    breadcrumb: '/breadcrumb',
  };

  // Load all navigation data
  loadAllNavigationData(): Observable<{
    navigationConfig: NavigationConfiguration;
    sidenavConfig: SidenavConfiguration;
    breadcrumbConfig: BreadcrumbConfiguration;
  }> {
    if (this.envService.logApiCalls) {
      console.log('🔄 NavigationApiService: Loading all navigation data');
      console.log(
        '🌐 Navigation URL:',
        this.envService.buildApiUrl(this.endpoints.navigation)
      );
      console.log(
        '🍞 Breadcrumb URL:',
        this.envService.buildApiUrl(this.endpoints.breadcrumb)
      );
    }

    return forkJoin({
      // Single call to get both navigation and sidenav configs
      navigationData: this.http.get<any[]>(
        this.envService.buildApiUrl(this.endpoints.navigation)
      ),
      breadcrumbConfig: this.loadBreadcrumbConfig(),
    }).pipe(
      map(({ navigationData, breadcrumbConfig }) => {
        // Find the main navigation configuration
        const navigationConfig = navigationData.find(
          (config) => config.id === 'main-navigation'
        );
        if (!navigationConfig) {
          throw new Error('Main navigation configuration not found');
        }

        // Find the sidenav configuration
        const sidenavConfig = navigationData.find(
          (config) => config.id === 'sidenav-configuration'
        );
        if (!sidenavConfig) {
          throw new Error('Sidenav configuration not found');
        }

        const result = {
          navigationConfig: navigationConfig as NavigationConfiguration,
          sidenavConfig: sidenavConfig as SidenavConfiguration,
          breadcrumbConfig,
        };

        if (this.envService.logApiCalls) {
          console.log(
            '✅ NavigationApiService: All navigation data loaded successfully'
          );
        }

        return result;
      })
    );
  }

  // NOTE: Individual load methods removed - loadAllNavigationData() now handles
  // both navigation and sidenav configs in a single optimized call

  // Load breadcrumb configuration
  loadBreadcrumbConfig(): Observable<BreadcrumbConfiguration> {
    if (this.envService.logApiCalls) {
      console.log('🔄 NavigationApiService: Loading breadcrumb configuration');
    }

    return this.http
      .get<BreadcrumbConfiguration[]>(
        this.envService.buildApiUrl(this.endpoints.breadcrumb)
      )
      .pipe(
        map((response) => {
          if (this.envService.logApiCalls) {
            console.log(
              '✅ NavigationApiService: Breadcrumb configuration loaded'
            );
          }
          return response[0]; // Get first configuration
        })
      );
  }
}
