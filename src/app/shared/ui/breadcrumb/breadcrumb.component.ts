import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { NavigationStore } from '../../../core/state/navigation/navigation.store';

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
  | 'bold'
  | 'arrow-flow';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  @Input() breadcrumbStyle: BreadcrumbStyle = 'ultra-dark';

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private navigationStore = inject(NavigationStore);

  // Angular 20 Signals for reactive state
  private _currentUrl = signal('');

  // Direct signal access from NavigationStore
  public breadcrumbs = this.navigationStore.breadcrumbs;
  public routeMappings = this.navigationStore.routeMappings;
  public breadcrumbStyles = this.navigationStore.breadcrumbStyles;
  public isLoading = this.navigationStore.breadcrumbLoading;

  // Computed signals
  public currentUrl = computed(() => this._currentUrl());
  public hasBreadcrumbs = computed(() => this.breadcrumbs().length > 0);

  constructor() {}

  ngOnInit(): void {
    // Initialize breadcrumb data if not loaded
    this.initializeBreadcrumbData();

    // Subscribe to router events to update breadcrumbs
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.router.url)
      )
      .subscribe((url) => {
        this._currentUrl.set(url);
        // Wait a bit for data to be loaded before building breadcrumbs
        setTimeout(() => this.buildBreadcrumbsFromRoute(url), 100);
      });

    // Build initial breadcrumbs after a short delay to ensure data is loaded
    const currentUrl = this.router.url;
    this._currentUrl.set(currentUrl);
    setTimeout(() => {
      this.buildBreadcrumbsFromRoute(currentUrl);
    }, 200);
  }

  private initializeBreadcrumbData(): void {
    // MenuService already loads all navigation data including breadcrumb config
    // via loadAllNavigationData() - no need to load separately
    // The component will reactively update when data becomes available through signals
  }

  private buildBreadcrumbsFromRoute(url: string): void {
    this.navigationStore.buildBreadcrumbsFromRoute(url);
  }

  /**
   * Navigate to a specific URL
   */
  navigateTo(url: string): void {
    this.router.navigate([url]);
  }

  /**
   * Check if the given URL is the current route
   */
  isCurrentRoute(url: string): boolean {
    return this.router.url === url;
  }

  /**
   * Update the breadcrumb style
   */
  setBreadcrumbStyle(style: BreadcrumbStyle): void {
    this.breadcrumbStyle = style;
    this.navigationStore.setBreadcrumbStyle(style);
  }

  /**
   * Get available breadcrumb styles
   */
  getAvailableStyles() {
    return this.breadcrumbStyles();
  }

  /**
   * Refresh breadcrumb data
   */
  refreshBreadcrumbData(): void {
    this.navigationStore.loadBreadcrumbConfig();
  }
}
