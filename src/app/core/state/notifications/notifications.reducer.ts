import { createReducer, on } from '@ngrx/store';
import { NotificationsActions } from './notifications.actions';
import { initialNotificationsState } from './notifications.state';

export const notificationsReducer = createReducer(
  initialNotificationsState,

  // Load Notifications Configuration
  on(NotificationsActions.loadNotificationsConfig, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    NotificationsActions.loadNotificationsConfigSuccess,
    (state, { configuration }) => ({
      ...state,
      configuration,
      notifications: configuration.notifications,
      categories: configuration.notificationCategories,
      types: configuration.notificationTypes,
      settings: configuration.notificationSettings,
      loading: false,
      error: null,
      lastUpdated: new Date().toISOString(),
    })
  ),

  on(
    NotificationsActions.loadNotificationsConfigFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })
  ),

  // Load Notifications
  on(NotificationsActions.loadNotifications, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    NotificationsActions.loadNotificationsSuccess,
    (state, { notifications }) => ({
      ...state,
      notifications,
      loading: false,
      error: null,
      lastRefresh: new Date().toISOString(),
    })
  ),

  on(NotificationsActions.loadNotificationsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Notification
  on(NotificationsActions.createNotification, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    NotificationsActions.createNotificationSuccess,
    (state, { notification }) => ({
      ...state,
      notifications: [notification, ...state.notifications],
      loading: false,
      error: null,
    })
  ),

  on(NotificationsActions.createNotificationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Mark as Read
  on(NotificationsActions.markNotificationAsRead, (state) => ({
    ...state,
    markingAsRead: true,
    error: null,
  })),

  on(
    NotificationsActions.markNotificationAsReadSuccess,
    (state, { notificationId }) => ({
      ...state,
      notifications: state.notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      ),
      markingAsRead: false,
      error: null,
    })
  ),

  on(
    NotificationsActions.markNotificationAsReadFailure,
    (state, { error }) => ({
      ...state,
      markingAsRead: false,
      error,
    })
  ),

  // Mark All as Read
  on(NotificationsActions.markAllNotificationsAsRead, (state) => ({
    ...state,
    markingAsRead: true,
    error: null,
  })),

  on(
    NotificationsActions.markAllNotificationsAsReadSuccess,
    (state, { notificationIds }) => ({
      ...state,
      notifications: state.notifications.map((notification) =>
        notificationIds.includes(notification.id)
          ? { ...notification, read: true }
          : notification
      ),
      markingAsRead: false,
      error: null,
    })
  ),

  on(
    NotificationsActions.markAllNotificationsAsReadFailure,
    (state, { error }) => ({
      ...state,
      markingAsRead: false,
      error,
    })
  ),

  // Toggle Read Status
  on(
    NotificationsActions.toggleNotificationReadStatus,
    (state, { notificationId }) => ({
      ...state,
      notifications: state.notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: !notification.read }
          : notification
      ),
    })
  ),

  // Delete Notification
  on(NotificationsActions.deleteNotification, (state) => ({
    ...state,
    deleting: true,
    error: null,
  })),

  on(
    NotificationsActions.deleteNotificationSuccess,
    (state, { notificationId }) => ({
      ...state,
      notifications: state.notifications.filter(
        (notification) => notification.id !== notificationId
      ),
      selectedNotificationId:
        state.selectedNotificationId === notificationId
          ? null
          : state.selectedNotificationId,
      deleting: false,
      error: null,
    })
  ),

  on(NotificationsActions.deleteNotificationFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    error,
  })),

  // Delete All Read Notifications
  on(NotificationsActions.deleteAllReadNotifications, (state) => ({
    ...state,
    deleting: true,
    error: null,
  })),

  on(
    NotificationsActions.deleteAllReadNotificationsSuccess,
    (state, { deletedIds }) => ({
      ...state,
      notifications: state.notifications.filter(
        (notification) => !deletedIds.includes(notification.id)
      ),
      selectedNotificationId: deletedIds.includes(
        state.selectedNotificationId || ''
      )
        ? null
        : state.selectedNotificationId,
      deleting: false,
      error: null,
    })
  ),

  on(
    NotificationsActions.deleteAllReadNotificationsFailure,
    (state, { error }) => ({
      ...state,
      deleting: false,
      error,
    })
  ),

  // Clear All Notifications
  on(NotificationsActions.clearAllNotifications, (state) => ({
    ...state,
    deleting: true,
    error: null,
  })),

  on(NotificationsActions.clearAllNotificationsSuccess, (state) => ({
    ...state,
    notifications: [],
    selectedNotificationId: null,
    deleting: false,
    error: null,
  })),

  on(NotificationsActions.clearAllNotificationsFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    error,
  })),

  // Filter and Sort
  on(NotificationsActions.setNotificationFilters, (state, { filters }) => ({
    ...state,
    filters,
  })),

  on(NotificationsActions.setSortOptions, (state, { sortOptions }) => ({
    ...state,
    sortOptions,
  })),

  on(NotificationsActions.clearFilters, (state) => ({
    ...state,
    filters: initialNotificationsState.filters,
  })),

  // Selection
  on(NotificationsActions.selectNotification, (state, { notificationId }) => ({
    ...state,
    selectedNotificationId: notificationId,
  })),

  on(NotificationsActions.clearSelection, (state) => ({
    ...state,
    selectedNotificationId: null,
  })),

  // Settings
  on(NotificationsActions.updateNotificationSettings, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    NotificationsActions.updateNotificationSettingsSuccess,
    (state, { settings }) => ({
      ...state,
      settings,
      loading: false,
      error: null,
    })
  ),

  on(
    NotificationsActions.updateNotificationSettingsFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })
  ),

  // Bulk Operations
  on(NotificationsActions.bulkMarkAsRead, (state) => ({
    ...state,
    markingAsRead: true,
    error: null,
  })),

  on(
    NotificationsActions.bulkMarkAsReadSuccess,
    (state, { notificationIds }) => ({
      ...state,
      notifications: state.notifications.map((notification) =>
        notificationIds.includes(notification.id)
          ? { ...notification, read: true }
          : notification
      ),
      markingAsRead: false,
      error: null,
    })
  ),

  on(NotificationsActions.bulkMarkAsReadFailure, (state, { error }) => ({
    ...state,
    markingAsRead: false,
    error,
  })),

  on(NotificationsActions.bulkDelete, (state) => ({
    ...state,
    deleting: true,
    error: null,
  })),

  on(NotificationsActions.bulkDeleteSuccess, (state, { notificationIds }) => ({
    ...state,
    notifications: state.notifications.filter(
      (notification) => !notificationIds.includes(notification.id)
    ),
    selectedNotificationId: notificationIds.includes(
      state.selectedNotificationId || ''
    )
      ? null
      : state.selectedNotificationId,
    deleting: false,
    error: null,
  })),

  on(NotificationsActions.bulkDeleteFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    error,
  })),

  // Real-time Updates
  on(NotificationsActions.notificationReceived, (state, { notification }) => ({
    ...state,
    notifications: [notification, ...state.notifications],
  })),

  on(NotificationsActions.notificationUpdated, (state, { notification }) => ({
    ...state,
    notifications: state.notifications.map((n) =>
      n.id === notification.id ? notification : n
    ),
  })),

  on(NotificationsActions.notificationDeleted, (state, { notificationId }) => ({
    ...state,
    notifications: state.notifications.filter((n) => n.id !== notificationId),
    selectedNotificationId:
      state.selectedNotificationId === notificationId
        ? null
        : state.selectedNotificationId,
  })),

  // Cache Management
  on(NotificationsActions.refreshNotifications, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(NotificationsActions.clearNotificationsCache, () => ({
    ...initialNotificationsState,
  }))
);
