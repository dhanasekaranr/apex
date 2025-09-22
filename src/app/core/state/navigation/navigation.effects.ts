import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin, of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { NavigationActions } from './navigation.actions';
import {
  BreadcrumbConfiguration,
  BreadcrumbItem,
  NavigationConfiguration,
  SidenavConfiguration,
} from './navigation.state';

@Injectable()
export class NavigationEffects {
  private apiUrl = 'http://localhost:3001';
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  // Load Navigation Configuration
  loadNavigationConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavigationActions.loadNavigationConfig),
      exhaustMap(() => {
        console.log('🔄 Loading navigation configuration from API');

        return this.http
          .get<NavigationConfiguration[]>(`${this.apiUrl}/navigation`)
          .pipe(
            map((response) => {
              console.log('✅ Navigation configuration loaded successfully');
              return NavigationActions.loadNavigationConfigSuccess({
                navigationConfig: response[0], // Get first configuration
              });
            }),
            catchError((error) => {
              console.error(
                '❌ Failed to load navigation configuration:',
                error
              );
              return of(
                NavigationActions.loadNavigationConfigFailure({
                  error: `Failed to load navigation configuration: ${error.message}`,
                })
              );
            })
          );
      })
    )
  );

  // Load Breadcrumb Configuration
  loadBreadcrumbConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavigationActions.loadBreadcrumbConfig),
      exhaustMap(() => {
        console.log('🔄 Loading breadcrumb configuration from API');

        return this.http
          .get<BreadcrumbConfiguration[]>(`${this.apiUrl}/breadcrumb`)
          .pipe(
            map((response) => {
              console.log('✅ Breadcrumb configuration loaded successfully');
              return NavigationActions.loadBreadcrumbConfigSuccess({
                breadcrumbConfig: response[0], // Get first configuration
              });
            }),
            catchError((error) => {
              console.error(
                '❌ Failed to load breadcrumb configuration:',
                error
              );
              return of(
                NavigationActions.loadBreadcrumbConfigFailure({
                  error: `Failed to load breadcrumb configuration: ${error.message}`,
                })
              );
            })
          );
      })
    )
  );

  // Load Sidenav Configuration
  loadSidenavConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavigationActions.loadSidenavConfig),
      exhaustMap(() => {
        console.log('🔄 Loading sidenav configuration from API');

        return this.http
          .get<SidenavConfiguration[]>(`${this.apiUrl}/navigation`)
          .pipe(
            map((response) => {
              console.log('✅ Sidenav configuration loaded successfully');
              // Find the sidenav configuration by id
              const sidenavConfig = response.find(
                (config) => config.id === 'sidenav-configuration'
              );
              if (!sidenavConfig) {
                throw new Error('Sidenav configuration not found');
              }
              return NavigationActions.loadSidenavConfigSuccess({
                sidenavConfig,
              });
            }),
            catchError((error) => {
              console.error('❌ Failed to load sidenav configuration:', error);
              return of(
                NavigationActions.loadSidenavConfigFailure({
                  error: `Failed to load sidenav configuration: ${error.message}`,
                })
              );
            })
          );
      })
    )
  );

  // Load All Navigation Data
  loadAllNavigationData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavigationActions.loadAllNavigationData),
      exhaustMap(() => {
        console.log('🔄 Loading all navigation data from API');

        // Load navigation, sidenav, and breadcrumb configurations in parallel
        const navigation$ = this.http.get<NavigationConfiguration[]>(
          `${this.apiUrl}/navigation`
        );
        const breadcrumb$ = this.http.get<BreadcrumbConfiguration[]>(
          `${this.apiUrl}/breadcrumb`
        );

        return forkJoin({
          navigation: navigation$,
          breadcrumb: breadcrumb$,
        }).pipe(
          map((responses) => {
            console.log('✅ All navigation data loaded successfully');
            // Find navigation config (top nav) and sidenav config from the navigation endpoint
            const navigationConfig = responses.navigation.find(
              (config) => config.id === 'main-navigation'
            ) as NavigationConfiguration;
            const sidenavConfigRaw = responses.navigation.find(
              (config) => config.id === 'sidenav-configuration'
            );
            const sidenavConfig =
              sidenavConfigRaw as unknown as SidenavConfiguration;

            if (!navigationConfig) {
              throw new Error('Navigation configuration not found');
            }
            if (!sidenavConfig) {
              throw new Error('Sidenav configuration not found');
            }

            return NavigationActions.loadAllNavigationDataSuccess({
              navigationConfig,
              sidenavConfig,
              breadcrumbConfig: responses.breadcrumb[0],
            });
          }),
          catchError((error) => {
            console.error('❌ Failed to load navigation data:', error);
            return of(
              NavigationActions.loadAllNavigationDataFailure({
                error: `Failed to load navigation data: ${error.message}`,
              })
            );
          })
        );
      })
    )
  );

  // Build Breadcrumbs From Route
  buildBreadcrumbsFromRoute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavigationActions.buildBreadcrumbsFromRoute),
      map(({ url }) => {
        console.log(`🔄 Building breadcrumbs for route: ${url}`);

        const urlSegments = url.split('/').filter((segment) => segment);
        const breadcrumbs: BreadcrumbItem[] = [];

        // Always add Dashboard as first breadcrumb
        breadcrumbs.push({
          label: 'Dashboard',
          url: '/dashboard',
          icon: 'dashboard',
        });

        // Build breadcrumbs from URL segments
        let currentUrl = '';
        urlSegments.forEach((segment, index) => {
          currentUrl += `/${segment}`;

          // Skip if this is the dashboard route (already added)
          if (segment === 'dashboard') {
            return;
          }

          // Format segment for display
          const formatSegment = (seg: string): string => {
            return seg
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
          };

          breadcrumbs.push({
            label: formatSegment(segment),
            url: currentUrl,
            icon: this.getIconForRoute(segment),
          });
        });

        console.log('✅ Breadcrumbs built:', breadcrumbs);
        return NavigationActions.updateBreadcrumbs({ breadcrumbs });
      })
    )
  );

  // Refresh Navigation Data
  refreshNavigationData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavigationActions.refreshNavigationData),
      map(() => {
        console.log('🔄 Refreshing navigation data');
        return NavigationActions.loadAllNavigationData();
      })
    )
  );

  /**
   * Get icon for a route segment
   */
  private getIconForRoute(route: string): string | undefined {
    const routeIcons: { [key: string]: string } = {
      dashboard: 'dashboard',
      analytics: 'analytics',
      users: 'people',
      products: 'inventory',
      orders: 'shopping_cart',
      reports: 'assessment',
      'lookup-management': 'manage_search',
      settings: 'settings',
      general: 'tune',
      preferences: 'person_pin',
      security: 'security',
      documentation: 'help_center',
      help: 'help',
      audit: 'history',
    };

    return routeIcons[route];
  }
}
