import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { MenuItem } from '../../interfaces/menu.interface';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    RouterModule,
  ],
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
})
export class MenuItemComponent {
  @Input() item!: MenuItem;
  @Input() activeMenuTab: string = '';
  @Input() isSubmenu: boolean = false;

  @Output() menuItemClicked = new EventEmitter<MenuItem>();
  @Output() activeTabChanged = new EventEmitter<string>();

  onItemClick(item: MenuItem): void {
    if (item.routerLink) {
      this.activeTabChanged.emit(item.id);
    }
    this.menuItemClicked.emit(item);
  }

  onSubmenuItemClick(item: MenuItem): void {
    this.menuItemClicked.emit(item);
  }

  hasChildren(item: MenuItem): boolean {
    return !!(item.children && item.children.length > 0);
  }

  isActive(item: MenuItem): boolean {
    return this.activeMenuTab === item.id;
  }

  getSubmenuId(childId: string): string {
    return `submenu_${childId}`;
  }
}
