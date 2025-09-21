import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  Notification,
  NotificationFilter,
  NotificationsState,
} from './notifications.state';

// Feature selector
export const selectNotificationsState =
  createFeatureSelector<NotificationsState>('notifications');

// Base selectors
export const selectNotificationsLoading = createSelector(
  selectNotificationsState,
  (state: NotificationsState) => state.loading
);

export const selectNotificationsError = createSelector(
  selectNotificationsState,
  (state: NotificationsState) => state.error
);

export const selectAllNotifications = createSelector(
  selectNotificationsState,
  (state: NotificationsState) => state.notifications
);

export const selectNotificationCategories = createSelector(
  selectNotificationsState,
  (state: NotificationsState) => state.categories
);

export const selectNotificationTypes = createSelector(
  selectNotificationsState,
  (state: NotificationsState) => state.types
);

export const selectNotificationSettings = createSelector(
  selectNotificationsState,
  (state: NotificationsState) => state.settings
);

export const selectCurrentFilter = createSelector(
  selectNotificationsState,
  (state: NotificationsState) => state.currentFilter
);

export const selectLastUpdated = createSelector(
  selectNotificationsState,
  (state: NotificationsState) => state.lastUpdated
);

// Derived selectors
export const selectNotificationById = (notificationId: string) =>
  createSelector(selectAllNotifications, (notifications: Notification[]) =>
    notifications.find((n) => n.id === notificationId)
  );

export const selectUnreadNotifications = createSelector(
  selectAllNotifications,
  (notifications: Notification[]) => notifications.filter((n) => !n.read)
);

export const selectReadNotifications = createSelector(
  selectAllNotifications,
  (notifications: Notification[]) => notifications.filter((n) => n.read)
);

export const selectRecentNotifications = (hours: number = 24) =>
  createSelector(selectAllNotifications, (notifications: Notification[]) => {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    return notifications.filter((n) => new Date(n.timestamp) >= cutoffTime);
  });

export const selectNotificationsByCategory = (category: string) =>
  createSelector(selectAllNotifications, (notifications: Notification[]) =>
    notifications.filter((n) => n.category === category)
  );

export const selectNotificationsByType = (type: string) =>
  createSelector(selectAllNotifications, (notifications: Notification[]) =>
    notifications.filter((n) => n.type === type)
  );

export const selectNotificationsByPriority = (
  priority: 'low' | 'medium' | 'high' | 'urgent'
) =>
  createSelector(selectAllNotifications, (notifications: Notification[]) =>
    notifications.filter((n) => n.priority === priority)
  );

export const selectHighPriorityNotifications = createSelector(
  selectAllNotifications,
  (notifications: Notification[]) =>
    notifications.filter(
      (n) => n.priority === 'high' || n.priority === 'urgent'
    )
);

export const selectUrgentNotifications = createSelector(
  selectAllNotifications,
  (notifications: Notification[]) =>
    notifications.filter((n) => n.priority === 'urgent')
);

// Filtered notifications based on current filter
export const selectFilteredNotifications = createSelector(
  selectAllNotifications,
  selectCurrentFilter,
  (notifications: Notification[], filter: NotificationFilter) => {
    let filtered = notifications;

    // Apply category filter
    if (filter.categories && filter.categories.length > 0) {
      filtered = filtered.filter((n) =>
        filter.categories!.includes(n.category)
      );
    }

    // Apply type filter
    if (filter.types && filter.types.length > 0) {
      filtered = filtered.filter((n) => filter.types!.includes(n.type));
    }

    // Apply priority filter
    if (filter.priorities && filter.priorities.length > 0) {
      filtered = filtered.filter((n) =>
        filter.priorities!.includes(n.priority)
      );
    }

    // Apply read status filter
    if (filter.readStatus) {
      filtered = filtered.filter((n) =>
        filter.readStatus === 'read' ? n.read : !n.read
      );
    }

    // Apply date range filter
    if (filter.dateRange) {
      const fromDate = filter.dateRange.from
        ? new Date(filter.dateRange.from)
        : null;
      const toDate = filter.dateRange.to ? new Date(filter.dateRange.to) : null;

      filtered = filtered.filter((n) => {
        const notificationDate = new Date(n.timestamp);
        if (fromDate && notificationDate < fromDate) return false;
        if (toDate && notificationDate > toDate) return false;
        return true;
      });
    }

    // Apply search query
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.message.toLowerCase().includes(query) ||
          (n.metadata &&
            n.metadata['source'] &&
            (n.metadata['source'] as string).toLowerCase().includes(query))
      );
    }

    return filtered;
  }
);

// Statistics selectors
export const selectNotificationCounts = createSelector(
  selectAllNotifications,
  (notifications: Notification[]) => ({
    total: notifications.length,
    unread: notifications.filter((n) => !n.read).length,
    read: notifications.filter((n) => n.read).length,
    byType: {
      info: notifications.filter((n) => n.type === 'info').length,
      success: notifications.filter((n) => n.type === 'success').length,
      warning: notifications.filter((n) => n.type === 'warning').length,
      error: notifications.filter((n) => n.type === 'error').length,
    },
    byPriority: {
      low: notifications.filter((n) => n.priority === 'low').length,
      medium: notifications.filter((n) => n.priority === 'medium').length,
      high: notifications.filter((n) => n.priority === 'high').length,
      urgent: notifications.filter((n) => n.priority === 'urgent').length,
    },
  })
);

export const selectUnreadCount = createSelector(
  selectUnreadNotifications,
  (unreadNotifications: Notification[]) => unreadNotifications.length
);

export const selectHasUnreadNotifications = createSelector(
  selectUnreadCount,
  (unreadCount: number) => unreadCount > 0
);

export const selectUrgentUnreadCount = createSelector(
  selectAllNotifications,
  (notifications: Notification[]) =>
    notifications.filter((n) => !n.read && n.priority === 'urgent').length
);

export const selectHighPriorityUnreadCount = createSelector(
  selectAllNotifications,
  (notifications: Notification[]) =>
    notifications.filter(
      (n) => !n.read && (n.priority === 'high' || n.priority === 'urgent')
    ).length
);

// Grouped selectors
export const selectNotificationsGroupedByType = createSelector(
  selectFilteredNotifications,
  (notifications: Notification[]) => {
    return notifications.reduce((groups, notification) => {
      const type = notification.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(notification);
      return groups;
    }, {} as Record<string, Notification[]>);
  }
);

export const selectNotificationsGroupedByCategory = createSelector(
  selectFilteredNotifications,
  (notifications: Notification[]) => {
    return notifications.reduce((groups, notification) => {
      const category = notification.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(notification);
      return groups;
    }, {} as Record<string, Notification[]>);
  }
);

export const selectNotificationsGroupedByDate = createSelector(
  selectFilteredNotifications,
  (notifications: Notification[]) => {
    return notifications.reduce((groups, notification) => {
      const date = new Date(notification.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
      return groups;
    }, {} as Record<string, Notification[]>);
  }
);

// Sorted selectors
export const selectNotificationsSortedByDate = (ascending: boolean = false) =>
  createSelector(
    selectFilteredNotifications,
    (notifications: Notification[]) => {
      return [...notifications].sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return ascending ? dateA - dateB : dateB - dateA;
      });
    }
  );

export const selectNotificationsSortedByPriority = createSelector(
  selectFilteredNotifications,
  (notifications: Notification[]) => {
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    return [...notifications].sort(
      (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
    );
  }
);

// Category selectors
export const selectCategoryById = (categoryId: string) =>
  createSelector(selectNotificationCategories, (categories) =>
    categories.find((c) => c.id === categoryId)
  );

export const selectEnabledCategories = createSelector(
  selectNotificationCategories,
  (categories) => categories.filter((c) => c.enabled)
);

// Settings selectors
export const selectNotificationSettingsEnabled = createSelector(
  selectNotificationSettings,
  (settings) => settings?.enabled || false
);

export const selectDesktopNotificationsEnabled = createSelector(
  selectNotificationSettings,
  (settings) => settings?.desktopNotifications || false
);

export const selectEmailNotificationsEnabled = createSelector(
  selectNotificationSettings,
  (settings) => settings?.emailNotifications || false
);

export const selectSoundEnabled = createSelector(
  selectNotificationSettings,
  (settings) => settings?.sound || false
);

export const selectAutoMarkAsReadEnabled = createSelector(
  selectNotificationSettings,
  (settings) => settings?.autoMarkAsRead || false
);

export const selectShowTimestamps = createSelector(
  selectNotificationSettings,
  (settings) => settings?.showTimestamps ?? true
);

// Data loading selectors
export const selectIsNotificationsDataLoaded = createSelector(
  selectNotificationsState,
  (state: NotificationsState) =>
    !state.loading &&
    state.notifications.length >= 0 &&
    state.categories.length > 0 &&
    state.types.length > 0 &&
    state.settings !== null
);

export const selectNotificationsLoadingState = createSelector(
  selectNotificationsLoading,
  selectNotificationsError,
  selectIsNotificationsDataLoaded,
  (loading: boolean, error: string | null, dataLoaded: boolean) => ({
    loading,
    error,
    dataLoaded,
  })
);

// Real-time selectors
export const selectLatestNotification = createSelector(
  selectAllNotifications,
  (notifications: Notification[]) => {
    if (notifications.length === 0) return null;
    return notifications.reduce((latest, current) =>
      new Date(current.timestamp) > new Date(latest.timestamp)
        ? current
        : latest
    );
  }
);

export const selectNewNotificationsToday = createSelector(
  selectAllNotifications,
  (notifications: Notification[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return notifications.filter((n) => new Date(n.timestamp) >= today);
  }
);

// Metadata selectors
export const selectNotificationSources = createSelector(
  selectAllNotifications,
  (notifications: Notification[]) => {
    const sources = new Set<string>();
    notifications.forEach((n) => {
      if (n.metadata?.['source']) {
        sources.add(n.metadata['source'] as string);
      }
    });
    return Array.from(sources);
  }
);

export const selectNotificationTags = createSelector(
  selectAllNotifications,
  (notifications: Notification[]) => {
    const tags = new Set<string>();
    notifications.forEach((n) => {
      if (n.metadata?.['tags'] && Array.isArray(n.metadata['tags'])) {
        (n.metadata['tags'] as string[]).forEach((tag: string) =>
          tags.add(tag)
        );
      }
    });
    return Array.from(tags);
  }
);
