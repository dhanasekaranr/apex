import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { Observable } from 'rxjs';
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
  imports: [
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    AsyncPipe,
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
  protected title = 'Apex Dashboard';
  currentBreadcrumbStyle: BreadcrumbStyle = 'arrow-flow';

  isHandset$: Observable<boolean>;
  activeMenuTab = 'dashboard';

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map((result) => result.matches),
      shareReplay()
    );
  }

  ngOnInit() {
    // Listen to route changes to update active menu tab
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const route = event.urlAfterRedirects.split('/')[1] || 'dashboard';
        this.activeMenuTab = route;
      });

    // Set initial active tab based on current route
    const currentRoute = this.router.url.split('/')[1] || 'dashboard';
    this.activeMenuTab = currentRoute;
  }

  // Event handlers for topnav component
  onMenuTabChanged(tab: string): void {
    this.activeMenuTab = tab;
    console.log('Active menu tab set to:', tab);
  }

  onSearchPerformed(searchText: string): void {
    if (searchText.trim()) {
      console.log('Performing search for:', searchText);
      // Implementation would perform the search
    }
  }

  onNotificationsOpened(): void {
    console.log('Opening notifications...');
    // Implementation would open notifications panel
  }

  onDataExported(): void {
    console.log('Exporting data...');
    // Implementation would export data from the current view
  }

  onDataImported(): void {
    console.log('Importing data...');
    // Implementation would open a file upload dialog
  }

  onHelpOpened(): void {
    console.log('Opening help...');
    // Implementation would open help documentation
  }

  onSettingsOpened(): void {
    console.log('Opening settings...');
    // Implementation would navigate to settings page
  }
}
