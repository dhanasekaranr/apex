import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';
import { NotificationsApiService } from './notifications-api.service';
import {
  Notification,
  NotificationCategory,
  NotificationConfiguration,
  NotificationFilter,
  NotificationFilters,
  NotificationSettings,
  NotificationSortOptions,
  NotificationType,
} from './notifications.state';

// Signal Store State Interface
interface NotificationsStoreState {
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
  settingsLoading: boolean;

  // Error States
  error: string | null;
  settingsError: string | null;

  // Cache Control
  lastUpdated: string | null;
  lastRefresh: string | null;
}

// Initial State
const initialState: NotificationsStoreState = {
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
  settingsLoading: false,
  error: null,
  settingsError: null,
  lastUpdated: null,
  lastRefresh: null,
};

export const NotificationsStore = signalStore(
  { providedIn: 'root' },

  // State
  withState(initialState),

  // Computed Signals
  withComputed((store) => ({
    // Basic computed values
    allNotifications: computed(() => store.notifications()),

    unreadNotifications: computed(() =>
      store.notifications().filter((notification) => !notification.read)
    ),

    readNotifications: computed(() =>
      store.notifications().filter((notification) => notification.read)
    ),

    // Counts
    totalNotifications: computed(() => store.notifications().length),
    unreadCount: computed(
      () =>
        store.notifications().filter((notification) => !notification.read)
          .length
    ),
    readCount: computed(
      () =>
        store.notifications().filter((notification) => notification.read).length
    ),

    // Status helpers
    hasUnreadNotifications: computed(() =>
      store.notifications().some((notification) => !notification.read)
    ),

    hasNotifications: computed(() => store.notifications().length > 0),

    isLoaded: computed(() => !!store.configuration()),

    hasError: computed(() => !!store.error() || !!store.settingsError()),

    isLoading: computed(
      () =>
        store.loading() ||
        store.markingAsRead() ||
        store.deleting() ||
        store.settingsLoading()
    ),

    // Filtered notifications based on current filters
    filteredNotifications: computed(() => {
      let filtered = store.notifications();
      const filter = store.currentFilter();

      // Apply read status filter
      if (filter.readStatus === 'read') {
        filtered = filtered.filter((n) => n.read);
      } else if (filter.readStatus === 'unread') {
        filtered = filtered.filter((n) => !n.read);
      }

      // Apply category filter
      if (filter.categories && filter.categories.length > 0) {
        filtered = filtered.filter((n) =>
          filter.categories!.includes(n.category)
        );
      }

      // Apply priority filter
      if (filter.priorities && filter.priorities.length > 0) {
        filtered = filtered.filter((n) =>
          filter.priorities!.includes(n.priority)
        );
      }

      // Apply search query filter
      if (filter.searchQuery && filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (n) =>
            n.title.toLowerCase().includes(query) ||
            n.message.toLowerCase().includes(query) ||
            n.category.toLowerCase().includes(query)
        );
      }

      // Apply date range filter
      if (filter.dateRange?.from || filter.dateRange?.to) {
        filtered = filtered.filter((n) => {
          const notificationDate = new Date(n.timestamp);
          if (filter.dateRange?.from) {
            const fromDate = new Date(filter.dateRange.from);
            if (notificationDate < fromDate) return false;
          }
          if (filter.dateRange?.to) {
            const toDate = new Date(filter.dateRange.to);
            if (notificationDate > toDate) return false;
          }
          return true;
        });
      }

      return filtered;
    }),

    // Sorted filtered notifications
    sortedFilteredNotifications: computed(() => {
      let filtered = store.notifications();
      const filter = store.currentFilter();
      const { field, direction } = store.sortOptions();

      // Apply filters inline
      if (filter.readStatus === 'read') {
        filtered = filtered.filter((n) => n.read);
      } else if (filter.readStatus === 'unread') {
        filtered = filtered.filter((n) => !n.read);
      }

      if (filter.categories && filter.categories.length > 0) {
        filtered = filtered.filter((n) =>
          filter.categories!.includes(n.category)
        );
      }

      if (filter.priorities && filter.priorities.length > 0) {
        filtered = filtered.filter((n) =>
          filter.priorities!.includes(n.priority)
        );
      }

      if (filter.searchQuery && filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (n) =>
            n.title.toLowerCase().includes(query) ||
            n.message.toLowerCase().includes(query) ||
            n.category.toLowerCase().includes(query)
        );
      }

      if (filter.dateRange?.from || filter.dateRange?.to) {
        filtered = filtered.filter((n) => {
          const notificationDate = new Date(n.timestamp);
          if (filter.dateRange?.from) {
            const fromDate = new Date(filter.dateRange.from);
            if (notificationDate < fromDate) return false;
          }
          if (filter.dateRange?.to) {
            const toDate = new Date(filter.dateRange.to);
            if (notificationDate > toDate) return false;
          }
          return true;
        });
      }

      // Sort the filtered results
      return [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (field) {
          case 'timestamp':
            aValue = new Date(a.timestamp).getTime();
            bValue = new Date(b.timestamp).getTime();
            break;
          case 'priority':
            const priorityOrder: Record<string, number> = {
              urgent: 4,
              high: 3,
              medium: 2,
              low: 1,
            };
            aValue = priorityOrder[a.priority] || 0;
            bValue = priorityOrder[b.priority] || 0;
            break;
          case 'category':
            aValue = a.category.toLowerCase();
            bValue = b.category.toLowerCase();
            break;
          case 'type':
            aValue = a.type.toLowerCase();
            bValue = b.type.toLowerCase();
            break;
          default:
            return 0;
        }

        if (direction === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }),

    // Recent notifications (last 5, sorted by timestamp)
    recentNotifications: computed(() => {
      const notifications = store.notifications();
      return [...notifications]
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, 5);
    }),

    // Selected notification
    selectedNotification: computed(() => {
      const id = store.selectedNotificationId();
      return id ? store.notifications().find((n) => n.id === id) || null : null;
    }),

    // Statistics by priority
    notificationsByPriority: computed(() => {
      const notifications = store.notifications();
      return {
        urgent: notifications.filter((n) => n.priority === 'urgent').length,
        high: notifications.filter((n) => n.priority === 'high').length,
        medium: notifications.filter((n) => n.priority === 'medium').length,
        low: notifications.filter((n) => n.priority === 'low').length,
      };
    }),

    // Statistics by category
    notificationsByCategory: computed(() => {
      const notifications = store.notifications();
      const categoryStats: Record<string, number> = {};

      notifications.forEach((notification) => {
        categoryStats[notification.category] =
          (categoryStats[notification.category] || 0) + 1;
      });

      return categoryStats;
    }),

    // Statistics by type
    notificationsByType: computed(() => {
      const notifications = store.notifications();
      const typeStats: Record<string, number> = {};

      notifications.forEach((notification) => {
        typeStats[notification.type] = (typeStats[notification.type] || 0) + 1;
      });

      return typeStats;
    }),
  })),

  // Methods
  withMethods((store, notificationsApi = inject(NotificationsApiService)) => ({
    // Load notifications configuration
    loadNotificationsConfig: rxMethod<void>(
      pipe(
        tap(() => {
          console.log('🔄 Loading notifications configuration');
          patchState(store, { loading: true, error: null });
        }),
        switchMap(() =>
          notificationsApi.loadNotificationsConfig().pipe(
            tap((configuration) => {
              console.log('✅ Notifications configuration loaded successfully');
              patchState(store, {
                loading: false,
                configuration,
                notifications: configuration.notifications || [],
                categories: configuration.notificationCategories || [],
                types: configuration.notificationTypes || [],
                settings: configuration.notificationSettings || null,
                lastUpdated: new Date().toISOString(),
              });
            }),
            catchError((error) => {
              console.error(
                '❌ Failed to load notifications configuration:',
                error
              );
              patchState(store, {
                loading: false,
                error: `Failed to load notifications configuration: ${error.message}`,
              });
              return EMPTY;
            })
          )
        )
      )
    ),

    // Load notifications only
    loadNotifications: rxMethod<void>(
      pipe(
        tap(() => {
          console.log('🔄 Loading notifications');
          patchState(store, { loading: true, error: null });
        }),
        switchMap(() =>
          notificationsApi.loadNotifications().pipe(
            tap((notifications) => {
              console.log(
                '✅ Notifications loaded successfully:',
                notifications.length,
                'items'
              );
              patchState(store, {
                loading: false,
                notifications,
                lastUpdated: new Date().toISOString(),
              });
            }),
            catchError((error) => {
              console.error('❌ Failed to load notifications:', error);
              patchState(store, {
                loading: false,
                error: `Failed to load notifications: ${error.message}`,
              });
              return EMPTY;
            })
          )
        )
      )
    ),

    // Create notification
    createNotification: rxMethod<Omit<Notification, 'id' | 'timestamp'>>(
      pipe(
        tap(() => {
          console.log('🔄 Creating notification');
          patchState(store, { loading: true, error: null });
        }),
        switchMap((notification) =>
          notificationsApi.createNotification(notification).pipe(
            tap((newNotification) => {
              console.log('✅ Notification created successfully');
              const currentNotifications = store.notifications();
              patchState(store, {
                loading: false,
                notifications: [newNotification, ...currentNotifications],
              });
            }),
            catchError((error) => {
              console.error('❌ Failed to create notification:', error);
              patchState(store, {
                loading: false,
                error: `Failed to create notification: ${error.message}`,
              });
              return EMPTY;
            })
          )
        )
      )
    ),

    // Mark notification as read
    markNotificationAsRead: rxMethod<string>(
      pipe(
        tap(() => {
          console.log('🔄 Marking notification as read');
          patchState(store, { markingAsRead: true, error: null });
        }),
        switchMap((notificationId) =>
          notificationsApi.markNotificationAsRead(notificationId).pipe(
            tap((updatedNotification) => {
              console.log('✅ Notification marked as read');
              const currentNotifications = store.notifications();
              const updatedNotifications = currentNotifications.map((n) =>
                n.id === notificationId ? { ...n, read: true } : n
              );
              patchState(store, {
                markingAsRead: false,
                notifications: updatedNotifications,
              });
            }),
            catchError((error) => {
              console.error('❌ Failed to mark notification as read:', error);
              patchState(store, {
                markingAsRead: false,
                error: `Failed to mark notification as read: ${error.message}`,
              });
              return EMPTY;
            })
          )
        )
      )
    ),

    // Mark all notifications as read
    markAllNotificationsAsRead: rxMethod<void>(
      pipe(
        tap(() => {
          console.log('🔄 Marking all notifications as read');
          patchState(store, { markingAsRead: true, error: null });
        }),
        switchMap(() =>
          notificationsApi.markAllNotificationsAsRead().pipe(
            tap(() => {
              console.log('✅ All notifications marked as read');
              const currentNotifications = store.notifications();
              const updatedNotifications = currentNotifications.map((n) => ({
                ...n,
                read: true,
              }));
              patchState(store, {
                markingAsRead: false,
                notifications: updatedNotifications,
              });
            }),
            catchError((error) => {
              console.error(
                '❌ Failed to mark all notifications as read:',
                error
              );
              patchState(store, {
                markingAsRead: false,
                error: `Failed to mark all notifications as read: ${error.message}`,
              });
              return EMPTY;
            })
          )
        )
      )
    ),

    // Delete notification
    deleteNotification: rxMethod<string>(
      pipe(
        tap(() => {
          console.log('🔄 Deleting notification');
          patchState(store, { deleting: true, error: null });
        }),
        switchMap((notificationId) =>
          notificationsApi.deleteNotification(notificationId).pipe(
            tap(() => {
              console.log('✅ Notification deleted successfully');
              const currentNotifications = store.notifications();
              const updatedNotifications = currentNotifications.filter(
                (n) => n.id !== notificationId
              );
              patchState(store, {
                deleting: false,
                notifications: updatedNotifications,
              });
            }),
            catchError((error) => {
              console.error('❌ Failed to delete notification:', error);
              patchState(store, {
                deleting: false,
                error: `Failed to delete notification: ${error.message}`,
              });
              return EMPTY;
            })
          )
        )
      )
    ),

    // Delete all read notifications
    deleteAllReadNotifications: rxMethod<void>(
      pipe(
        tap(() => {
          console.log('🔄 Deleting all read notifications');
          patchState(store, { deleting: true, error: null });
        }),
        switchMap(() =>
          notificationsApi.deleteAllReadNotifications().pipe(
            tap(() => {
              console.log('✅ All read notifications deleted');
              const currentNotifications = store.notifications();
              const updatedNotifications = currentNotifications.filter(
                (n) => !n.read
              );
              patchState(store, {
                deleting: false,
                notifications: updatedNotifications,
              });
            }),
            catchError((error) => {
              console.error('❌ Failed to delete read notifications:', error);
              patchState(store, {
                deleting: false,
                error: `Failed to delete read notifications: ${error.message}`,
              });
              return EMPTY;
            })
          )
        )
      )
    ),

    // Clear all notifications
    clearAllNotifications: rxMethod<void>(
      pipe(
        tap(() => {
          console.log('🔄 Clearing all notifications');
          patchState(store, { deleting: true, error: null });
        }),
        switchMap(() =>
          notificationsApi.clearAllNotifications().pipe(
            tap(() => {
              console.log('✅ All notifications cleared');
              patchState(store, {
                deleting: false,
                notifications: [],
              });
            }),
            catchError((error) => {
              console.error('❌ Failed to clear all notifications:', error);
              patchState(store, {
                deleting: false,
                error: `Failed to clear all notifications: ${error.message}`,
              });
              return EMPTY;
            })
          )
        )
      )
    ),

    // Update notification settings
    updateNotificationSettings: rxMethod<NotificationSettings>(
      pipe(
        tap(() => {
          console.log('🔄 Updating notification settings');
          patchState(store, { settingsLoading: true, settingsError: null });
        }),
        switchMap((settings) =>
          notificationsApi.updateNotificationSettings(settings).pipe(
            tap((updatedSettings) => {
              console.log('✅ Notification settings updated');
              patchState(store, {
                settingsLoading: false,
                settings: updatedSettings,
              });
            }),
            catchError((error) => {
              console.error(
                '❌ Failed to update notification settings:',
                error
              );
              patchState(store, {
                settingsLoading: false,
                settingsError: `Failed to update notification settings: ${error.message}`,
              });
              return EMPTY;
            })
          )
        )
      )
    ),

    // Load notification settings
    loadNotificationSettings: rxMethod<void>(
      pipe(
        tap(() => {
          console.log('🔄 Loading notification settings');
          patchState(store, { settingsLoading: true, settingsError: null });
        }),
        switchMap(() =>
          notificationsApi.loadNotificationSettings().pipe(
            tap((settings) => {
              console.log('✅ Notification settings loaded');
              patchState(store, {
                settingsLoading: false,
                settings,
              });
            }),
            catchError((error) => {
              console.error('❌ Failed to load notification settings:', error);
              patchState(store, {
                settingsLoading: false,
                settingsError: `Failed to load notification settings: ${error.message}`,
              });
              return EMPTY;
            })
          )
        )
      )
    ),

    // Bulk mark as read
    bulkMarkAsRead: rxMethod<string[]>(
      pipe(
        tap(() => {
          console.log('🔄 Bulk marking notifications as read');
          patchState(store, { markingAsRead: true, error: null });
        }),
        switchMap((notificationIds) =>
          notificationsApi.bulkMarkAsRead(notificationIds).pipe(
            tap(() => {
              console.log('✅ Notifications bulk marked as read');
              const currentNotifications = store.notifications();
              const updatedNotifications = currentNotifications.map((n) =>
                notificationIds.includes(n.id) ? { ...n, read: true } : n
              );
              patchState(store, {
                markingAsRead: false,
                notifications: updatedNotifications,
              });
            }),
            catchError((error) => {
              console.error(
                '❌ Failed to bulk mark notifications as read:',
                error
              );
              patchState(store, {
                markingAsRead: false,
                error: `Failed to bulk mark notifications as read: ${error.message}`,
              });
              return EMPTY;
            })
          )
        )
      )
    ),

    // Bulk delete
    bulkDelete: rxMethod<string[]>(
      pipe(
        tap(() => {
          console.log('🔄 Bulk deleting notifications');
          patchState(store, { deleting: true, error: null });
        }),
        switchMap((notificationIds) =>
          notificationsApi.bulkDelete(notificationIds).pipe(
            tap(() => {
              console.log('✅ Notifications bulk deleted');
              const currentNotifications = store.notifications();
              const updatedNotifications = currentNotifications.filter(
                (n) => !notificationIds.includes(n.id)
              );
              patchState(store, {
                deleting: false,
                notifications: updatedNotifications,
              });
            }),
            catchError((error) => {
              console.error('❌ Failed to bulk delete notifications:', error);
              patchState(store, {
                deleting: false,
                error: `Failed to bulk delete notifications: ${error.message}`,
              });
              return EMPTY;
            })
          )
        )
      )
    ),

    // Refresh notifications
    refreshNotifications: rxMethod<void>(
      pipe(
        tap(() => {
          console.log('🔄 Refreshing notifications');
          patchState(store, { loading: true, error: null });
        }),
        switchMap(() =>
          notificationsApi.refreshNotifications().pipe(
            tap((notifications) => {
              console.log('✅ Notifications refreshed');
              patchState(store, {
                loading: false,
                notifications,
                lastRefresh: new Date().toISOString(),
              });
            }),
            catchError((error) => {
              console.error('❌ Failed to refresh notifications:', error);
              patchState(store, {
                loading: false,
                error: `Failed to refresh notifications: ${error.message}`,
              });
              return EMPTY;
            })
          )
        )
      )
    ),

    // UI State management
    setFilters: (filters: NotificationFilters) => {
      console.log('🎯 Setting notification filters');
      patchState(store, { filters });
    },

    setCurrentFilter: (filter: NotificationFilter) => {
      console.log('🎯 Setting current notification filter');
      patchState(store, { currentFilter: filter });
    },

    setSortOptions: (sortOptions: NotificationSortOptions) => {
      console.log('🔄 Setting sort options');
      patchState(store, { sortOptions });
    },

    selectNotification: (notificationId: string | null) => {
      console.log('🎯 Selecting notification:', notificationId);
      patchState(store, { selectedNotificationId: notificationId });
    },

    // Error management
    clearError: () => {
      patchState(store, { error: null });
    },

    clearSettingsError: () => {
      patchState(store, { settingsError: null });
    },

    clearAllErrors: () => {
      patchState(store, { error: null, settingsError: null });
    },

    // Reset store
    reset: () => {
      patchState(store, initialState);
    },
  }))
);
