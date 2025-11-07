import { TemplateRef, Type } from '@angular/core';

export const DEFAULT_HOVER_CLOSE_DELAY_MS = 200;

export type PopoverContent = string | TemplateRef<unknown> | Type<unknown>;

export type PopoverTrigger = 'click' | 'hover' | 'manual';
export type PopoverPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end'
  | 'right-start'
  | 'right-end';

export type PopoverAutoClose = 'none' | 'outside' | 'hover' | 'timeout';

export interface PopoverConfig {
  trigger?: PopoverTrigger; // default: 'click'
  placement?: PopoverPlacement; // default: 'bottom'
  offset?: number; // default: 8
  width?: string; // e.g. '360px'
  maxWidth?: string; // e.g. 'min(90vw, 420px)'
  maxHeight?: string; // e.g. '60vh'
  hasArrow?: boolean; // default: true
  role?: 'dialog' | 'tooltip'; // default: 'dialog'
  autoClose?: PopoverAutoClose; // default: 'outside'
  hoverCloseDelayMs?: number; // default: 200
  openDelayMs?: number; // default: 0
  timeoutMs?: number; // for autoClose='timeout'
  closeOnNavigation?: boolean; // default: true
  disableBackdrop?: boolean; // default: false
  trapFocus?: boolean; // default: false
  showHeader?: boolean; // default: false
  headerText?: string;
  showCopy?: boolean; // default: true (string content only)
  showClose?: boolean; // default: true
  smartPositioning?: boolean; // default: false - enable intelligent fallback positioning
  data?: unknown; // context for templates/components (unknown for Sonar)
}
