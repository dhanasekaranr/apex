import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import {
  ActionButton,
  MenuItem,
} from '../../../shared/interfaces/menu.interface';
import { MenuService } from '../../../shared/services/menu.service';

@Component({
  selector: 'app-topnav',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './topnav.html',
  styleUrl: './topnav.scss',
})
export class TopnavComponent implements OnInit {
  // Inject services using modern inject() function
  private menuService = inject(MenuService);
  private router = inject(Router);

  // Signal properties for reactive state management
  searchText = signal<string>('');

  // Direct signal access from MenuService
  topNavConfig = this.menuService.topNavConfig;
  activeMenuTab = this.menuService.activeMenuTab;

  // Current user info
  currentUser = {
    name: 'Watson Joyce',
    role: 'Administrator',
    email: 'admin@company.com',
  };

  // Event emitters for parent component communication
  @Output() menuTabChanged = new EventEmitter<string>();
  @Output() searchPerformed = new EventEmitter<string>();
  @Output() notificationsOpened = new EventEmitter<void>();
  @Output() dataExported = new EventEmitter<void>();
  @Output() dataImported = new EventEmitter<void>();
  @Output() helpOpened = new EventEmitter<void>();
  @Output() settingsOpened = new EventEmitter<void>();

  ngOnInit(): void {
    // Initialize component
  }

  setActiveMenuTab(tab: string): void {
    this.menuService.setActiveMenuTab(tab);
    this.menuTabChanged.emit(tab);
  }

  onMenuItemClicked(item: MenuItem, parentItem?: MenuItem): void {
    if (item.action) {
      this.executeAction(item.action);
    }
    if (item.routerLink) {
      this.router.navigate([item.routerLink]);
      // If there's a parent, set parent as active, otherwise set item itself
      const activeTabId = parentItem ? parentItem.id : item.id;
      this.setActiveMenuTab(activeTabId);
    }
  }

  onActionButtonClicked(button: ActionButton): void {
    this.executeAction(button.action);
  }

  hasChildren(item: MenuItem): boolean {
    return !!(item.children && item.children.length > 0);
  }

  getChildrenById(parentItem: MenuItem, childId: string): MenuItem[] {
    const child = parentItem.children?.find((c) => c.id === childId);
    return child?.children || [];
  }

  isParentActive(item: MenuItem): boolean {
    // Check if the item itself is active
    if (this.activeMenuTab() === item.id) {
      return true;
    }

    // Check if any child is active by checking if current route matches child routes
    if (item.children && item.children.length > 0) {
      const currentUrl = this.router.url;
      return this.checkChildrenActive(item.children, currentUrl);
    }

    return false;
  }

  private checkChildrenActive(
    children: MenuItem[],
    currentUrl: string
  ): boolean {
    for (const child of children) {
      // Check if child's route matches current URL
      if (child.routerLink && currentUrl.includes(child.routerLink)) {
        return true;
      }

      // Recursively check nested children
      if (child.children && child.children.length > 0) {
        if (this.checkChildrenActive(child.children, currentUrl)) {
          return true;
        }
      }
    }

    return false;
  }

  private executeAction(action: string): void {
    switch (action) {
      case 'performSearch':
        this.performSearch();
        break;
      case 'openNotifications':
        this.openNotifications();
        break;
      case 'exportData':
        this.exportData();
        break;
      case 'importData':
        this.importData();
        break;
      case 'openHelp':
        this.openHelp();
        break;
      case 'openSettings':
        this.openSettings();
        break;
      default:
      // TODO: Implement action handler for: ${action}
    }
  }

  performSearch(): void {
    this.searchPerformed.emit(this.searchText());
  }

  openNotifications(): void {
    this.notificationsOpened.emit();
  }

  exportData(): void {
    this.dataExported.emit();
  }

  importData(): void {
    this.dataImported.emit();
  }

  openHelp(): void {
    this.helpOpened.emit();
  }

  openSettings(): void {
    this.settingsOpened.emit();
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
