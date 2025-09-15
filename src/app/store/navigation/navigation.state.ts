import { BreadcrumbStyle } from '../../shared/components/breadcrumb/breadcrumb.component';

// Menu Interfaces
export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  routerLink?: string;
  action?: string;
  children?: MenuItem[];
  dividerAfter?: boolean;
  breadcrumbLabel?: string;
  breadcrumbIcon?: string;
  type?: 'item' | 'expandable' | 'divider';
  expanded?: boolean;
  disabled?: boolean;
  disabledReason?: string;
}

export interface MenuSection {
  id: string;
  label: string;
  order: number;
  breadcrumbLabel?: string;
  breadcrumbIcon?: string;
  items: MenuItem[];
}

export interface ActionButton {
  id: string;
  icon: string;
  tooltip: string;
  action: string;
  order: number;
}

export interface TopNavConfig {
  menuSections: MenuSection[];
  actionButtons: ActionButton[];
}

export interface SidenavSection {
  id: string;
  label: string;
  items: MenuItem[];
  order: number;
}

export interface SidenavConfig {
  sidenavSections: SidenavSection[];
}

// Breadcrumb Interfaces
export interface BreadcrumbItem {
  label: string;
  url: string;
  icon?: string;
}

export interface RouteMapping {
  label: string;
  icon?: string;
  isHome?: boolean;
  parentRoute?: string;
  order: number;
}

export interface BreadcrumbStyleConfig {
  id: string;
  label: string;
  description: string;
  isDefault?: boolean;
}

export interface BreadcrumbConfig {
  routeMappings: { [key: string]: RouteMapping };
  styles: BreadcrumbStyleConfig[];
}

// Navigation Configuration from JSON
export interface NavigationConfiguration {
  id: string;
  version: string;
  lastUpdated: string;
  config: TopNavConfig;
}

export interface SidenavConfiguration {
  id: string;
  version: string;
  lastUpdated: string;
  config: SidenavConfig;
}

export interface BreadcrumbConfiguration {
  id: string;
  version: string;
  lastUpdated: string;
  routeMappings: { [key: string]: RouteMapping };
  styles: BreadcrumbStyleConfig[];
}

// NgRx State
export interface NavigationState {
  // Navigation Data
  navigationConfig: NavigationConfiguration | null;
  sidenavConfig: SidenavConfiguration | null;
  breadcrumbConfig: BreadcrumbConfiguration | null;

  // Current State
  activeMenuTab: string;
  currentBreadcrumbs: BreadcrumbItem[];
  selectedBreadcrumbStyle: BreadcrumbStyle;

  // Loading States
  navigationLoading: boolean;
  sidenavLoading: boolean;
  breadcrumbLoading: boolean;

  // Error States
  navigationError: string | null;
  sidenavError: string | null;
  breadcrumbError: string | null;

  // Cache Control
  lastUpdated: string | null;
}

// Initial State
export const initialNavigationState: NavigationState = {
  navigationConfig: null,
  sidenavConfig: null,
  breadcrumbConfig: null,
  activeMenuTab: 'dashboard',
  currentBreadcrumbs: [],
  selectedBreadcrumbStyle: 'default',
  navigationLoading: false,
  sidenavLoading: false,
  breadcrumbLoading: false,
  navigationError: null,
  sidenavError: null,
  breadcrumbError: null,
  lastUpdated: null,
};
