import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

export interface NavItem {
  name: string;
  icon: string;
  route?: string;
  disabled?: boolean;
  disabledReason?: string;
  children?: NavItem[];
  expanded?: boolean;
  type?: 'item' | 'expandable' | 'divider';
}

@Component({
  selector: 'app-sidenav',
  imports: [
    MatListModule,
    MatIconModule,
    RouterModule,
    MatDividerModule,
    CommonModule,
    MatExpansionModule,
    MatTooltipModule,
  ],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
})
export class Sidenav {
  navItems: NavItem[] = [
    { name: 'Dashboard', icon: 'dashboard', route: '/dashboard', type: 'item' },
    {
      name: 'Access Management',
      icon: 'security',
      type: 'expandable',
      expanded: false,
      children: [
        {
          name: 'User Access',
          icon: 'person',
          route: '/reports/sales',
          disabled: false,
          type: 'item',
        },
        {
          name: 'Db Access',
          icon: 'storage',
          route: '/reports/sales',
          disabled: false,
          type: 'item',
        },
        {
          name: 'Confluence Access',
          icon: 'article',
          route: '/reports/sales',
          disabled: false,
          type: 'item',
        },
        {
          name: 'AD Group Access',
          icon: 'group',
          route: '/reports/sales',
          disabled: false,
          type: 'item',
        },
      ],
    },
    {
      name: 'Angular Pilot Enablement',
      icon: 'rocket_launch',
      route: '/users',
      type: 'item',
    },
    {
      name: 'Lookup Management',
      icon: 'manage_search',
      route: '/lookup-management',
      type: 'item',
    },
    {
      name: 'Configuration Settings',
      icon: 'settings',
      type: 'expandable',
      expanded: false,
      children: [
        {
          name: 'Application Settings',
          icon: 'settings_applications',
          route: '/booking',
          disabled: false,
          type: 'item',
        },
      ],
    },
    {
      name: 'Log Viewer',
      icon: 'description',
      type: 'expandable',
      expanded: false,
      children: [
        {
          name: 'Splunk',
          icon: 'insights',
          route: '/reports/sales',
          disabled: false,
          type: 'item',
        },
        {
          name: 'IAAS Log',
          icon: 'cloud',
          route: '/reports/sales',
          disabled: false,
          type: 'item',
        },
      ],
    },
    {
      name: 'Monitors',
      icon: 'monitor_heart',
      type: 'expandable',
      expanded: false,
      children: [
        {
          name: 'Application Health',
          icon: 'health_and_safety',
          route: '/reports/sales',
          disabled: false,
          type: 'item',
        },
      ],
    },

    {
      name: 'App Management',
      icon: 'apps',
      route: '/products',
      disabled: true,
      disabledReason: 'App management is currently under maintenance',
      type: 'item',
    },
    { name: 'Forms', icon: 'dynamic_form', route: '/orders', type: 'item' },

    // Reports with submenu items
    {
      name: 'Reports',
      icon: 'assessment',
      type: 'expandable',
      expanded: false,
      children: [
        {
          name: 'Sales Reports',
          icon: 'trending_up',
          route: '/reports/sales',
          disabled: false,
          type: 'item',
        },
        {
          name: 'User Analytics',
          icon: 'people_outline',
          route: '/reports/users',
          disabled: false,
          type: 'item',
        },
        {
          name: 'Financial Reports',
          icon: 'account_balance',
          route: '/reports/financial',
          disabled: true,
          disabledReason: 'Requires premium subscription',
          type: 'item',
        },
        {
          name: 'Inventory Reports',
          icon: 'inventory',
          route: '/reports/inventory',
          disabled: false,
          type: 'item',
        },
        {
          name: 'Performance Metrics',
          icon: 'speed',
          route: '/reports/performance',
          disabled: true,
          disabledReason: 'Feature under maintenance',
          type: 'item',
        },
        {
          name: 'Custom Reports',
          icon: 'build',
          route: '/reports/custom',
          disabled: false,
          type: 'item',
        },
      ],
    },

    // Settings with submenu items
    {
      name: 'Settings',
      icon: 'settings',
      type: 'expandable',
      expanded: false,
      children: [
        {
          name: 'General Settings',
          icon: 'tune',
          route: '/settings/general',
          disabled: false,
          type: 'item',
        },
        {
          name: 'User Preferences',
          icon: 'account_circle',
          route: '/settings/preferences',
          disabled: false,
          type: 'item',
        },
        {
          name: 'Advanced Settings',
          icon: 'settings_applications',
          route: '/settings/advanced',
          disabled: true,
          disabledReason: 'Requires administrator privileges',
          type: 'item',
        },
      ],
    },
  ];

  // Footer items for help and logout
  footerItems: NavItem[] = [
    {
      name: 'Help & Support',
      icon: 'help',
      type: 'expandable',
      expanded: false,
      children: [
        {
          name: 'Documentation',
          icon: 'description',
          route: '/documentation',
          type: 'item',
        },
        {
          name: 'Contact Support',
          icon: 'support_agent',
          route: '/support',
          type: 'item',
        },
        {
          name: 'Report Issue',
          icon: 'bug_report',
          route: '/report-issue',
          type: 'item',
        },
      ],
    },
    { name: 'Logout', icon: 'logout', route: '/logout', type: 'item' },
  ];

  /**
   * Toggle the expanded state of an expandable nav item
   * @param item The nav item to toggle
   * @param event Optional event to prevent default behavior
   */
  toggleExpanded(item: NavItem, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (item.type === 'expandable') {
      item.expanded = !item.expanded;
    }
  }

  /**
   * Check if a nav item is expandable
   * @param item The nav item to check
   * @returns True if the item is expandable
   */
  isExpandable(item: NavItem): boolean {
    return (
      item.type === 'expandable' && !!item.children && item.children.length > 0
    );
  }

  /**
   * Check if a nav item is a regular clickable item
   * @param item The nav item to check
   * @returns True if the item is a regular item
   */
  isRegularItem(item: NavItem): boolean {
    return item.type === 'item';
  }
}
