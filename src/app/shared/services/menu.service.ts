import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuSection, TopNavConfig } from '../interfaces/menu.interface';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private topNavConfigSubject = new BehaviorSubject<TopNavConfig>(
    this.getDefaultConfig()
  );
  public topNavConfig$: Observable<TopNavConfig> =
    this.topNavConfigSubject.asObservable();

  private activeMenuTabSubject = new BehaviorSubject<string>('dashboard');
  public activeMenuTab$: Observable<string> =
    this.activeMenuTabSubject.asObservable();

  constructor() {}

  /**
   * Get the current top navigation configuration
   */
  getTopNavConfig(): TopNavConfig {
    return this.topNavConfigSubject.value;
  }

  /**
   * Update the entire top navigation configuration
   */
  updateTopNavConfig(config: TopNavConfig): void {
    this.topNavConfigSubject.next(config);
  }

  /**
   * Add a new menu section
   */
  addMenuSection(section: MenuSection): void {
    const currentConfig = this.getTopNavConfig();
    currentConfig.menuSections.push(section);
    currentConfig.menuSections.sort((a, b) => a.order - b.order);
    this.updateTopNavConfig(currentConfig);
  }

  /**
   * Remove a menu section by ID
   */
  removeMenuSection(sectionId: string): void {
    const currentConfig = this.getTopNavConfig();
    currentConfig.menuSections = currentConfig.menuSections.filter(
      (s) => s.id !== sectionId
    );
    this.updateTopNavConfig(currentConfig);
  }

  /**
   * Update a specific menu section
   */
  updateMenuSection(sectionId: string, section: Partial<MenuSection>): void {
    const currentConfig = this.getTopNavConfig();
    const index = currentConfig.menuSections.findIndex(
      (s) => s.id === sectionId
    );
    if (index !== -1) {
      currentConfig.menuSections[index] = {
        ...currentConfig.menuSections[index],
        ...section,
      };
      this.updateTopNavConfig(currentConfig);
    }
  }

  /**
   * Set the active menu tab
   */
  setActiveMenuTab(tabId: string): void {
    this.activeMenuTabSubject.next(tabId);
  }

  /**
   * Get the current active menu tab
   */
  getActiveMenuTab(): string {
    return this.activeMenuTabSubject.value;
  }

  /**
   * Default configuration for the top navigation
   */
  private getDefaultConfig(): TopNavConfig {
    return {
      menuSections: [
        {
          id: 'health',
          label: 'Health Check',
          order: 1,
          items: [
            {
              id: 'health',
              label: 'Health Check',
              icon: 'health_and_safety',
              routerLink: '/dashboard',
              action: 'navigate',
            },
          ],
        },
        {
          id: 'resources',
          label: 'Resources',
          order: 2,
          items: [
            {
              id: 'resources-main',
              label: 'Resources',
              icon: 'people',
              children: [
                {
                  id: 'all-resources',
                  label: 'All Resources',
                  icon: 'list',
                  routerLink: '/users',
                  action: 'navigate',
                },
                {
                  id: 'resource-management',
                  label: 'Resource Management',
                  icon: 'manage_accounts',
                  children: [
                    {
                      id: 'create-resource',
                      label: 'Create Resource',
                      icon: 'person_add',
                      action: 'createUser',
                    },
                    {
                      id: 'import-resources',
                      label: 'Import Resources',
                      icon: 'upload',
                      action: 'importUsers',
                    },
                    {
                      id: 'export-resources',
                      label: 'Export Resources',
                      icon: 'download',
                      action: 'exportUsers',
                    },
                    {
                      id: 'resource-templates',
                      label: 'Resource Templates',
                      icon: 'description',
                      action: 'userTemplates',
                      dividerAfter: true,
                    },
                  ],
                },
                {
                  id: 'resource-roles',
                  label: 'Roles & Permissions',
                  icon: 'security',
                  children: [
                    {
                      id: 'manage-roles',
                      label: 'Manage Roles',
                      icon: 'admin_panel_settings',
                      action: 'manageRoles',
                    },
                    {
                      id: 'permission-matrix',
                      label: 'Permission Matrix',
                      icon: 'grid_on',
                      action: 'permissionMatrix',
                    },
                    {
                      id: 'role-templates',
                      label: 'Role Templates',
                      icon: 'copy',
                      action: 'roleTemplates',
                    },
                  ],
                },
                {
                  id: 'bulk-operations',
                  label: 'Bulk Operations',
                  icon: 'group_work',
                  action: 'bulkResourceOperations',
                  dividerAfter: true,
                },
              ],
            },
          ],
        },
        {
          id: 'queue',
          label: 'Messaging',
          order: 3,
          items: [
            {
              id: 'queue-main',
              label: 'Messaging',
              icon: 'message',
              children: [
                {
                  id: 'all-orders',
                  label: 'All Messages',
                  icon: 'mail',
                  routerLink: '/orders',
                  action: 'navigate',
                },
                {
                  id: 'order-status',
                  label: 'Message Status',
                  icon: 'mark_email_read',
                  children: [
                    {
                      id: 'pending-orders',
                      label: 'Pending Messages',
                      icon: 'schedule_send',
                      action: 'pendingOrders',
                    },
                    {
                      id: 'processing-orders',
                      label: 'Processing Messages',
                      icon: 'hourglass_empty',
                      action: 'processingOrders',
                    },
                    {
                      id: 'shipped-orders',
                      label: 'Sent Messages',
                      icon: 'send',
                      action: 'shippedOrders',
                    },
                    {
                      id: 'delivered-orders',
                      label: 'Delivered Messages',
                      icon: 'mark_email_read',
                      action: 'deliveredOrders',
                    },
                    {
                      id: 'cancelled-orders',
                      label: 'Failed Messages',
                      icon: 'error',
                      action: 'cancelledOrders',
                    },
                  ],
                },
                {
                  id: 'order-reports',
                  label: 'Message Reports',
                  icon: 'analytics',
                  children: [
                    {
                      id: 'sales-report',
                      label: 'Message Volume Report',
                      icon: 'bar_chart',
                      action: 'salesReport',
                    },
                    {
                      id: 'order-analytics',
                      label: 'Message Analytics',
                      icon: 'analytics',
                      action: 'orderAnalytics',
                    },
                    {
                      id: 'customer-report',
                      label: 'Recipients Report',
                      icon: 'people',
                      action: 'customerReport',
                    },
                  ],
                },
                {
                  id: 'create-order',
                  label: 'Compose Message',
                  icon: 'edit',
                  action: 'createOrder',
                  dividerAfter: true,
                },
                {
                  id: 'order-settings',
                  label: 'Message Settings',
                  icon: 'settings',
                  action: 'orderSettings',
                },
              ],
            },
          ],
        },
        {
          id: 'documents',
          label: 'Documents',
          order: 4,
          items: [
            {
              id: 'documents-main',
              label: 'Documents',
              icon: 'description',
              children: [
                {
                  id: 'financial-reports',
                  label: 'Financial Reports',
                  icon: 'account_balance',
                  children: [
                    {
                      id: 'profit-loss',
                      label: 'Profit & Loss',
                      icon: 'trending_up',
                      action: 'profitLossReport',
                    },
                    {
                      id: 'balance-sheet',
                      label: 'Balance Sheet',
                      icon: 'account_balance_wallet',
                      action: 'balanceSheetReport',
                    },
                    {
                      id: 'cash-flow',
                      label: 'Cash Flow',
                      icon: 'water_drop',
                      action: 'cashFlowReport',
                    },
                    {
                      id: 'revenue-report',
                      label: 'Revenue Report',
                      icon: 'attach_money',
                      action: 'revenueReport',
                    },
                  ],
                },
                {
                  id: 'operational-reports',
                  label: 'Operational Reports',
                  icon: 'business',
                  children: [
                    {
                      id: 'inventory-report',
                      label: 'Inventory Report',
                      icon: 'inventory',
                      action: 'inventoryReport',
                    },
                    {
                      id: 'performance-report',
                      label: 'Performance Report',
                      icon: 'speed',
                      action: 'performanceReport',
                    },
                    {
                      id: 'productivity-report',
                      label: 'Productivity Report',
                      icon: 'work',
                      action: 'productivityReport',
                    },
                  ],
                },
                {
                  id: 'custom-reports',
                  label: 'Custom Reports',
                  icon: 'tune',
                  children: [
                    {
                      id: 'create-custom-report',
                      label: 'Create Custom Report',
                      icon: 'add',
                      action: 'createCustomReport',
                    },
                    {
                      id: 'saved-reports',
                      label: 'Saved Reports',
                      icon: 'bookmark',
                      action: 'savedReports',
                    },
                    {
                      id: 'report-templates',
                      label: 'Report Templates',
                      icon: 'description',
                      action: 'reportTemplates',
                    },
                  ],
                },
                {
                  id: 'report-builder',
                  label: 'Report Builder',
                  icon: 'build',
                  action: 'reportBuilder',
                  dividerAfter: true,
                },
                {
                  id: 'scheduled-reports',
                  label: 'Scheduled Reports',
                  icon: 'schedule',
                  action: 'scheduledReports',
                },
              ],
            },
          ],
        },
        {
          id: 'settings',
          label: 'Settings',
          order: 5,
          items: [
            {
              id: 'settings-main',
              label: 'Settings',
              icon: 'settings',
              children: [
                {
                  id: 'system-settings',
                  label: 'System Settings',
                  icon: 'settings_system_daydream',
                  children: [
                    {
                      id: 'general-settings',
                      label: 'General Settings',
                      icon: 'tune',
                      action: 'generalSettings',
                    },
                    {
                      id: 'email-settings',
                      label: 'Email Settings',
                      icon: 'email',
                      action: 'emailSettings',
                    },
                    {
                      id: 'notification-settings',
                      label: 'Notification Settings',
                      icon: 'notifications',
                      action: 'notificationSettings',
                    },
                    {
                      id: 'integration-settings',
                      label: 'Integration Settings',
                      icon: 'integration_instructions',
                      action: 'integrationSettings',
                    },
                  ],
                },
                {
                  id: 'user-preferences',
                  label: 'User Preferences',
                  icon: 'person_pin',
                  children: [
                    {
                      id: 'profile-settings',
                      label: 'Profile Settings',
                      icon: 'account_circle',
                      action: 'profileSettings',
                    },
                    {
                      id: 'theme-settings',
                      label: 'Theme Settings',
                      icon: 'palette',
                      action: 'themeSettings',
                    },
                    {
                      id: 'language-settings',
                      label: 'Language Settings',
                      icon: 'language',
                      action: 'languageSettings',
                    },
                  ],
                },
                {
                  id: 'security-settings',
                  label: 'Security Settings',
                  icon: 'security',
                  children: [
                    {
                      id: 'password-policy',
                      label: 'Password Policy',
                      icon: 'lock',
                      action: 'passwordPolicy',
                    },
                    {
                      id: 'two-factor-auth',
                      label: 'Two-Factor Auth',
                      icon: 'verified_user',
                      action: 'twoFactorAuth',
                    },
                    {
                      id: 'session-settings',
                      label: 'Session Settings',
                      icon: 'schedule',
                      action: 'sessionSettings',
                    },
                  ],
                },
                {
                  id: 'backup-restore',
                  label: 'Backup & Restore',
                  icon: 'backup',
                  action: 'backupRestore',
                  dividerAfter: true,
                },
              ],
            },
          ],
        },
        {
          id: 'audit',
          label: 'Audit Log',
          order: 6,
          items: [
            {
              id: 'audit',
              label: 'Audit Log',
              icon: 'history',
              routerLink: '/audit',
              action: 'navigate',
            },
          ],
        },
      ],
      actionButtons: [
        {
          id: 'search',
          icon: 'search',
          tooltip: 'Search',
          action: 'performSearch',
          order: 1,
        },
        {
          id: 'export',
          icon: 'download',
          tooltip: 'Export Data',
          action: 'exportData',
          order: 2,
        },
        {
          id: 'import',
          icon: 'upload',
          tooltip: 'Import Data',
          action: 'importData',
          order: 3,
        },
        {
          id: 'more',
          icon: 'more_vert',
          tooltip: 'More Options',
          action: 'openMoreMenu',
          order: 4,
        },
      ],
    };
  }
}
