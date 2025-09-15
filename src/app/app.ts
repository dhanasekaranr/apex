import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { filter, map, shareReplay } from 'rxjs/operators';

import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { Sidenav } from './components/sidenav/sidenav';
import { TopnavComponent } from './components/topnav/topnav';
import {
  BreadcrumbComponent,
  BreadcrumbStyle,
} from './shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    Header,
    Footer,
    Sidenav,
    TopnavComponent,
    BreadcrumbComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);

  // Angular 20 signals for reactive state
  protected readonly title = signal('Apex Dashboard');
  readonly currentBreadcrumbStyle = signal<BreadcrumbStyle>('arrow-flow');
  readonly activeMenuTab = signal('dashboard');

  // Convert observable to signal for responsiveness
  readonly isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map((result) => result.matches),
      shareReplay()
    ),
    { initialValue: false }
  );

  ngOnInit() {
    // Listen to route changes to update active menu tab
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const route = event.urlAfterRedirects.split('/')[1] || 'dashboard';
        this.activeMenuTab.set(route);
      });

    // Set initial active tab based on current route
    const currentRoute = this.router.url.split('/')[1] || 'dashboard';
    this.activeMenuTab.set(currentRoute);
  }

  // Event handlers for topnav component
  onMenuTabChanged(tab: string): void {
    this.activeMenuTab.set(tab);
  }

  onSearchPerformed(searchText: string): void {
    if (searchText.trim()) {
      // TODO: Implement search functionality
    }
  }

  onNotificationsOpened(): void {
    // TODO: Implement notification panel opening
  }

  onDataExported(): void {
    // TODO: Implement data export functionality
  }

  onDataImported(): void {
    // TODO: Implement file upload dialog for data import
  }

  onHelpOpened(): void {
    // TODO: Implement help documentation opening
  }

  onSettingsOpened(): void {
    // TODO: Navigate to settings page
  }
}
