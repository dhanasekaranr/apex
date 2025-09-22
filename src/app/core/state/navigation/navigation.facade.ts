import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { NavigationActions } from './navigation.actions';
import {
  selectAnyError,
  selectAnyLoading,
  selectCurrentBreadcrumbs,
  selectMenuSections,
  selectNavigationConfig,
  selectSidenavConfig,
} from './navigation.selectors';

@Injectable({
  providedIn: 'root',
})
export class NavigationFacade {
  private readonly store = inject(Store);

  // Selectors
  readonly navigationConfig$ = this.store.select(selectNavigationConfig);
  readonly sidenavConfig$ = this.store.select(selectSidenavConfig);
  readonly breadcrumbs$ = this.store.select(selectCurrentBreadcrumbs);
  readonly menuSections$ = this.store.select(selectMenuSections);
  readonly isLoading$ = this.store.select(selectAnyLoading);
  readonly error$ = this.store.select(selectAnyError);

  // Actions
  loadNavigationConfig(): void {
    this.store.dispatch(NavigationActions.loadNavigationConfig());
  }

  loadBreadcrumbConfig(): void {
    this.store.dispatch(NavigationActions.loadBreadcrumbConfig());
  }

  loadSidenavConfig(): void {
    this.store.dispatch(NavigationActions.loadSidenavConfig());
  }
}
