import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationsActions } from './notifications.actions';
import {
  selectAllNotifications,
  selectNotificationsError,
  selectNotificationsLoading,
  selectUnreadCount,
} from './notifications.selectors';

@Injectable({
  providedIn: 'root',
})
export class NotificationsFacade {
  private readonly store = inject(Store);

  // Selectors
  readonly notifications$ = this.store.select(selectAllNotifications);
  readonly unreadCount$ = this.store.select(selectUnreadCount);
  readonly isLoading$ = this.store.select(selectNotificationsLoading);
  readonly error$ = this.store.select(selectNotificationsError);

  // Actions
  loadNotifications(): void {
    this.store.dispatch(NotificationsActions.loadNotifications());
  }

  markAsRead(notificationId: string): void {
    this.store.dispatch(
      NotificationsActions.markNotificationAsRead({ notificationId })
    );
  }

  markAllAsRead(): void {
    this.store.dispatch(NotificationsActions.markAllNotificationsAsRead());
  }

  deleteNotification(notificationId: string): void {
    this.store.dispatch(
      NotificationsActions.deleteNotification({ notificationId })
    );
  }

  clearAll(): void {
    this.store.dispatch(NotificationsActions.clearAllNotifications());
  }
}
