import { Injectable, computed, inject, signal } from '@angular/core';
import { NavigationStore } from '../../core/state/navigation/navigation.store';
import { MenuSection, TopNavConfig } from '../interfaces/menu.interface';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private navigationStore = inject(NavigationStore);

  // Angular 20 Signals for reactive state
  private _isInitialized = signal(false);
  private _isLoading = signal(false);

  // Direct signal access from NavigationStore
  public topNavConfig = computed(
    () => this.navigationStore.navigationConfig()?.config || null
  );
  public activeMenuTab = this.navigationStore.activeTab;
  public menuSections = this.navigationStore.menuSections;
  public actionButtons = this.navigationStore.actionButtons;
  public isLoading = this.navigationStore.isLoading;
  public error = this.navigationStore.error;

  public navigationOverview = computed(() => ({
    hasNavigationConfig: !!this.navigationStore.navigationConfig(),
    hasSidenavConfig: !!this.navigationStore.sidenavConfig(),
    totalMenuSections: this.navigationStore.totalMenuSections(),
    totalActionButtons: this.navigationStore.totalActionButtons(),
    totalSidenavSections: this.navigationStore.totalSidenavSections(),
  }));

  // Sidenav signals
  public sidenavMainItems = this.navigationStore.sidenavSections;
  public sidenavFooterItems = computed(() => [] as any[]); // Computed empty for now
  public sidenavConfig = this.navigationStore.sidenavConfig;

  // Computed signals
  public isDataLoaded = this.navigationStore.isLoaded;
  public hasMenuSections = computed(() => this.menuSections().length > 0);
  public hasActionButtons = computed(() => this.actionButtons().length > 0);
  public hasSidenavItems = computed(() => this.sidenavMainItems().length > 0);
  public isInitialized = computed(() => this._isInitialized());

  constructor() {
    this.initializeNavigation();
  }

  /**
   * Initialize navigation data from store
   */
  private initializeNavigation(): void {
    // Prevent multiple initialization attempts
    if (this._isLoading() || this._isInitialized()) {
      return;
    }

    // Check if NavigationStore is already loading to prevent duplicate calls
    if (this.navigationStore.isLoading()) {
      this._isInitialized.set(true);
      return;
    }

    // Check if data is already loaded
    if (this.navigationStore.isLoaded()) {
      this._isInitialized.set(true);
      return;
    }

    this._isLoading.set(true);
    this.navigationStore.loadAllNavigationData();

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
    this.navigationStore.addMenuSection(section);
  }

  /**
   * Remove a menu section by ID
   */
  removeMenuSection(sectionId: string): void {
    console.log('🗑️ MenuService: Removing menu section:', sectionId);
    this.navigationStore.removeMenuSection(sectionId);
  }

  /**
   * Update a specific menu section
   */
  updateMenuSection(sectionId: string, section: Partial<MenuSection>): void {
    console.log('✏️ MenuService: Updating menu section:', sectionId);
    this.navigationStore.updateMenuSection(sectionId, section);
  }

  /**
   * Set the active menu tab
   */
  setActiveMenuTab(tabId: string): void {
    console.log('🎯 MenuService: Setting active menu tab:', tabId);
    this.navigationStore.setActiveMenuTab(tabId);
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
    this.navigationStore.refreshNavigationData();
  }

  /**
   * Clear navigation cache
   */
  clearCache(): void {
    console.log('🗑️ MenuService: Clearing navigation cache');
    this.navigationStore.clearNavigationCache();
  }
}
