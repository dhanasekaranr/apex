import { patchState } from '@ngrx/signals';
import { catchError, of, tap } from 'rxjs';
import { BaseState } from '../state/base-state';

/**
 * Utility functions for common store operations
 * These reduce boilerplate across signal stores
 */

/**
 * Sets loading state to true and clears errors
 */
export function setLoading<T extends BaseState>(store: any): void {
  patchState(store, { loading: true, error: null });
}

/**
 * Sets loading to false and updates error state
 */
export function setError<T extends BaseState>(store: any, error: string): void {
  patchState(store, { loading: false, error });
}

/**
 * Sets loading to false and clears error (success state)
 */
export function setSuccess<T extends BaseState>(
  store: any,
  partialState: Partial<T> = {}
): void {
  patchState(store, { loading: false, error: null, ...partialState });
}

/**
 * Common error handling operator for RxJS streams
 * @param store - The signal store instance
 * @param fallbackMessage - Default error message if none provided
 */
export function handleError<T extends BaseState>(
  store: any,
  fallbackMessage = 'An error occurred'
) {
  return catchError((error: any) => {
    const errorMessage = error?.message || fallbackMessage;
    console.error('❌ Store operation error:', error);
    setError(store, errorMessage);
    return of();
  });
}

/**
 * Common success handling operator for RxJS streams
 * @param store - The signal store instance
 * @param successCallback - Optional callback to execute on success
 */
export function handleSuccess<T extends BaseState>(
  store: any,
  successCallback?: (data: any) => void
) {
  return tap((data: any) => {
    console.log('✅ Store operation successful:', data);
    if (successCallback) {
      successCallback(data);
    }
    setSuccess(store);
  });
}

/**
 * Utility to create a standard loading operation with error handling
 * @param store - The signal store instance
 * @param operation - The observable operation to execute
 * @param successCallback - Callback to execute on success
 * @param errorMessage - Custom error message
 */
export function executeWithLoadingState<T extends BaseState, R>(
  store: any,
  operation: () => any,
  successCallback?: (data: R) => void,
  errorMessage?: string
) {
  return operation().pipe(
    tap(() => setLoading(store)),
    handleSuccess(store, successCallback),
    handleError(store, errorMessage)
  );
}
