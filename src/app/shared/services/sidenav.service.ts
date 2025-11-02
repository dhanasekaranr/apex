import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  // Signal to track collapsed state
  isCollapsed = signal<boolean>(false);

  /**
   * Toggle the collapsed state
   */
  toggleCollapsed(): void {
    this.isCollapsed.set(!this.isCollapsed());
  }

  /**
   * Set the collapsed state
   */
  setCollapsed(collapsed: boolean): void {
    this.isCollapsed.set(collapsed);
  }
}
