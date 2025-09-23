/**
 * Base state interface that all feature stores should extend
 * Provides common loading and error state management
 */
export interface BaseState {
  loading: boolean;
  error: string | null;
}

/**
 * Initial base state values
 */
export const initialBaseState: BaseState = {
  loading: false,
  error: null,
};

/**
 * Common computed properties for base state
 */
export const baseStateComputed = {
  hasError: (error: () => string | null) => !!error(),
  isLoading: (loading: () => boolean) => loading(),
};
