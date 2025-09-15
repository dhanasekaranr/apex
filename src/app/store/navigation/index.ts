// Navigation Store Barrel Exports
export * from './navigation.actions';
export * from './navigation.effects';
export * from './navigation.reducer';
export * from './navigation.selectors';
export * from './navigation.state';

// Re-export with namespaces for cleaner imports
export { NavigationActions } from './navigation.actions';
export { NavigationEffects } from './navigation.effects';
export { navigationReducer } from './navigation.reducer';
export * as NavigationSelectors from './navigation.selectors';
export type {
  ActionButton,
  BreadcrumbConfig,
  BreadcrumbConfiguration,
  BreadcrumbItem,
  BreadcrumbStyleConfig,
  MenuItem,
  MenuSection,
  NavigationConfiguration,
  NavigationState,
  RouteMapping,
  TopNavConfig,
} from './navigation.state';
