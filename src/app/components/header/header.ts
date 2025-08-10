import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

interface InfoPanel {
  label: string;
  value: string;
}

interface MetricPanel {
  label: string;
  value: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  time: Date;
  read: boolean;
}

interface CurrentUser {
  name: string;
  role: string;
  email: string;
}

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    CommonModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Input() drawer!: MatSidenav;
  @Input() isHandset!: boolean | null;

  infoPanels: InfoPanel[] = [
    { label: 'Active Users', value: '24' },
    { label: 'Server Load', value: '67%' },
    { label: 'Memory', value: '4.2GB' },
    { label: 'Uptime', value: '12d 3h' },
  ];

  // Top metrics for dashboard overview
  topMetrics: MetricPanel[] = [
    { label: 'Approved', value: '$13,261.7K', color: 'success' },
    { label: 'Defaulted', value: '$881.0K', color: 'error' },
    { label: 'Approval Rate', value: '60.6%', color: 'primary' },
    { label: 'Default Rate', value: '6.6%', color: 'warning' },
  ];

  // Notifications
  hasUnreadNotifications = true;
  unreadCount = 5;
  notifications: Notification[] = [
    {
      id: '1',
      title: 'System Update',
      message: 'System maintenance scheduled for tonight at 2 AM',
      type: 'warning',
      time: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      read: false,
    },
    {
      id: '2',
      title: 'New User Registration',
      message: 'John Doe has registered as a new user',
      type: 'info',
      time: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false,
    },
    {
      id: '3',
      title: 'Database Backup Complete',
      message: 'Daily backup completed successfully',
      type: 'success',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
    },
    {
      id: '4',
      title: 'High CPU Usage',
      message: 'Server CPU usage is above 85%',
      type: 'error',
      time: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      read: false,
    },
    {
      id: '5',
      title: 'Report Generated',
      message: 'Monthly sales report is ready for download',
      type: 'info',
      time: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      read: false,
    },
  ];

  // Current user info
  currentUser: CurrentUser = {
    name: 'Watson Joyce',
    role: 'Administrator',
    email: 'admin@company.com',
  };

  // Quick Tools Methods
  openCalculator() {
    console.log('Opening calculator...');
    // Implementation would open a calculator widget or external app
  }

  openNotepad() {
    console.log('Opening notepad...');
    // Implementation would open a notes widget or external app
  }

  // Data Tools Methods
  exportAllData() {
    console.log('Exporting all data...');
    // Implementation would trigger data export
  }

  importData() {
    console.log('Importing data...');
    // Implementation would open import dialog
  }

  backupDatabase() {
    console.log('Starting database backup...');
    // Implementation would trigger backup process
  }

  dataValidation() {
    console.log('Starting data validation...');
    // Implementation would run data validation checks
  }

  // Reports Methods
  generateDailyReport() {
    console.log('Generating daily report...');
    // Implementation would generate daily report
  }

  generateWeeklyReport() {
    console.log('Generating weekly report...');
    // Implementation would generate weekly report
  }

  generateMonthlyReport() {
    console.log('Generating monthly report...');
    // Implementation would generate monthly report
  }

  customReport() {
    console.log('Opening custom report builder...');
    // Implementation would open custom report builder
  }

  // Integration Methods
  syncWithERP() {
    console.log('Syncing with ERP system...');
    // Implementation would sync with ERP
  }

  connectToAPI() {
    console.log('Managing API connections...');
    // Implementation would open API management
  }

  webhookSettings() {
    console.log('Opening webhook settings...');
    // Implementation would open webhook configuration
  }

  // Notification Methods
  markAllAsRead() {
    this.notifications.forEach((notification) => (notification.read = true));
    this.unreadCount = 0;
    this.hasUnreadNotifications = false;
    console.log('All notifications marked as read');
  }

  markAsRead(notification: Notification) {
    notification.read = true;
    this.unreadCount = this.notifications.filter((n) => !n.read).length;
    this.hasUnreadNotifications = this.unreadCount > 0;
    console.log(`Notification ${notification.id} marked as read`);
  }

  viewAllNotifications() {
    console.log('Opening notifications page...');
    // Implementation would navigate to notifications page
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
    // Implementation would navigate to user management
  }

  manageRoles() {
    console.log('Opening role management...');
    // Implementation would open role management
  }

  activeUsers() {
    console.log('Viewing active user sessions...');
    // Implementation would show active sessions
  }

  userAudit() {
    console.log('Opening user audit trail...');
    // Implementation would show user audit logs
  }

  generalSettings() {
    console.log('Opening general settings...');
    // Implementation would open general settings
  }

  emailSettings() {
    console.log('Opening email configuration...');
    // Implementation would open email settings
  }

  databaseSettings() {
    console.log('Opening database settings...');
    // Implementation would open database configuration
  }

  backupSettings() {
    console.log('Opening backup configuration...');
    // Implementation would open backup settings
  }

  passwordPolicy() {
    console.log('Opening password policy settings...');
    // Implementation would open password policy configuration
  }

  twoFactorAuth() {
    console.log('Opening two-factor authentication settings...');
    // Implementation would open 2FA settings
  }

  accessControl() {
    console.log('Opening access control settings...');
    // Implementation would open access control
  }

  securityLogs() {
    console.log('Opening security logs...');
    // Implementation would show security logs
  }

  systemHealth() {
    console.log('Checking system health...');
    // Implementation would show system health dashboard
  }

  clearCache() {
    console.log('Clearing cache...');
    // Implementation would clear system cache
  }

  optimizeDatabase() {
    console.log('Optimizing database...');
    // Implementation would optimize database
  }

  systemRestart() {
    console.log('Initiating system restart...');
    // Implementation would restart system with confirmation
  }

  viewSystemLogs() {
    console.log('Opening system logs...');
    // Implementation would show system logs
  }

  // User Profile Methods
  viewProfile() {
    console.log('Opening user profile...');
    // Implementation would open user profile page
  }

  changePassword() {
    console.log('Opening change password dialog...');
    // Implementation would open password change dialog
  }

  myActivity() {
    console.log('Viewing my activity...');
    // Implementation would show user activity history
  }

  helpSupport() {
    console.log('Opening help and support...');
    // Implementation would open help documentation or support
  }

  logout() {
    console.log('Logging out...');
    // Implementation would handle user logout
  }

  // Preferences Methods
  themeSettings() {
    console.log('Opening theme settings...');
    // Implementation would open theme customization
  }

  languageSettings() {
    console.log('Opening language settings...');
    // Implementation would open language selection
  }

  notificationSettings() {
    console.log('Opening notification settings...');
    // Implementation would open notification preferences
  }

  privacySettings() {
    console.log('Opening privacy settings...');
    // Implementation would open privacy configuration
  }
}
