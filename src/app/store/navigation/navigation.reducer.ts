import { createReducer, on } from '@ngrx/store';
import { MenuItem } from '../../shared/interfaces/menu.interface';
import { NavigationActions } from './navigation.actions';
import { initialNavigationState } from './navigation.state';

export const navigationReducer = createReducer(
  initialNavigationState,

  // Load Navigation Configuration
  on(NavigationActions.loadNavigationConfig, (state) => ({
    ...state,
    navigationLoading: true,
    navigationError: null,
  })),

  on(
    NavigationActions.loadNavigationConfigSuccess,
    (state, { navigationConfig }) => ({
      ...state,
      navigationConfig,
      navigationLoading: false,
      navigationError: null,
      lastUpdated: new Date().toISOString(),
    })
  ),

  on(NavigationActions.loadNavigationConfigFailure, (state, { error }) => ({
    ...state,
    navigationLoading: false,
    navigationError: error,
  })),

  // Load Breadcrumb Configuration
  on(NavigationActions.loadBreadcrumbConfig, (state) => ({
    ...state,
    breadcrumbLoading: true,
    breadcrumbError: null,
  })),

  on(
    NavigationActions.loadBreadcrumbConfigSuccess,
    (state, { breadcrumbConfig }) => ({
      ...state,
      breadcrumbConfig,
      breadcrumbLoading: false,
      breadcrumbError: null,
      lastUpdated: new Date().toISOString(),
    })
  ),

  on(NavigationActions.loadBreadcrumbConfigFailure, (state, { error }) => ({
    ...state,
    breadcrumbLoading: false,
    breadcrumbError: error,
  })),

  // Load Sidenav Configuration
  on(NavigationActions.loadSidenavConfig, (state) => ({
    ...state,
    sidenavLoading: true,
    sidenavError: null,
  })),

  on(
    NavigationActions.loadSidenavConfigSuccess,
    (state, { sidenavConfig }) => ({
      ...state,
      sidenavConfig,
      sidenavLoading: false,
      sidenavError: null,
      lastUpdated: new Date().toISOString(),
    })
  ),

  on(NavigationActions.loadSidenavConfigFailure, (state, { error }) => ({
    ...state,
    sidenavLoading: false,
    sidenavError: error,
  })),

  // Load All Navigation Data
  on(NavigationActions.loadAllNavigationData, (state) => ({
    ...state,
    navigationLoading: true,
    breadcrumbLoading: true,
    navigationError: null,
    breadcrumbError: null,
  })),

  on(
    NavigationActions.loadAllNavigationDataSuccess,
    (state, { navigationConfig, sidenavConfig, breadcrumbConfig }) => ({
      ...state,
      navigationConfig,
      sidenavConfig,
      breadcrumbConfig,
      navigationLoading: false,
      sidenavLoading: false,
      breadcrumbLoading: false,
      navigationError: null,
      sidenavError: null,
      breadcrumbError: null,
      lastUpdated: new Date().toISOString(),
    })
  ),

  on(NavigationActions.loadAllNavigationDataFailure, (state, { error }) => ({
    ...state,
    navigationLoading: false,
    sidenavLoading: false,
    breadcrumbLoading: false,
    navigationError: error,
    sidenavError: error,
    breadcrumbError: error,
  })),

  // Active Menu Tab Management
  on(NavigationActions.setActiveMenuTab, (state, { tabId }) => ({
    ...state,
    activeMenuTab: tabId,
  })),

  // Breadcrumb Management
  on(NavigationActions.updateBreadcrumbs, (state, { breadcrumbs }) => ({
    ...state,
    currentBreadcrumbs: breadcrumbs,
  })),

  on(NavigationActions.setBreadcrumbStyle, (state, { style }) => ({
    ...state,
    selectedBreadcrumbStyle: style,
  })),

  // Menu Configuration Updates
  on(NavigationActions.addMenuSection, (state, { section }) => {
    if (!state.navigationConfig) return state;

    const updatedConfig = {
      ...state.navigationConfig,
      config: {
        ...state.navigationConfig.config,
        menuSections: [
          ...state.navigationConfig.config.menuSections,
          section,
        ].sort((a, b) => a.order - b.order),
      },
    };

    return {
      ...state,
      navigationConfig: updatedConfig,
    };
  }),

  on(NavigationActions.removeMenuSection, (state, { sectionId }) => {
    if (!state.navigationConfig) return state;

    const updatedConfig = {
      ...state.navigationConfig,
      config: {
        ...state.navigationConfig.config,
        menuSections: state.navigationConfig.config.menuSections.filter(
          (s) => s.id !== sectionId
        ),
      },
    };

    return {
      ...state,
      navigationConfig: updatedConfig,
    };
  }),

  on(NavigationActions.updateMenuSection, (state, { sectionId, section }) => {
    if (!state.navigationConfig) return state;

    const updatedConfig = {
      ...state.navigationConfig,
      config: {
        ...state.navigationConfig.config,
        menuSections: state.navigationConfig.config.menuSections.map((s) =>
          s.id === sectionId ? { ...s, ...section } : s
        ),
      },
    };

    return {
      ...state,
      navigationConfig: updatedConfig,
    };
  }),

  // Action Button Management
  on(NavigationActions.addActionButton, (state, { button }) => {
    if (!state.navigationConfig) return state;

    const updatedConfig = {
      ...state.navigationConfig,
      config: {
        ...state.navigationConfig.config,
        actionButtons: [
          ...state.navigationConfig.config.actionButtons,
          button,
        ].sort((a, b) => a.order - b.order),
      },
    };

    return {
      ...state,
      navigationConfig: updatedConfig,
    };
  }),

  on(NavigationActions.removeActionButton, (state, { buttonId }) => {
    if (!state.navigationConfig) return state;

    const updatedConfig = {
      ...state.navigationConfig,
      config: {
        ...state.navigationConfig.config,
        actionButtons: state.navigationConfig.config.actionButtons.filter(
          (b) => b.id !== buttonId
        ),
      },
    };

    return {
      ...state,
      navigationConfig: updatedConfig,
    };
  }),

  on(NavigationActions.updateActionButton, (state, { buttonId, button }) => {
    if (!state.navigationConfig) return state;

    const updatedConfig = {
      ...state.navigationConfig,
      config: {
        ...state.navigationConfig.config,
        actionButtons: state.navigationConfig.config.actionButtons.map((b) =>
          b.id === buttonId ? { ...b, ...button } : b
        ),
      },
    };

    return {
      ...state,
      navigationConfig: updatedConfig,
    };
  }),

  // Sidenav Menu Management
  on(NavigationActions.toggleSidenavMenuItem, (state, { itemId }) => {
    if (!state.sidenavConfig) return state;

    const updateMenuItems = (items: MenuItem[]): MenuItem[] => {
      return items.map((item) => {
        if (item.id === itemId && item.type === 'expandable') {
          return { ...item, expanded: !item.expanded };
        }
        if (item.children) {
          return { ...item, children: updateMenuItems(item.children) };
        }
        return item;
      });
    };

    const updatedSections = state.sidenavConfig.config.sidenavSections.map(
      (section) => ({
        ...section,
        items: updateMenuItems(section.items),
      })
    );

    return {
      ...state,
      sidenavConfig: {
        ...state.sidenavConfig,
        config: {
          ...state.sidenavConfig.config,
          sidenavSections: updatedSections,
        },
      },
    };
  }),

  on(
    NavigationActions.setSidenavMenuItemExpanded,
    (state, { itemId, expanded }) => {
      if (!state.sidenavConfig) return state;

      const updateMenuItems = (items: MenuItem[]): MenuItem[] => {
        return items.map((item) => {
          if (item.id === itemId && item.type === 'expandable') {
            return { ...item, expanded };
          }
          if (item.children) {
            return { ...item, children: updateMenuItems(item.children) };
          }
          return item;
        });
      };

      const updatedSections = state.sidenavConfig.config.sidenavSections.map(
        (section) => ({
          ...section,
          items: updateMenuItems(section.items),
        })
      );

      return {
        ...state,
        sidenavConfig: {
          ...state.sidenavConfig,
          config: {
            ...state.sidenavConfig.config,
            sidenavSections: updatedSections,
          },
        },
      };
    }
  ),

  // Cache Management
  on(NavigationActions.clearNavigationCache, () => ({
    ...initialNavigationState,
  })),

  on(NavigationActions.refreshNavigationData, (state) => ({
    ...state,
    navigationConfig: null,
    sidenavConfig: null,
    breadcrumbConfig: null,
    navigationLoading: true,
    sidenavLoading: true,
    breadcrumbLoading: true,
    navigationError: null,
    sidenavError: null,
    breadcrumbError: null,
  }))
);
