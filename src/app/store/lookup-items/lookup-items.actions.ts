import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LookupItem } from './lookup-items.state';

export const LookupItemsActions = createActionGroup({
  source: 'Lookup Items',
  events: {
    // Load lookup items
    'Load Lookup Items': emptyProps(),
    'Load Lookup Items Success': props<{ lookupItems: LookupItem[] }>(),
    'Load Lookup Items Failure': props<{ error: string }>(),

    // Load by category
    'Load By Category': props<{ category: string }>(),
    'Load By Category Success': props<{ lookupItems: LookupItem[] }>(),
    'Load By Category Failure': props<{ error: string }>(),

    // Add lookup item
    'Add Lookup Item': props<{ item: Omit<LookupItem, 'id'> }>(),
    'Add Lookup Item Success': props<{ item: LookupItem }>(),
    'Add Lookup Item Failure': props<{ error: string }>(),

    // Update lookup item
    'Update Lookup Item': props<{ item: LookupItem }>(),
    'Update Lookup Item Success': props<{ item: LookupItem }>(),
    'Update Lookup Item Failure': props<{ error: string }>(),

    // Delete lookup item
    'Delete Lookup Item': props<{ id: string }>(),
    'Delete Lookup Item Success': props<{ id: string }>(),
    'Delete Lookup Item Failure': props<{ error: string }>(),

    // Select lookup item
    'Select Lookup Item': props<{ item: LookupItem | null }>(),

    // Filter by category
    'Filter By Category': props<{ category: string | null }>(),

    // Clear error
    'Clear Error': emptyProps(),
  },
});
