import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Notification } from '../../state/notifications/notifications.state';
import { NotificationsStore } from '../../state/notifications/notifications.store';

interface CurrentUser {
  name: string;
  role: string;
  email: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule,
    CommonModule,
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer implements OnInit {
  // NotificationsStore injection
  private notificationsStore = inject(NotificationsStore);

  // Direct signal access from NotificationsStore
  notifications = this.notificationsStore.allNotifications;
  unreadCount = this.notificationsStore.unreadCount;
  hasUnreadNotifications = this.notificationsStore.hasUnreadNotifications;
  isDataLoaded = this.notificationsStore.isLoaded;

  // Computed signals for enhanced functionality
  recentNotifications = this.notificationsStore.recentNotifications;

  // Current user info
  currentUser: CurrentUser = {
    name: 'Watson Joyce',
    role: 'Administrator',
    email: 'admin@company.com',
  };

  // Angular 20 signal for reactive current year
  private readonly _currentDate = signal(new Date());

  readonly currentYear = computed(() => this._currentDate().getFullYear());
  readonly appName = signal('Apex Dashboard');
  readonly version = signal('2.0.0');

  // System information signals
  readonly buildNumber = signal('APEX-2024.09.20-1247');
  readonly environment = signal('Production');
  readonly timezone = computed(() => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  });
  readonly dateFormat = signal('MM/dd/yyyy');
  readonly timeFormat = signal('12-hour');
  readonly currentDateTime = computed(() => {
    const now = this._currentDate();
    return now.toLocaleString('en-US', {
      timeZone: this.timezone(),
      dateStyle: 'medium',
      timeStyle: 'medium',
    });
  });
  readonly userAgent = computed(() => navigator.userAgent);
  readonly screenResolution = computed(
    () => `${screen.width}x${screen.height}`
  );

  ngOnInit(): void {
    // Load notifications data if not already loaded
    if (!this.isDataLoaded()) {
      console.log(
        '🚀 Loading notifications configuration from NotificationsStore'
      );
      this.notificationsStore.loadNotificationsConfig();
    }
  }

  /**
   * Update current date (for testing or manual refresh)
   */
  refreshDate(): void {
    this._currentDate.set(new Date());
  }

  /**
   * Show system information popover
   * Displays build number, timezone, date format, and other system details
   */
  showSystemInfo(): void {
    // This method will be handled by the mat-menu trigger in the template
    // The menu will automatically open when the button is clicked
    this.refreshDate(); // Update current time when opening
  }

  /**
   * Copy system information to clipboard
   */
  copySystemInfo(): void {
    const systemInfo = `
Apex Dashboard - System Information
===================================
App Version: ${this.version()}
Build Number: ${this.buildNumber()}
Environment: ${this.environment()}
Timezone: ${this.timezone()}
Date Format: ${this.dateFormat()}
Time Format: ${this.timeFormat()}
Current Time: ${this.currentDateTime()}
Screen Resolution: ${this.screenResolution()}
User Agent: ${this.userAgent()}
    `.trim();

    navigator.clipboard
      .writeText(systemInfo)
      .then(() => {
        console.log('System information copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy system information', err);
      });
  }

  /**
   * Alternative: Show social media menu
   */
  private showSocialMenu(): void {
    // Implementation for social menu
    console.log('Social media menu would open here');
  }

  // Quick Tools Methods
  openCalculator() {
    console.log('Opening calculator...');
  }

  openCalendar() {
    console.log('Opening calendar...');
  }

  // Data Tools Methods
  exportAllData() {
    console.log('Exporting all data...');
  }

  importData() {
    console.log('Importing data...');
  }

  backupDatabase() {
    console.log('Starting database backup...');
  }

  dataValidation() {
    console.log('Starting data validation...');
  }

  // Reports Methods
  generateDailyReport() {
    console.log('Generating daily report...');
  }

  generateWeeklyReport() {
    console.log('Generating weekly report...');
  }

  generateMonthlyReport() {
    console.log('Generating monthly report...');
  }

  customReport() {
    console.log('Opening custom report builder...');
  }

  // Integration Methods
  syncWithERP() {
    console.log('Syncing with ERP system...');
  }

  connectToAPI() {
    console.log('Managing API connections...');
  }

  webhookSettings() {
    console.log('Opening webhook settings...');
  }

  // Notification Methods using NotificationsStore
  markAllAsRead() {
    console.log('🔄 Marking all notifications as read via NotificationsStore');
    this.notificationsStore.markAllNotificationsAsRead();
  }

  markAsRead(notification: Notification) {
    console.log(
      `🔄 Marking notification ${notification.id} as read via NotificationsStore`
    );
    this.notificationsStore.markNotificationAsRead(notification.id);
  }

  viewAllNotifications() {
    console.log('Opening notifications page...');
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'success':
        return 'check_circle';
      case 'info':
      default:
        return 'info';
    }
  }

  getNotificationColor(type: string): string {
    switch (type) {
      case 'warning':
        return 'warn';
      case 'error':
        return 'warn';
      case 'success':
        return 'primary';
      case 'info':
      default:
        return 'accent';
    }
  }

  // System Admin Methods
  manageUsers() {
    console.log('Opening user management...');
  }

  manageRoles() {
    console.log('Opening role management...');
  }

  activeUsers() {
    console.log('Viewing active user sessions...');
  }

  userAudit() {
    console.log('Opening user audit trail...');
  }

  generalSettings() {
    console.log('Opening general settings...');
  }

  emailSettings() {
    console.log('Opening email configuration...');
  }

  databaseSettings() {
    console.log('Opening database settings...');
  }

  backupSettings() {
    console.log('Opening backup configuration...');
  }

  passwordPolicy() {
    console.log('Opening password policy settings...');
  }

  twoFactorAuth() {
    console.log('Opening two-factor authentication settings...');
  }

  accessControl() {
    console.log('Opening access control settings...');
  }

  securityLogs() {
    console.log('Opening security logs...');
  }

  systemHealth() {
    console.log('Checking system health...');
  }

  clearCache() {
    console.log('Clearing cache...');
  }

  optimizeDatabase() {
    console.log('Optimizing database...');
  }

  systemRestart() {
    console.log('Initiating system restart...');
  }

  viewSystemLogs() {
    console.log('Opening system logs...');
  }

  // User Profile Methods
  viewProfile() {
    console.log('Opening user profile...');
  }

  changePassword() {
    console.log('Opening change password dialog...');
  }

  myActivity() {
    console.log('Viewing my activity...');
  }

  logout() {
    console.log('Logging out...');
  }

  // Preferences Methods
  themeSettings() {
    console.log('Opening theme settings...');
  }

  languageSettings() {
    console.log('Opening language settings...');
  }

  notificationSettings() {
    console.log('Opening notification settings...');
  }

  privacySettings() {
    console.log('Opening privacy settings...');
  }
}
