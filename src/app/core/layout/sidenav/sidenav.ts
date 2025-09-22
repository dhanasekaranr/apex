import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MenuItem } from '../../../shared/interfaces/menu.interface';
import { NavigationStore } from '../../state/navigation/navigation.store';

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
  private navigationStore = inject(NavigationStore);

  // Direct signal access
  sidenavSections = this.navigationStore.sidenavSections;
  loading = this.navigationStore.sidenavLoading;
  error = this.navigationStore.sidenavError;

  // Computed signals for template usage
  mainItems = computed(() => {
    const sections = this.sidenavSections();
    // Get main sections (order 0-9 typically)
    return sections
      .filter((section) => section.order < 10)
      .sort((a, b) => a.order - b.order)
      .flatMap((section) => section.items);
  });

  footerItems = computed(() => {
    const sections = this.sidenavSections();
    // Get footer sections (order 10+ typically)
    return sections
      .filter((section) => section.order >= 10)
      .sort((a, b) => a.order - b.order)
      .flatMap((section) => section.items);
  });

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

    // Don't allow expansion if the item is disabled
    if (item.disabled) {
      return;
    }

    // Handle keyboard events for accessibility
    if (event instanceof KeyboardEvent) {
      const key = event.key;
      if (key !== 'Enter' && key !== ' ') {
        return; // Only respond to Enter and Space keys
      }
    }

    // Toggle menu item expansion using signal store
    this.navigationStore.toggleSidenavMenuItem(item.id);
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
