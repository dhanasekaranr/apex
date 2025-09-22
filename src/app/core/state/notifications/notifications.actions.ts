import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Notification,
  NotificationConfiguration,
  NotificationFilters,
  NotificationSettings,
  NotificationSortOptions,
} from './notifications.state';

export const NotificationsActions = createActionGroup({
  source: 'Notifications',
  events: {
    // Load Notifications Configuration
    'Load Notifications Config': emptyProps(),
    'Load Notifications Config Success': props<{
      configuration: NotificationConfiguration;
    }>(),
    'Load Notifications Config Failure': props<{
      error: string;
    }>(),

    // Load Individual Notifications
    'Load Notifications': emptyProps(),
    'Load Notifications Success': props<{
      notifications: Notification[];
    }>(),
    'Load Notifications Failure': props<{
      error: string;
    }>(),

    // Create Notification
    'Create Notification': props<{
      notification: Omit<Notification, 'id' | 'timestamp'>;
    }>(),
    'Create Notification Success': props<{
      notification: Notification;
    }>(),
    'Create Notification Failure': props<{
      error: string;
    }>(),

    // Mark as Read/Unread
    'Mark Notification As Read': props<{
      notificationId: string;
    }>(),
    'Mark Notification As Read Success': props<{
      notificationId: string;
    }>(),
    'Mark Notification As Read Failure': props<{
      error: string;
    }>(),

    'Mark All Notifications As Read': emptyProps(),
    'Mark All Notifications As Read Success': props<{
      notificationIds: string[];
    }>(),
    'Mark All Notifications As Read Failure': props<{
      error: string;
    }>(),

    'Toggle Notification Read Status': props<{
      notificationId: string;
    }>(),

    // Delete Notifications
    'Delete Notification': props<{
      notificationId: string;
    }>(),
    'Delete Notification Success': props<{
      notificationId: string;
    }>(),
    'Delete Notification Failure': props<{
      error: string;
    }>(),

    'Delete All Read Notifications': emptyProps(),
    'Delete All Read Notifications Success': props<{
      deletedIds: string[];
    }>(),
    'Delete All Read Notifications Failure': props<{
      error: string;
    }>(),

    'Clear All Notifications': emptyProps(),
    'Clear All Notifications Success': emptyProps(),
    'Clear All Notifications Failure': props<{
      error: string;
    }>(),

    // Filter and Sort
    'Set Notification Filters': props<{
      filters: NotificationFilters;
    }>(),
    'Set Sort Options': props<{
      sortOptions: NotificationSortOptions;
    }>(),
    'Clear Filters': emptyProps(),

    // Selection
    'Select Notification': props<{
      notificationId: string;
    }>(),
    'Clear Selection': emptyProps(),

    // Settings
    'Update Notification Settings': props<{
      settings: NotificationSettings;
    }>(),
    'Update Notification Settings Success': props<{
      settings: NotificationSettings;
    }>(),
    'Update Notification Settings Failure': props<{
      error: string;
    }>(),

    // Bulk Operations
    'Bulk Mark As Read': props<{
      notificationIds: string[];
    }>(),
    'Bulk Mark As Read Success': props<{
      notificationIds: string[];
    }>(),
    'Bulk Mark As Read Failure': props<{
      error: string;
    }>(),

    'Bulk Delete': props<{
      notificationIds: string[];
    }>(),
    'Bulk Delete Success': props<{
      notificationIds: string[];
    }>(),
    'Bulk Delete Failure': props<{
      error: string;
    }>(),

    // Auto Actions
    'Auto Mark Old Notifications As Read': emptyProps(),
    'Auto Delete Old Notifications': emptyProps(),

    // Real-time Updates
    'Notification Received': props<{
      notification: Notification;
    }>(),
    'Notification Updated': props<{
      notification: Notification;
    }>(),
    'Notification Deleted': props<{
      notificationId: string;
    }>(),

    // Cache Management
    'Refresh Notifications': emptyProps(),
    'Clear Notifications Cache': emptyProps(),

    // System Actions
    'Request Browser Permission': emptyProps(),
    'Show Desktop Notification': props<{
      notification: Notification;
    }>(),
    'Play Notification Sound': emptyProps(),
  },
});
