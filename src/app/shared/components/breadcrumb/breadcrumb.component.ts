import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import {
  NavigationActions,
  NavigationSelectors,
} from '../../../store/navigation';

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
  private store = inject(Store);

  // Angular 20 Signals for reactive state
  private _currentUrl = signal('');

  // Convert NgRx selectors to signals
  public breadcrumbs = toSignal(
    this.store.select(NavigationSelectors.selectCurrentBreadcrumbs),
    { initialValue: [] }
  );

  public routeMappings = toSignal(
    this.store.select(NavigationSelectors.selectBreadcrumbRouteMappings),
    { initialValue: {} }
  );

  public breadcrumbStyles = toSignal(
    this.store.select(NavigationSelectors.selectBreadcrumbStyles),
    { initialValue: [] }
  );

  public isLoading = toSignal(
    this.store.select(NavigationSelectors.selectBreadcrumbLoading),
    { initialValue: false }
  );

  // Computed signals
  public currentUrl = computed(() => this._currentUrl());
  public hasBreadcrumbs = computed(() => this.breadcrumbs().length > 0);

  constructor() {}

  ngOnInit(): void {
    console.log('🔄 BreadcrumbComponent: Initializing');

    // Initialize breadcrumb data if not loaded
    this.initializeBreadcrumbData();

    // Subscribe to router events to update breadcrumbs
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.router.url)
      )
      .subscribe((url) => {
        console.log('🧭 BreadcrumbComponent: Route changed to:', url);
        this._currentUrl.set(url);
        this.buildBreadcrumbsFromRoute(url);
      });

    // Build initial breadcrumbs
    const currentUrl = this.router.url;
    this._currentUrl.set(currentUrl);
    this.buildBreadcrumbsFromRoute(currentUrl);
  }

  private initializeBreadcrumbData(): void {
    // MenuService already loads all navigation data including breadcrumb config
    // BreadcrumbComponent just needs to wait for the data to be available
    console.log(
      '� BreadcrumbComponent: Waiting for navigation data from MenuService'
    );

    // No need to dispatch any loading actions - MenuService handles this
    // The component will reactively update when data becomes available through signals
  }

  private buildBreadcrumbsFromRoute(url: string): void {
    console.log('🔄 BreadcrumbComponent: Building breadcrumbs for:', url);
    this.store.dispatch(NavigationActions.buildBreadcrumbsFromRoute({ url }));
  }

  /**
   * Navigate to a specific URL
   */
  navigateTo(url: string): void {
    console.log('🧭 BreadcrumbComponent: Navigating to:', url);
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
    console.log('🎨 BreadcrumbComponent: Setting breadcrumb style:', style);
    this.breadcrumbStyle = style;
    this.store.dispatch(NavigationActions.setBreadcrumbStyle({ style }));
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
    console.log('🔄 BreadcrumbComponent: Refreshing breadcrumb data');
    this.store.dispatch(NavigationActions.loadBreadcrumbConfig());
  }
}
