import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { MenuItem } from '../../shared/interfaces/menu.interface';
import { NavigationActions } from '../../store/navigation/navigation.actions';
import {
  selectSidenavError,
  selectSidenavFooterItems,
  selectSidenavLoading,
  selectSidenavMainItems,
} from '../../store/navigation/navigation.selectors';

@Component({
  selector: 'app-sidenav',
  standalone: true,
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
export class Sidenav implements OnInit {
  private store = inject(Store);

  // Angular signals for reactive data
  mainItems = this.store.selectSignal(selectSidenavMainItems);
  footerItems = this.store.selectSignal(selectSidenavFooterItems);
  loading = this.store.selectSignal(selectSidenavLoading);
  error = this.store.selectSignal(selectSidenavError);

  // Computed signals for template usage
  navItems = computed(() => this.mainItems());
  hasError = computed(() => !!this.error());

  ngOnInit(): void {
    // Sidenav configuration is already loaded by MenuService.initializeNavigation()
    // via loadAllNavigationData() - no need to load separately
  }

  /**
   * Toggle the expanded state of an expandable nav item
   * @param item The nav item to toggle
   * @param event Optional event to prevent default behavior
   */
  toggleExpanded(item: MenuItem, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Dispatch action to toggle menu item expansion
    this.store.dispatch(
      NavigationActions.toggleSidenavMenuItem({
        itemId: item.id,
      })
    );
  }

  /**
   * Check if a nav item is expandable
   * @param item The nav item to check
   * @returns True if the item is expandable
   */
  isExpandable(item: MenuItem): boolean {
    return (
      item.type === 'expandable' && !!item.children && item.children.length > 0
    );
  }

  /**
   * Check if a nav item is a regular clickable item
   * @param item The nav item to check
   * @returns True if the item is a regular item
   */
  isRegularItem(item: MenuItem): boolean {
    return item.type === 'item';
  }

  /**
   * Check if a nav item is a divider
   * @param item The nav item to check
   * @returns True if the item is a divider
   */
  isDivider(item: MenuItem): boolean {
    return item.type === 'divider';
  }

  /**
   * Handle menu item click for navigation
   * @param item The clicked menu item
   * @param event Optional event
   */
  onMenuItemClick(item: MenuItem, event?: Event): void {
    if (item.disabled) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }

    if (this.isExpandable(item)) {
      this.toggleExpanded(item, event);
    }
    // Navigation will be handled by routerLink in template
  }
}
