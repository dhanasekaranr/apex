import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { BreadcrumbStyle } from '../../../shared/ui/breadcrumb/breadcrumb.component';
import {
  ActionButton,
  BreadcrumbConfiguration,
  BreadcrumbItem,
  MenuSection,
  NavigationConfiguration,
  SidenavConfiguration,
  SidenavSection,
} from './navigation.state';

export const NavigationActions = createActionGroup({
  source: 'Navigation',
  events: {
    // Load Navigation Configuration
    'Load Navigation Config': emptyProps(),
    'Load Navigation Config Success': props<{
      navigationConfig: NavigationConfiguration;
    }>(),
    'Load Navigation Config Failure': props<{
      error: string;
    }>(),

    // Load Sidenav Configuration
    'Load Sidenav Config': emptyProps(),
    'Load Sidenav Config Success': props<{
      sidenavConfig: SidenavConfiguration;
    }>(),
    'Load Sidenav Config Failure': props<{
      error: string;
    }>(),

    // Load Breadcrumb Configuration
    'Load Breadcrumb Config': emptyProps(),
    'Load Breadcrumb Config Success': props<{
      breadcrumbConfig: BreadcrumbConfiguration;
    }>(),
    'Load Breadcrumb Config Failure': props<{
      error: string;
    }>(),

    // Load All Navigation Data
    'Load All Navigation Data': emptyProps(),
    'Load All Navigation Data Success': props<{
      navigationConfig: NavigationConfiguration;
      sidenavConfig: SidenavConfiguration;
      breadcrumbConfig: BreadcrumbConfiguration;
    }>(),
    'Load All Navigation Data Failure': props<{
      error: string;
    }>(),

    // Active Menu Tab Management
    'Set Active Menu Tab': props<{
      tabId: string;
    }>(),

    // Breadcrumb Management
    'Update Breadcrumbs': props<{
      breadcrumbs: BreadcrumbItem[];
    }>(),
    'Set Breadcrumb Style': props<{
      style: BreadcrumbStyle;
    }>(),
    'Build Breadcrumbs From Route': props<{
      url: string;
    }>(),

    // Menu Configuration Updates
    'Add Menu Section': props<{
      section: MenuSection;
    }>(),
    'Remove Menu Section': props<{
      sectionId: string;
    }>(),
    'Update Menu Section': props<{
      sectionId: string;
      section: Partial<MenuSection>;
    }>(),

    // Action Button Management
    'Add Action Button': props<{
      button: ActionButton;
    }>(),
    'Remove Action Button': props<{
      buttonId: string;
    }>(),
    'Update Action Button': props<{
      buttonId: string;
      button: Partial<ActionButton>;
    }>(),

    // Sidenav Menu Management
    'Toggle Sidenav Menu Item': props<{
      itemId: string;
    }>(),
    'Set Sidenav Menu Item Expanded': props<{
      itemId: string;
      expanded: boolean;
    }>(),
    'Add Sidenav Section': props<{
      section: SidenavSection;
    }>(),
    'Update Sidenav Section': props<{
      sectionId: string;
      section: Partial<SidenavSection>;
    }>(),

    // Cache Management
    'Clear Navigation Cache': emptyProps(),
    'Refresh Navigation Data': emptyProps(),
  },
});
