import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Notification,
  NotificationConfiguration,
  NotificationSettings,
} from './notifications.state';

@Injectable({
  providedIn: 'root',
})
export class NotificationsApiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3001';

  // Load all notifications configuration
  loadNotificationsConfig(): Observable<NotificationConfiguration> {
    return this.http
      .get<NotificationConfiguration[]>(`${this.apiUrl}/notifications`)
      .pipe(map((response) => response[0])); // Get first configuration
  }

  // Load notifications
  loadNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/notifications`);
  }

  // Create notification
  createNotification(
    notification: Omit<Notification, 'id' | 'timestamp'>
  ): Observable<Notification> {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    return this.http.post<Notification>(
      `${this.apiUrl}/notifications`,
      newNotification
    );
  }

  // Update notification
  updateNotification(notification: Notification): Observable<Notification> {
    return this.http.put<Notification>(
      `${this.apiUrl}/notifications/${notification.id}`,
      notification
    );
  }

  // Mark notification as read
  markNotificationAsRead(notificationId: string): Observable<Notification> {
    return this.http.patch<Notification>(
      `${this.apiUrl}/notifications/${notificationId}`,
      { read: true }
    );
  }

  // Mark all notifications as read
  markAllNotificationsAsRead(): Observable<Notification[]> {
    return this.http.patch<Notification[]>(
      `${this.apiUrl}/notifications/mark-all-read`,
      {}
    );
  }

  // Delete notification
  deleteNotification(notificationId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/notifications/${notificationId}`
    );
  }

  // Delete all read notifications
  deleteAllReadNotifications(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/notifications/read`);
  }

  // Clear all notifications
  clearAllNotifications(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/notifications`);
  }

  // Update notification settings
  updateNotificationSettings(
    settings: NotificationSettings
  ): Observable<NotificationSettings> {
    return this.http.put<NotificationSettings>(
      `${this.apiUrl}/settings/notifications`,
      settings
    );
  }

  // Load notification settings
  loadNotificationSettings(): Observable<NotificationSettings> {
    return this.http.get<NotificationSettings>(
      `${this.apiUrl}/settings/notifications`
    );
  }

  // Bulk operations
  bulkMarkAsRead(notificationIds: string[]): Observable<Notification[]> {
    return this.http.patch<Notification[]>(
      `${this.apiUrl}/notifications/bulk-read`,
      { ids: notificationIds }
    );
  }

  bulkDelete(notificationIds: string[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/notifications/bulk-delete`, {
      ids: notificationIds,
    });
  }

  // Refresh notifications (same as load but for cache busting)
  refreshNotifications(): Observable<Notification[]> {
    return this.loadNotifications();
  }
}
