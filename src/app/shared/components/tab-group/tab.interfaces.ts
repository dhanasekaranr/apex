/**
 * @fileoverview Tab system interfaces and types for Angular 20 Material 3 implementation
 * @version 1.0.0
 * @author Twenty Development Team
 */

/**
 * Base interface for components that can be used within tabs
 * Provides standard methods for validation, persistence, and state management
 */
export interface TabValidatable<TData = unknown> {
  /** Check if the current component state is valid */
  isValid(): boolean;
  
  /** Check if the component has unsaved changes */
  isDirty(): boolean;
  
  /** Save the current component data */
  save(): Promise<void> | void;
  
  /** Reset component to initial state */
  reset(): void;
  
  /** Get current component data for global operations */
  getData(): TData;
  
  /** Optional: Set component to read-only mode */
  setReadOnly?(readOnly: boolean): void;
  
  /** Optional: Initialize component with data */
  initializeData?(data: Partial<TData>): void;
}

/**
 * Loading strategy for tabs
 * - eager: Load immediately on component init
 * - lazy: Load after initial tab + delay
 * - onClickOnly: Load only when tab is clicked
 */
export type LoadStrategy = 'eager' | 'lazy' | 'onClickOnly';

/**
 * Auto-load behavior during Save All operation
 * - none: Don't auto-load any tabs
 * - missing: Load only unloaded tabs that are included in save
 * - all: Load all enabled tabs before saving
 */
export type SaveAllLoadStrategy = 'none' | 'missing' | 'all';

/**
 * Save mode for tab group operations
 * - parent: Emit data to parent component for handling
 * - internal: Each tab saves itself independently
 */
export type SaveMode = 'parent' | 'internal';

/**
 * Configuration for individual tabs
 */
export interface TabConfig<TData = unknown> {
  /** Unique identifier for the tab */
  id: string;
  
  /** Display label for the tab */
  label: string;
  
  /** Angular component class to render in tab */
  component: any; // Type<TabValidatable<TData>> - kept as any for flexibility
  
  /** Override global load strategy for this specific tab */
  mode?: LoadStrategy;
  
  /** Whether tab is enabled for interaction */
  enabled?: boolean;
  
  /** Tooltip message shown when tab is disabled */
  disabledTooltip?: string;
  
  /** Show individual Save/Reset buttons within tab content */
  showPerTabActions?: boolean;
  
  /** Initial data to inject into component */
  data?: Partial<TData>;
  
  /** Whether tab should be read-only (no editing/saving) */
  readOnly?: boolean;
  
  /** Include this tab's data in Save All operations */
  includeInGlobalPayload?: boolean;
  
  /** Optional icon for tab header */
  icon?: string;
  
  /** Tooltip for tab icon */
  iconTooltip?: string;
  
  /** Custom CSS class for tab styling */
  cssClass?: string;
  
  /** Whether this onClickOnly tab requires other tabs to be valid before loading */
  requiresValidation?: boolean;
  
  /** Validation rules specific to this tab */
  validationRules?: ValidationRule<TData>[];
  
  /** Whether this tab is required for form completion */
  required?: boolean;
  
  /** Order/priority for tab display */
  order?: number;
}

/**
 * Internal state tracking for each tab
 */
export interface TabState {
  /** Whether tab content has been loaded */
  loaded: boolean;
  
  /** Whether tab content is currently valid */
  valid: boolean;
  
  /** Whether tab has unsaved changes */
  dirty: boolean;
  
  /** Reference to the loaded component instance */
  component?: TabValidatable;
  
  /** Loading error if tab failed to load */
  error?: string;
  
  /** Timestamp of last validation check */
  lastValidated?: number;
  
  /** Custom metadata for tab state */
  metadata?: Record<string, unknown>;
}

/**
 * Validation rule for tab data
 */
export interface ValidationRule<TData = unknown> {
  /** Unique identifier for the rule */
  id: string;
  
  /** Validation function */
  validator: (data: TData) => boolean | Promise<boolean>;
  
  /** Error message if validation fails */
  message: string;
  
  /** Severity level of validation failure */
  severity: 'error' | 'warning' | 'info';
  
  /** Whether this rule blocks save operations */
  blocking?: boolean;
}

/**
 * Cross-tab validation result
 */
export interface ValidationResult {
  /** Which tab the validation applies to */
  tabId: string;
  
  /** Validation rule that was checked */
  ruleId: string;
  
  /** Whether validation passed */
  valid: boolean;
  
  /** Error/warning message */
  message?: string;
  
  /** Severity level */
  severity: 'error' | 'warning' | 'info';
}

/**
 * Progress event emitted during Save All operations
 */
export interface SaveAllProgressEvent {
  /** Current phase of the save operation */
  phase: 'autoload' | 'validate' | 'saving' | 'emit' | 'complete' | 'error';
  
  /** Total number of tabs to process */
  totalTabs?: number;
  
  /** Number of tabs processed so far */
  processedCount?: number;
  
  /** Total tabs that need to be auto-loaded */
  totalToLoad?: number;
  
  /** Number of tabs loaded so far */
  loadedCount?: number;
  
  /** Index of currently processing tab */
  currentTabIndex?: number;
  
  /** ID of currently processing tab */
  currentTabId?: string;
  
  /** Progress percentage (0-100) */
  progress?: number;
  
  /** Optional message about current operation */
  message?: string;
  
  /** Error details if phase is 'error' */
  error?: Error;
}

/**
 * Event emitted when tab validation state changes
 */
export interface TabValidationChangeEvent {
  /** ID of the tab */
  tabId: string;
  
  /** Index of the tab */
  tabIndex: number;
  
  /** New validation state */
  isValid: boolean;
  
  /** Validation errors if any */
  errors?: ValidationResult[];
  
  /** Warnings if any */
  warnings?: ValidationResult[];
}

/**
 * Event emitted when tab is saved
 */
export interface TabSaveEvent {
  /** ID of the tab */
  tabId: string;
  
  /** Index of the tab */
  tabIndex: number;
  
  /** Data that was saved */
  data: unknown;
  
  /** Timestamp of save operation */
  timestamp: number;
}

/**
 * Event emitted when tab is reset
 */
export interface TabResetEvent {
  /** ID of the tab */
  tabId: string;
  
  /** Index of the tab */
  tabIndex: number;
  
  /** Timestamp of reset operation */
  timestamp: number;
}

/**
 * Configuration options for the tab group component
 */
export interface TabGroupOptions {
  /** Global loading strategy for all tabs */
  globalLoadStrategy: LoadStrategy;
  
  /** Whether to validate current tab before allowing tab switch */
  validateOnTabSwitch: boolean;
  
  /** Delay in ms before loading lazy tabs */
  lazyLoadDelay: number;
  
  /** Save mode for Save All operations */
  saveMode: SaveMode;
  
  /** Whether to show global Save All / Reset All buttons */
  showGlobalActions: boolean;
  
  /** Auto-load behavior during Save All */
  saveAllLoad: SaveAllLoadStrategy;
  
  /** Maximum time to wait for auto-loading during Save All */
  saveAllAutoLoadTimeoutMs: number;
  
  /** Maximum concurrent tab loads during Save All */
  saveAllLoadConcurrency: number;
  
  /** Whether to emit progress events during operations */
  emitProgress: boolean;
  
  /** Whether to persist tab states to localStorage */
  persistState: boolean;
  
  /** Key for localStorage persistence */
  persistenceKey: string;
  
  /** Whether to enable keyboard navigation */
  keyboardNavigation: boolean;
  
  /** Maximum number of retry attempts for failed tab loads */
  maxRetryAttempts: number;
  
  /** Retry delay in ms for failed tab loads */
  retryDelay: number;
}

/**
 * Default configuration values
 */
export const DEFAULT_TAB_GROUP_OPTIONS: TabGroupOptions = {
  globalLoadStrategy: 'lazy',
  validateOnTabSwitch: true,
  lazyLoadDelay: 500,
  saveMode: 'parent',
  showGlobalActions: true,
  saveAllLoad: 'missing',
  saveAllAutoLoadTimeoutMs: 10000,
  saveAllLoadConcurrency: 3,
  emitProgress: true,
  persistState: false,
  persistenceKey: 'tab-group-state',
  keyboardNavigation: true,
  maxRetryAttempts: 2,
  retryDelay: 1000,
};

/**
 * Error types for tab operations
 */
export enum TabErrorType {
  LOAD_FAILED = 'LOAD_FAILED',
  SAVE_FAILED = 'SAVE_FAILED',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  TIMEOUT = 'TIMEOUT',
  COMPONENT_NOT_FOUND = 'COMPONENT_NOT_FOUND',
  INVALID_CONFIG = 'INVALID_CONFIG',
}

/**
 * Custom error class for tab operations
 */
export class TabError extends Error {
  constructor(
    public type: TabErrorType,
    public tabId: string,
    public tabIndex: number,
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'TabError';
  }
}
