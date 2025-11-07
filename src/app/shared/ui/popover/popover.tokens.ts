import { InjectionToken } from '@angular/core';
import { PopoverConfig } from './popover.types';

export const POPOVER_CONFIG = new InjectionToken<PopoverConfig>(
  'POPOVER_CONFIG'
);
