// Notification Interfaces
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  actionUrl?: string;
  actionLabel?: string;
  userId?: string | null;
  metadata?: { [key: string]: any };
}

export interface NotificationCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
  enabled: boolean;
}

export interface NotificationType {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export interface NotificationSettings {
  enabled: boolean;
  emailNotifications: boolean;
  browserNotifications: boolean;
  soundNotifications: boolean;
  desktopNotifications: boolean;
  sound: boolean;
  autoMarkAsRead: boolean;
  showTimestamps: boolean;
  notificationRetentionDays: number;
  maxNotificationsDisplay: number;
  autoMarkReadAfterDays: number;
  priorityFilters: {
    urgent: boolean;
    high: boolean;
    medium: boolean;
    low: boolean;
  };
  categoryFilters: { [key: string]: boolean };
}

// Configuration from JSON
export interface NotificationConfiguration {
  id: string;
  version: string;
  lastUpdated: string;
  notifications: Notification[];
  notificationSettings: NotificationSettings;
  notificationCategories: NotificationCategory[];
  notificationTypes: NotificationType[];
}

// Filter and Sorting Options
export interface NotificationFilters {
  categories: string[];
  types: string[];
  priorities: string[];
  readStatus: 'all' | 'read' | 'unread';
  dateRange?: {
    start: string;
    end: string;
  };
}

// For selectors
export interface NotificationFilter {
  categories?: string[];
  types?: string[];
  priorities?: ('low' | 'medium' | 'high' | 'urgent')[];
  readStatus?: 'read' | 'unread';
  dateRange?: {
    from?: string;
    to?: string;
  };
  searchQuery?: string;
}

export interface NotificationMetadata {
  source?: string;
  tags?: string[];
  [key: string]: any;
}

export interface NotificationSortOptions {
  field: 'timestamp' | 'priority' | 'category' | 'type';
  direction: 'asc' | 'desc';
}

// NgRx State
export interface NotificationsState {
  // Data
  configuration: NotificationConfiguration | null;
  notifications: Notification[];
  categories: NotificationCategory[];
  types: NotificationType[];
  settings: NotificationSettings | null;

  // UI State
  filters: NotificationFilters;
  currentFilter: NotificationFilter;
  sortOptions: NotificationSortOptions;
  selectedNotificationId: string | null;

  // Loading States
  loading: boolean;
  markingAsRead: boolean;
  deleting: boolean;

  // Error States
  error: string | null;

  // Cache Control
  lastUpdated: string | null;
  lastRefresh: string | null;
}

// Initial State
export const initialNotificationsState: NotificationsState = {
  configuration: null,
  notifications: [],
  categories: [],
  types: [],
  settings: null,
  filters: {
    categories: [],
    types: [],
    priorities: [],
    readStatus: 'all',
  },
  currentFilter: {
    categories: [],
    types: [],
    priorities: [],
  },
  sortOptions: {
    field: 'timestamp',
    direction: 'desc',
  },
  selectedNotificationId: null,
  loading: false,
  markingAsRead: false,
  deleting: false,
  error: null,
  lastUpdated: null,
  lastRefresh: null,
};
