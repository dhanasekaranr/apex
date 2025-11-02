import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, filter, pipe, switchMap, tap } from 'rxjs';
import { BreadcrumbStyle } from '../../../shared/ui/breadcrumb/breadcrumb.component';
import { NavigationApiService } from './navigation-api.service';
import {
  ActionButton,
  BreadcrumbConfiguration,
  BreadcrumbItem,
  MenuSection,
  NavigationConfiguration,
  SidenavConfiguration,
  SidenavSection,
} from './navigation.state';

// Signal Store State Interface
interface NavigationStoreState {
  // Navigation Data
  navigationConfig: NavigationConfiguration | null;
  sidenavConfig: SidenavConfiguration | null;
  breadcrumbConfig: BreadcrumbConfiguration | null;

  // Current State
  activeMenuTab: string;
  currentBreadcrumbs: BreadcrumbItem[];
  selectedBreadcrumbStyle: BreadcrumbStyle;

  // Loading States
  loading: boolean;
  navigationLoading: boolean;
  sidenavLoading: boolean;
  breadcrumbLoading: boolean;

  // Error States
  error: string | null;
  navigationError: string | null;
  sidenavError: string | null;
  breadcrumbError: string | null;

  // Cache Control
  lastUpdated: string | null;
}

// Initial State
const initialState: NavigationStoreState = {
  navigationConfig: null,
  sidenavConfig: null,
  breadcrumbConfig: null,
  activeMenuTab: 'dashboard',
  currentBreadcrumbs: [],
  selectedBreadcrumbStyle: 'default',
  loading: false,
  navigationLoading: false,
  sidenavLoading: false,
  breadcrumbLoading: false,
  error: null,
  navigationError: null,
  sidenavError: null,
  breadcrumbError: null,
  lastUpdated: null,
};

export const NavigationStore = signalStore(
  { providedIn: 'root' },

  // State
  withState(initialState),

  // Computed Signals
  withComputed((store) => ({
    // Navigation computed values
    menuSections: computed(
      () => store.navigationConfig()?.config?.menuSections || []
    ),

    actionButtons: computed(
      () => store.navigationConfig()?.config?.actionButtons || []
    ),

    sidenavSections: computed(
      () => store.sidenavConfig()?.config?.sidenavSections || []
    ),

    routeMappings: computed(
      () => store.breadcrumbConfig()?.routeMappings || {}
    ),

    breadcrumbStyles: computed(() => store.breadcrumbConfig()?.styles || []),

    // Status computed values
    isLoaded: computed(
      () =>
        !!store.navigationConfig() &&
        !!store.sidenavConfig() &&
        !!store.breadcrumbConfig()
    ),

    hasError: computed(
      () =>
        !!store.error() ||
        !!store.navigationError() ||
        !!store.sidenavError() ||
        !!store.breadcrumbError()
    ),

    isLoading: computed(
      () =>
        store.loading() ||
        store.navigationLoading() ||
        store.sidenavLoading() ||
        store.breadcrumbLoading()
    ),

    // Statistics
    totalMenuSections: computed(
      () => store.navigationConfig()?.config?.menuSections?.length || 0
    ),
    totalActionButtons: computed(
      () => store.navigationConfig()?.config?.actionButtons?.length || 0
    ),
    totalSidenavSections: computed(
      () => store.sidenavConfig()?.config?.sidenavSections?.length || 0
    ),
    totalBreadcrumbs: computed(() => store.currentBreadcrumbs().length),

    // Current state helpers
    activeTab: computed(() => store.activeMenuTab()),
    breadcrumbs: computed(() => store.currentBreadcrumbs()),
    breadcrumbStyle: computed(() => store.selectedBreadcrumbStyle()),
  })),

  // Methods
  withMethods((store, navigationApi = inject(NavigationApiService)) => ({
    // Load all navigation data
    loadAllNavigationData: rxMethod<void>(
      pipe(
        tap(() => {
          console.log('🔄 NavigationStore.loadAllNavigationData() called');
          console.log(
            '📊 Current state - loading:',
            store.loading(),
            'isLoaded:',
            store.isLoaded()
          );
        }),
        // Prevent duplicate calls if already loading or loaded
        filter(() => {
          const shouldProceed = !store.loading() && !store.isLoaded();
          if (!shouldProceed) {
            console.log(
              '⚠️ NavigationStore: Skipping duplicate call - already loading or loaded'
            );
          }
          return shouldProceed;
        }),
        tap(() => {
          console.log('✅ NavigationStore: Proceeding with API call');
          patchState(store, {
            loading: true,
            error: null,
            navigationError: null,
            sidenavError: null,
            breadcrumbError: null,
          });
        }),
        switchMap(() =>
          navigationApi.loadAllNavigationData().pipe(
            tap((data) => {
              patchState(store, {
                loading: false,
                navigationConfig: data.navigationConfig,
                sidenavConfig: data.sidenavConfig,
                breadcrumbConfig: data.breadcrumbConfig,
                lastUpdated: new Date().toISOString(),
              });
            }),
            catchError((error) => {
              console.error('❌ Failed to load navigation data:', error);
              patchState(store, {
                loading: false,
                error: `Failed to load navigation data: ${error.message}`,
              });
              return EMPTY;
            })
          )
        )
      )
    ),

    // NOTE: Individual load methods removed - loadAllNavigationData() now handles
    // both navigation and sidenav configs in a single optimized call

    // Load breadcrumb config only
    loadBreadcrumbConfig: rxMethod<void>(
      pipe(
        tap(() => {
          console.log('🔄 Loading breadcrumb configuration');
          patchState(store, { breadcrumbLoading: true, breadcrumbError: null });
        }),
        switchMap(() =>
          navigationApi.loadBreadcrumbConfig().pipe(
            tap((config) => {
              console.log('✅ Breadcrumb configuration loaded');
              patchState(store, {
                breadcrumbLoading: false,
                breadcrumbConfig: config,
              });
            }),
            catchError((error) => {
              console.error('❌ Failed to load breadcrumb config:', error);
              patchState(store, {
                breadcrumbLoading: false,
                breadcrumbError: `Failed to load breadcrumb config: ${error.message}`,
              });
              return EMPTY;
            })
          )
        )
      )
    ),

    // Active menu tab management
    setActiveMenuTab: (tabId: string) => {
      console.log('🎯 Setting active menu tab:', tabId);
      patchState(store, { activeMenuTab: tabId });
    },

    // Breadcrumb management
    updateBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => {
      console.log('🍞 Updating breadcrumbs:', breadcrumbs.length, 'items');
      patchState(store, { currentBreadcrumbs: breadcrumbs });
    },

    setBreadcrumbStyle: (style: BreadcrumbStyle) => {
      console.log('🎨 Setting breadcrumb style:', style);
      patchState(store, { selectedBreadcrumbStyle: style });
    },

    buildBreadcrumbsFromRoute: (url: string) => {
      const routeMappings = store.routeMappings();
      console.log('🍞 Building breadcrumbs for URL:', url);
      console.log('📋 Available route mappings:', Object.keys(routeMappings));

      const segments = url.split('/').filter(Boolean);
      const breadcrumbs: BreadcrumbItem[] = [];

      // Always add Dashboard as the first breadcrumb (home)
      if (routeMappings['dashboard']) {
        breadcrumbs.push({
          label: routeMappings['dashboard'].label,
          url: '/dashboard',
          icon: routeMappings['dashboard'].icon,
        });
        console.log('✅ Added Dashboard as home breadcrumb');
      }

      // Build breadcrumbs from URL segments (skip dashboard if it's already added)
      segments.forEach((segment, index) => {
        // Skip dashboard segment since we already added it as home
        if (segment === 'dashboard') {
          return;
        }

        // Check if this segment exists in route mappings (without leading /)
        if (routeMappings[segment]) {
          // Build the full URL path
          const urlPath = '/' + segments.slice(0, index + 1).join('/');

          breadcrumbs.push({
            label: routeMappings[segment].label,
            url: urlPath,
            icon: routeMappings[segment].icon,
          });
          console.log(
            '✅ Added breadcrumb:',
            routeMappings[segment].label,
            'for segment:',
            segment
          );
        } else {
          console.warn('⚠️ No mapping found for segment:', segment);
        }
      });

      console.log(
        '🍞 Final breadcrumbs:',
        breadcrumbs.length,
        'items:',
        breadcrumbs.map((b) => b.label)
      );
      patchState(store, { currentBreadcrumbs: breadcrumbs });
    },

    // Menu section management
    addMenuSection: (section: MenuSection) => {
      const currentConfig = store.navigationConfig();
      if (!currentConfig) return;

      const updatedSections = [...currentConfig.config.menuSections, section];
      const updatedConfig = {
        ...currentConfig,
        config: {
          ...currentConfig.config,
          menuSections: updatedSections,
        },
      };

      patchState(store, { navigationConfig: updatedConfig });
    },

    updateMenuSection: (sectionId: string, updates: Partial<MenuSection>) => {
      const currentConfig = store.navigationConfig();
      if (!currentConfig) return;

      const updatedSections = currentConfig.config.menuSections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      );

      const updatedConfig = {
        ...currentConfig,
        config: {
          ...currentConfig.config,
          menuSections: updatedSections,
        },
      };

      patchState(store, { navigationConfig: updatedConfig });
    },

    removeMenuSection: (sectionId: string) => {
      const currentConfig = store.navigationConfig();
      if (!currentConfig) return;

      const updatedSections = currentConfig.config.menuSections.filter(
        (section) => section.id !== sectionId
      );

      const updatedConfig = {
        ...currentConfig,
        config: {
          ...currentConfig.config,
          menuSections: updatedSections,
        },
      };

      patchState(store, { navigationConfig: updatedConfig });
    },

    // Action button management
    addActionButton: (button: ActionButton) => {
      const currentConfig = store.navigationConfig();
      if (!currentConfig) return;

      const updatedButtons = [...currentConfig.config.actionButtons, button];
      const updatedConfig = {
        ...currentConfig,
        config: {
          ...currentConfig.config,
          actionButtons: updatedButtons,
        },
      };

      patchState(store, { navigationConfig: updatedConfig });
    },

    updateActionButton: (buttonId: string, updates: Partial<ActionButton>) => {
      const currentConfig = store.navigationConfig();
      if (!currentConfig) return;

      const updatedButtons = currentConfig.config.actionButtons.map((button) =>
        button.id === buttonId ? { ...button, ...updates } : button
      );

      const updatedConfig = {
        ...currentConfig,
        config: {
          ...currentConfig.config,
          actionButtons: updatedButtons,
        },
      };

      patchState(store, { navigationConfig: updatedConfig });
    },

    removeActionButton: (buttonId: string) => {
      const currentConfig = store.navigationConfig();
      if (!currentConfig) return;

      const updatedButtons = currentConfig.config.actionButtons.filter(
        (button) => button.id !== buttonId
      );

      const updatedConfig = {
        ...currentConfig,
        config: {
          ...currentConfig.config,
          actionButtons: updatedButtons,
        },
      };

      patchState(store, { navigationConfig: updatedConfig });
    },

    // Sidenav management
    toggleSidenavMenuItem: (itemId: string) => {
      const currentConfig = store.sidenavConfig();
      if (!currentConfig) return;

      const updatedSections = currentConfig.config.sidenavSections.map(
        (section) => ({
          ...section,
          items: section.items.map((item) =>
            item.id === itemId ? { ...item, expanded: !item.expanded } : item
          ),
        })
      );

      const updatedConfig = {
        ...currentConfig,
        config: {
          ...currentConfig.config,
          sidenavSections: updatedSections,
        },
      };

      patchState(store, { sidenavConfig: updatedConfig });
    },

    setSidenavMenuItemExpanded: (itemId: string, expanded: boolean) => {
      const currentConfig = store.sidenavConfig();
      if (!currentConfig) return;

      const updatedSections = currentConfig.config.sidenavSections.map(
        (section) => ({
          ...section,
          items: section.items.map((item) =>
            item.id === itemId ? { ...item, expanded } : item
          ),
        })
      );

      const updatedConfig = {
        ...currentConfig,
        config: {
          ...currentConfig.config,
          sidenavSections: updatedSections,
        },
      };

      patchState(store, { sidenavConfig: updatedConfig });
    },

    addSidenavSection: (section: SidenavSection) => {
      const currentConfig = store.sidenavConfig();
      if (!currentConfig) return;

      const updatedSections = [
        ...currentConfig.config.sidenavSections,
        section,
      ];
      const updatedConfig = {
        ...currentConfig,
        config: {
          ...currentConfig.config,
          sidenavSections: updatedSections,
        },
      };

      patchState(store, { sidenavConfig: updatedConfig });
    },

    updateSidenavSection: (
      sectionId: string,
      updates: Partial<SidenavSection>
    ) => {
      const currentConfig = store.sidenavConfig();
      if (!currentConfig) return;

      const updatedSections = currentConfig.config.sidenavSections.map(
        (section) =>
          section.id === sectionId ? { ...section, ...updates } : section
      );

      const updatedConfig = {
        ...currentConfig,
        config: {
          ...currentConfig.config,
          sidenavSections: updatedSections,
        },
      };

      patchState(store, { sidenavConfig: updatedConfig });
    },

    // Cache management
    clearNavigationCache: () => {
      console.log('🗑️ Clearing navigation cache');
      patchState(store, {
        navigationConfig: null,
        sidenavConfig: null,
        breadcrumbConfig: null,
        lastUpdated: null,
      });
    },

    refreshNavigationData: () => {
      console.log('🔄 Refreshing navigation data');
      patchState(store, {
        navigationConfig: null,
        sidenavConfig: null,
        breadcrumbConfig: null,
        lastUpdated: null,
      });
      // Re-trigger loading through method access
      const methods = store as any;
      methods.loadAllNavigationData();
    },

    // Error management
    clearError: () => {
      patchState(store, {
        error: null,
        navigationError: null,
        sidenavError: null,
        breadcrumbError: null,
      });
    },

    clearNavigationError: () => {
      patchState(store, { navigationError: null });
    },

    clearSidenavError: () => {
      patchState(store, { sidenavError: null });
    },

    clearBreadcrumbError: () => {
      patchState(store, { breadcrumbError: null });
    },

    // Reset store
    reset: () => {
      patchState(store, initialState);
    },
  }))
);
