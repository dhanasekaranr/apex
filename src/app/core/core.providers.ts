// Global services
import { DialogService } from './services/dialog.service';
import { EnvironmentService } from './services/environment.service';

/**
 * Core providers for the application
 * Contains global services and singletons
 */
export const coreProviders = [
  // Global services
  DialogService,
  EnvironmentService,
];
