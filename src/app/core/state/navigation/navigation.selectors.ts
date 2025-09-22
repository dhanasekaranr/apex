import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NavigationState } from './navigation.state';

// Feature selector
export const selectNavigationState =
  createFeatureSelector<NavigationState>('navigation');

// Loading State Selectors
export const selectNavigationLoading = createSelector(
  selectNavigationState,
  (state: NavigationState) => state.navigationLoading
);

export const selectSidenavLoading = createSelector(
  selectNavigationState,
  (state: NavigationState) => state.sidenavLoading
);

export const selectBreadcrumbLoading = createSelector(
  selectNavigationState,
  (state: NavigationState) => state.breadcrumbLoading
);

export const selectAnyLoading = createSelector(
  selectNavigationLoading,
  selectSidenavLoading,
  selectBreadcrumbLoading,
  (navLoading, sidenavLoading, breadcrumbLoading) =>
    navLoading || sidenavLoading || breadcrumbLoading
);

// Error State Selectors
export const selectNavigationError = createSelector(
  selectNavigationState,
  (state: NavigationState) => state.navigationError
);

export const selectSidenavError = createSelector(
  selectNavigationState,
  (state: NavigationState) => state.sidenavError
);

export const selectBreadcrumbError = createSelector(
  selectNavigationState,
  (state: NavigationState) => state.breadcrumbError
);

export const selectAnyError = createSelector(
  selectNavigationError,
  selectSidenavError,
  selectBreadcrumbError,
  (navError, sidenavError, breadcrumbError) =>
    navError || sidenavError || breadcrumbError
);

// Configuration Selectors
export const selectNavigationConfig = createSelector(
  selectNavigationState,
  (state: NavigationState) => state.navigationConfig
);

export const selectSidenavConfig = createSelector(
  selectNavigationState,
  (state: NavigationState) => state.sidenavConfig
);

export const selectBreadcrumbConfig = createSelector(
  selectNavigationState,
  (state: NavigationState) => state.breadcrumbConfig
);

// Data Loaded Selectors
export const selectNavigationConfigLoaded = createSelector(
  selectNavigationConfig,
  (navigationConfig) => !!navigationConfig
);

export const selectBreadcrumbConfigLoaded = createSelector(
  selectBreadcrumbConfig,
  (breadcrumbConfig) => !!breadcrumbConfig
);

export const selectSidenavConfigLoaded = createSelector(
  selectSidenavConfig,
  (config) => !!config
);

export const selectAllNavigationDataLoaded = createSelector(
  selectNavigationConfigLoaded,
  selectSidenavConfigLoaded,
  selectBreadcrumbConfigLoaded,
  (navLoaded, sidenavLoaded, breadcrumbLoaded) =>
    navLoaded && sidenavLoaded && breadcrumbLoaded
);

// Menu Selectors
export const selectTopNavConfig = createSelector(
  selectNavigationConfig,
  (navigationConfig) => navigationConfig?.config || null
);

export const selectMenuSections = createSelector(
  selectTopNavConfig,
  (config) => config?.menuSections || []
);

export const selectActionButtons = createSelector(
  selectTopNavConfig,
  (config) => config?.actionButtons || []
);

export const selectActiveMenuTab = createSelector(
  selectNavigationState,
  (state: NavigationState) => state.activeMenuTab
);

// Breadcrumb Selectors
export const selectCurrentBreadcrumbs = createSelector(
  selectNavigationState,
  (state: NavigationState) => state.currentBreadcrumbs
);

export const selectSelectedBreadcrumbStyle = createSelector(
  selectNavigationState,
  (state: NavigationState) => state.selectedBreadcrumbStyle
);

export const selectBreadcrumbRouteMappings = createSelector(
  selectBreadcrumbConfig,
  (breadcrumbConfig) => breadcrumbConfig?.routeMappings || {}
);

export const selectBreadcrumbStyles = createSelector(
  selectBreadcrumbConfig,
  (breadcrumbConfig) => breadcrumbConfig?.styles || []
);

export const selectDefaultBreadcrumbStyle = createSelector(
  selectBreadcrumbStyles,
  (styles) => styles.find((style) => style.isDefault)?.id || 'default'
);

// Menu Section Selectors
export const selectMenuSectionById = (sectionId: string) =>
  createSelector(selectMenuSections, (sections) =>
    sections.find((section) => section.id === sectionId)
  );

export const selectMenuSectionsByOrder = createSelector(
  selectMenuSections,
  (sections) => [...sections].sort((a, b) => a.order - b.order)
);

// Action Button Selectors
export const selectActionButtonById = (buttonId: string) =>
  createSelector(selectActionButtons, (buttons) =>
    buttons.find((button) => button.id === buttonId)
  );

export const selectActionButtonsByOrder = createSelector(
  selectActionButtons,
  (buttons) => [...buttons].sort((a, b) => a.order - b.order)
);

// Combined Data Selectors
export const selectNavigationOverview = createSelector(
  selectNavigationState,
  (state) => ({
    hasNavigationConfig: !!state.navigationConfig,
    hasBreadcrumbConfig: !!state.breadcrumbConfig,
    totalMenuSections: state.navigationConfig?.config.menuSections.length || 0,
    totalActionButtons:
      state.navigationConfig?.config.actionButtons.length || 0,
    currentBreadcrumbsCount: state.currentBreadcrumbs.length,
    activeTab: state.activeMenuTab,
    selectedStyle: state.selectedBreadcrumbStyle,
    lastUpdated: state.lastUpdated,
    isLoading: state.navigationLoading || state.breadcrumbLoading,
    hasErrors: !!(state.navigationError || state.breadcrumbError),
  })
);

// Route Helper Selectors
export const selectRouteLabel = (route: string) =>
  createSelector(
    selectBreadcrumbRouteMappings,
    (routeMappings) => routeMappings[route]?.label || route
  );

export const selectRouteIcon = (route: string) =>
  createSelector(
    selectBreadcrumbRouteMappings,
    (routeMappings) => routeMappings[route]?.icon
  );

export const selectIsHomeRoute = (route: string) =>
  createSelector(
    selectBreadcrumbRouteMappings,
    (routeMappings) => routeMappings[route]?.isHome || false
  );

// Sidenav Selectors
export const selectSidenavSections = createSelector(
  selectSidenavConfig,
  (config) => config?.config?.sidenavSections || []
);

export const selectSidenavSectionsByOrder = createSelector(
  selectSidenavSections,
  (sections) => [...sections].sort((a, b) => a.order - b.order)
);

export const selectSidenavMainItems = createSelector(
  selectSidenavSectionsByOrder,
  (sections) =>
    sections.find((section) => section.id === 'main-navigation')?.items || []
);

export const selectSidenavFooterItems = createSelector(
  selectSidenavSectionsByOrder,
  (sections) =>
    sections.find((section) => section.id === 'footer-navigation')?.items || []
);

// Data Loading Selectors (consolidated above in original location)

// Updated loading state selector
export const selectNavigationLoadingState = createSelector(
  selectNavigationLoading,
  selectSidenavLoading,
  selectBreadcrumbLoading,
  selectNavigationError,
  selectSidenavError,
  selectBreadcrumbError,
  selectAllNavigationDataLoaded,
  (
    navLoading,
    sidenavLoading,
    breadcrumbLoading,
    navError,
    sidenavError,
    breadcrumbError,
    dataLoaded
  ) => ({
    loading: navLoading || sidenavLoading || breadcrumbLoading,
    hasErrors: !!(navError || sidenavError || breadcrumbError),
    dataLoaded,
  })
);

// Last Updated Selector
export const selectLastUpdated = createSelector(
  selectNavigationState,
  (state: NavigationState) => state.lastUpdated
);
