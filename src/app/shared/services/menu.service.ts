import { Injectable, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { NavigationActions, NavigationSelectors } from '../../store/navigation';
import { MenuSection, TopNavConfig } from '../interfaces/menu.interface';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private store = inject(Store);

  // Angular 20 Signals for reactive state
  private _isInitialized = signal(false);
  private _isLoading = signal(false);

  // Convert NgRx selectors to signals
  public topNavConfig = toSignal(
    this.store
      .select(NavigationSelectors.selectTopNavConfig)
      .pipe(filter((config) => !!config)),
    { initialValue: null }
  );

  public activeMenuTab = toSignal(
    this.store.select(NavigationSelectors.selectActiveMenuTab),
    { initialValue: 'dashboard' }
  );

  public menuSections = toSignal(
    this.store.select(NavigationSelectors.selectMenuSectionsByOrder),
    { initialValue: [] }
  );

  public actionButtons = toSignal(
    this.store.select(NavigationSelectors.selectActionButtonsByOrder),
    { initialValue: [] }
  );

  public isLoading = toSignal(
    this.store.select(NavigationSelectors.selectAnyLoading),
    { initialValue: false }
  );

  public error = toSignal(
    this.store.select(NavigationSelectors.selectAnyError),
    { initialValue: null }
  );

  public navigationOverview = toSignal(
    this.store.select(NavigationSelectors.selectNavigationOverview),
    { initialValue: null }
  );

  // Sidenav signals
  public sidenavMainItems = toSignal(
    this.store.select(NavigationSelectors.selectSidenavMainItems),
    { initialValue: [] }
  );

  public sidenavFooterItems = toSignal(
    this.store.select(NavigationSelectors.selectSidenavFooterItems),
    { initialValue: [] }
  );

  public sidenavConfig = toSignal(
    this.store.select(NavigationSelectors.selectSidenavConfig),
    { initialValue: null }
  );

  // Computed signals
  public isDataLoaded = computed(
    () => !!this.topNavConfig() && !!this.sidenavConfig()
  );
  public hasMenuSections = computed(() => this.menuSections().length > 0);
  public hasActionButtons = computed(() => this.actionButtons().length > 0);
  public hasSidenavItems = computed(() => this.sidenavMainItems().length > 0);
  public isInitialized = computed(() => this._isInitialized());

  // Observable getters for backward compatibility
  public topNavConfig$: Observable<TopNavConfig | null> = this.store.select(
    NavigationSelectors.selectTopNavConfig
  );

  public activeMenuTab$: Observable<string> = this.store.select(
    NavigationSelectors.selectActiveMenuTab
  );

  constructor() {
    this.initializeNavigation();
  }

  /**
   * Initialize navigation data from store
   */
  private initializeNavigation(): void {
    console.log('🔄 MenuService: Initializing navigation');

    // Prevent multiple initialization attempts
    if (this._isLoading() || this._isInitialized()) {
      console.log('⚠️ MenuService: Already initialized or loading, skipping');
      return;
    }

    this._isLoading.set(true);

    // Check if data is already loaded - use take(1) to prevent multiple subscriptions
    this.store
      .select(NavigationSelectors.selectAllNavigationDataLoaded)
      .pipe(
        take(1),
        filter((loaded) => !loaded)
      )
      .subscribe(() => {
        console.log(
          '📡 MenuService: Loading navigation data from API (single call)'
        );
        this.store.dispatch(NavigationActions.loadAllNavigationData());
      });

    this._isInitialized.set(true);
    this._isLoading.set(false);
  }

  /**
   * Get the current top navigation configuration (signal)
   */
  getTopNavConfig(): TopNavConfig | null {
    return this.topNavConfig();
  }

  /**
   * Add a new menu section
   */
  addMenuSection(section: MenuSection): void {
    console.log('➕ MenuService: Adding menu section:', section.id);
    this.store.dispatch(NavigationActions.addMenuSection({ section }));
  }

  /**
   * Remove a menu section by ID
   */
  removeMenuSection(sectionId: string): void {
    console.log('🗑️ MenuService: Removing menu section:', sectionId);
    this.store.dispatch(NavigationActions.removeMenuSection({ sectionId }));
  }

  /**
   * Update a specific menu section
   */
  updateMenuSection(sectionId: string, section: Partial<MenuSection>): void {
    console.log('✏️ MenuService: Updating menu section:', sectionId);
    this.store.dispatch(
      NavigationActions.updateMenuSection({ sectionId, section })
    );
  }

  /**
   * Set the active menu tab
   */
  setActiveMenuTab(tabId: string): void {
    console.log('🎯 MenuService: Setting active menu tab:', tabId);
    this.store.dispatch(NavigationActions.setActiveMenuTab({ tabId }));
  }

  /**
   * Get the current active menu tab (signal)
   */
  getActiveMenuTab(): string {
    return this.activeMenuTab();
  }

  /**
   * Refresh navigation data from server
   */
  refreshNavigationData(): void {
    console.log('🔄 MenuService: Refreshing navigation data');
    this.store.dispatch(NavigationActions.refreshNavigationData());
  }

  /**
   * Clear navigation cache
   */
  clearCache(): void {
    console.log('🗑️ MenuService: Clearing navigation cache');
    this.store.dispatch(NavigationActions.clearNavigationCache());
  }
}
