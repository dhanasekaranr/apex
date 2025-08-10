import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

export interface BreadcrumbItem {
  label: string;
  url: string;
  icon?: string;
}

export type BreadcrumbStyle =
  | 'default'
  | 'minimal'
  | 'pill'
  | 'card'
  | 'underline'
  | 'subtle'
  | 'ultra-dark'
  | 'elegant'
  | 'compact'
  | 'bold';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  @Input() breadcrumbStyle: BreadcrumbStyle = 'ultra-dark';
  breadcrumbs: BreadcrumbItem[] = [];

  // Route mappings for better breadcrumb labels
  private routeLabels: { [key: string]: { label: string; icon?: string } } = {
    dashboard: { label: 'Dashboard', icon: 'dashboard' },
    analytics: { label: 'Analytics', icon: 'analytics' },
    users: { label: 'Users', icon: 'people' },
    products: { label: 'Products', icon: 'inventory' },
    orders: { label: 'Orders', icon: 'shopping_cart' },
    reports: { label: 'Reports', icon: 'assessment' },
    'lookup-management': { label: 'Lookup Management', icon: 'manage_search' },
    settings: { label: 'Settings', icon: 'settings' },
    general: { label: 'General', icon: 'tune' },
    preferences: { label: 'Preferences', icon: 'person_pin' },
    documentation: { label: 'Documentation', icon: 'help_center' },
    help: { label: 'Help & Support', icon: 'help' },
  };

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    // Subscribe to router events to update breadcrumbs
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        mergeMap((route) => route.url)
      )
      .subscribe(() => {
        this.buildBreadcrumbs();
      });

    // Build initial breadcrumbs
    this.buildBreadcrumbs();
  }

  private buildBreadcrumbs(): void {
    const url = this.router.url;
    const urlSegments = url.split('/').filter((segment) => segment);

    this.breadcrumbs = [];

    // Always add Home/Dashboard as first breadcrumb
    this.breadcrumbs.push({
      label: 'Dashboard',
      url: '/dashboard',
      icon: 'dashboard',
    });

    // Build breadcrumbs from URL segments
    let currentUrl = '';
    urlSegments.forEach((segment, index) => {
      currentUrl += `/${segment}`;

      // Skip if this is the dashboard route (already added)
      if (segment === 'dashboard') {
        return;
      }

      const routeConfig = this.routeLabels[segment];
      const isLast = index === urlSegments.length - 1;

      this.breadcrumbs.push({
        label: routeConfig?.label || this.formatSegment(segment),
        url: currentUrl,
        icon: routeConfig?.icon,
      });
    });
  }

  private formatSegment(segment: string): string {
    // Convert kebab-case to Title Case
    return segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  navigateTo(url: string): void {
    this.router.navigate([url]);
  }

  isCurrentRoute(url: string): boolean {
    return this.router.url === url;
  }
}
