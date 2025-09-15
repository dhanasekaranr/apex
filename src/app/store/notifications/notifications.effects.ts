import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap } from 'rxjs/operators';
import { NotificationsActions } from './notifications.actions';
import {
  NotificationConfiguration,
  NotificationSettings,
  type Notification,
} from './notifications.state';

@Injectable()
export class NotificationsEffects {
  private apiUrl = 'http://localhost:3001';
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  // Load Notifications Configuration
  loadNotificationsConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.loadNotificationsConfig),
      exhaustMap(() => {
        console.log('🔄 Loading notifications configuration from API');

        return this.http
          .get<NotificationConfiguration[]>(`${this.apiUrl}/notifications`)
          .pipe(
            map((response) => {
              console.log('✅ Notifications configuration loaded successfully');
              return NotificationsActions.loadNotificationsConfigSuccess({
                configuration: response[0], // Get first configuration
              });
            }),
            catchError((error) => {
              console.error(
                '❌ Failed to load notifications configuration:',
                error
              );
              return of(
                NotificationsActions.loadNotificationsConfigFailure({
                  error: `Failed to load notifications: ${error.message}`,
                })
              );
            })
          );
      })
    )
  );

  // Load Individual Notifications (for when we want to refresh just notifications)
  loadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.loadNotifications),
      exhaustMap(() => {
        console.log('🔄 Loading notifications from API');

        return this.http
          .get<Notification[]>(`${this.apiUrl}/individual-notifications`)
          .pipe(
            map((notifications) => {
              console.log('✅ Notifications loaded successfully');
              return NotificationsActions.loadNotificationsSuccess({
                notifications,
              });
            }),
            catchError((error) => {
              console.error('❌ Failed to load notifications:', error);
              return of(
                NotificationsActions.loadNotificationsFailure({
                  error: `Failed to load notifications: ${error.message}`,
                })
              );
            })
          );
      })
    )
  );

  // Create Notification
  createNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.createNotification),
      mergeMap(({ notification }) => {
        console.log('🔄 Creating new notification:', notification.title);

        const newNotification: Notification = {
          ...notification,
          id: `notification-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          timestamp: new Date().toISOString(),
        };

        return this.http
          .post<Notification>(
            `${this.apiUrl}/individual-notifications`,
            newNotification
          )
          .pipe(
            map((createdNotification) => {
              console.log('✅ Notification created successfully');
              return NotificationsActions.createNotificationSuccess({
                notification: createdNotification,
              });
            }),
            catchError((error) => {
              console.error('❌ Failed to create notification:', error);
              return of(
                NotificationsActions.createNotificationFailure({
                  error: `Failed to create notification: ${error.message}`,
                })
              );
            })
          );
      })
    )
  );

  // Mark Notification as Read
  markNotificationAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.markNotificationAsRead),
      mergeMap(({ notificationId }) => {
        console.log('🔄 Marking notification as read:', notificationId);

        return this.http
          .patch<Notification>(
            `${this.apiUrl}/individual-notifications/${notificationId}`,
            {
              read: true,
            }
          )
          .pipe(
            map(() => {
              console.log('✅ Notification marked as read successfully');
              return NotificationsActions.markNotificationAsReadSuccess({
                notificationId,
              });
            }),
            catchError((error) => {
              console.error('❌ Failed to mark notification as read:', error);
              return of(
                NotificationsActions.markNotificationAsReadFailure({
                  error: `Failed to mark as read: ${error.message}`,
                })
              );
            })
          );
      })
    )
  );

  // Mark All Notifications as Read
  markAllNotificationsAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.markAllNotificationsAsRead),
      exhaustMap(() => {
        console.log('🔄 Marking all notifications as read');

        // In a real implementation, this would be a bulk update API call
        return this.http
          .patch<{ updatedIds: string[] }>(
            `${this.apiUrl}/individual-notifications/bulk-mark-read`,
            {}
          )
          .pipe(
            map((response) => {
              console.log('✅ All notifications marked as read successfully');
              return NotificationsActions.markAllNotificationsAsReadSuccess({
                notificationIds: response.updatedIds,
              });
            }),
            catchError((error) => {
              console.error(
                '❌ Failed to mark all notifications as read:',
                error
              );
              return of(
                NotificationsActions.markAllNotificationsAsReadFailure({
                  error: `Failed to mark all as read: ${error.message}`,
                })
              );
            })
          );
      })
    )
  );

  // Delete Notification
  deleteNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.deleteNotification),
      mergeMap(({ notificationId }) => {
        console.log('🔄 Deleting notification:', notificationId);

        return this.http
          .delete(`${this.apiUrl}/individual-notifications/${notificationId}`)
          .pipe(
            map(() => {
              console.log('✅ Notification deleted successfully');
              return NotificationsActions.deleteNotificationSuccess({
                notificationId,
              });
            }),
            catchError((error) => {
              console.error('❌ Failed to delete notification:', error);
              return of(
                NotificationsActions.deleteNotificationFailure({
                  error: `Failed to delete notification: ${error.message}`,
                })
              );
            })
          );
      })
    )
  );

  // Delete All Read Notifications
  deleteAllReadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.deleteAllReadNotifications),
      exhaustMap(() => {
        console.log('🔄 Deleting all read notifications');

        return this.http
          .delete<{ deletedIds: string[] }>(
            `${this.apiUrl}/individual-notifications/read`
          )
          .pipe(
            map((response) => {
              console.log('✅ All read notifications deleted successfully');
              return NotificationsActions.deleteAllReadNotificationsSuccess({
                deletedIds: response.deletedIds,
              });
            }),
            catchError((error) => {
              console.error('❌ Failed to delete read notifications:', error);
              return of(
                NotificationsActions.deleteAllReadNotificationsFailure({
                  error: `Failed to delete read notifications: ${error.message}`,
                })
              );
            })
          );
      })
    )
  );

  // Clear All Notifications
  clearAllNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.clearAllNotifications),
      exhaustMap(() => {
        console.log('🔄 Clearing all notifications');

        return this.http.delete(`${this.apiUrl}/individual-notifications`).pipe(
          map(() => {
            console.log('✅ All notifications cleared successfully');
            return NotificationsActions.clearAllNotificationsSuccess();
          }),
          catchError((error) => {
            console.error('❌ Failed to clear notifications:', error);
            return of(
              NotificationsActions.clearAllNotificationsFailure({
                error: `Failed to clear notifications: ${error.message}`,
              })
            );
          })
        );
      })
    )
  );

  // Update Notification Settings
  updateNotificationSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.updateNotificationSettings),
      mergeMap(({ settings }) => {
        console.log('🔄 Updating notification settings');

        return this.http
          .put<NotificationSettings>(
            `${this.apiUrl}/notification-settings`,
            settings
          )
          .pipe(
            map((updatedSettings) => {
              console.log('✅ Notification settings updated successfully');
              return NotificationsActions.updateNotificationSettingsSuccess({
                settings: updatedSettings,
              });
            }),
            catchError((error) => {
              console.error(
                '❌ Failed to update notification settings:',
                error
              );
              return of(
                NotificationsActions.updateNotificationSettingsFailure({
                  error: `Failed to update settings: ${error.message}`,
                })
              );
            })
          );
      })
    )
  );

  // Bulk Mark as Read
  bulkMarkAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.bulkMarkAsRead),
      mergeMap(({ notificationIds }) => {
        console.log(
          '🔄 Bulk marking notifications as read:',
          notificationIds.length
        );

        return this.http
          .patch<{ updatedIds: string[] }>(
            `${this.apiUrl}/individual-notifications/bulk-mark-read`,
            {
              notificationIds,
            }
          )
          .pipe(
            map((response) => {
              console.log('✅ Notifications bulk marked as read successfully');
              return NotificationsActions.bulkMarkAsReadSuccess({
                notificationIds: response.updatedIds,
              });
            }),
            catchError((error) => {
              console.error('❌ Failed to bulk mark as read:', error);
              return of(
                NotificationsActions.bulkMarkAsReadFailure({
                  error: `Failed to bulk mark as read: ${error.message}`,
                })
              );
            })
          );
      })
    )
  );

  // Bulk Delete
  bulkDelete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.bulkDelete),
      mergeMap(({ notificationIds }) => {
        console.log('🔄 Bulk deleting notifications:', notificationIds.length);

        return this.http
          .delete<{ deletedIds: string[] }>(
            `${this.apiUrl}/individual-notifications/bulk`,
            {
              body: { notificationIds },
            }
          )
          .pipe(
            map((response) => {
              console.log('✅ Notifications bulk deleted successfully');
              return NotificationsActions.bulkDeleteSuccess({
                notificationIds: response.deletedIds,
              });
            }),
            catchError((error) => {
              console.error('❌ Failed to bulk delete:', error);
              return of(
                NotificationsActions.bulkDeleteFailure({
                  error: `Failed to bulk delete: ${error.message}`,
                })
              );
            })
          );
      })
    )
  );

  // Refresh Notifications
  refreshNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.refreshNotifications),
      map(() => {
        console.log('🔄 Refreshing notifications data');
        return NotificationsActions.loadNotificationsConfig();
      })
    )
  );

  // Show Desktop Notification (Browser API)
  showDesktopNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NotificationsActions.showDesktopNotification),
        map(({ notification }) => {
          if (
            'Notification' in window &&
            Notification.permission === 'granted'
          ) {
            new Notification(notification.title, {
              body: notification.message,
              icon: '/favicon.ico',
              tag: notification.id,
            });
          }
          return { type: 'NO_ACTION' }; // No-op action
        })
      ),
    { dispatch: false }
  );

  // Request Browser Permission
  requestBrowserPermission$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NotificationsActions.requestBrowserPermission),
        map(() => {
          if ('Notification' in window) {
            Notification.requestPermission();
          }
          return { type: 'NO_ACTION' }; // No-op action
        })
      ),
    { dispatch: false }
  );
}
