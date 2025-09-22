export interface LookupValue {
  key: string;
  value: string;
  description?: string;
  isActive: boolean;
}

export interface LookupItem {
  id: string;
  name: string;
  description: string;
  category: string;
  values: LookupValue[];
}

export interface LookupItemsState {
  lookupItems: LookupItem[];
  loading: boolean;
  error: string | null;
  selectedItem: LookupItem | null;
  filterByCategory: string | null;
}
