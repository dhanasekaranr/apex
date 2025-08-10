import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import {
  ActionButton,
  MenuItem,
  TopNavConfig,
} from '../../shared/interfaces/menu.interface';
import { MenuService } from '../../shared/services/menu.service';

@Component({
  selector: 'app-topnav',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './topnav.html',
  styleUrl: './topnav.scss',
})
export class TopnavComponent implements OnInit {
  searchText: string = '';

  // Observable properties
  topNavConfig$: Observable<TopNavConfig>;
  activeMenuTab$: Observable<string>;

  // Event emitters for parent component communication
  @Output() menuTabChanged = new EventEmitter<string>();
  @Output() searchPerformed = new EventEmitter<string>();
  @Output() notificationsOpened = new EventEmitter<void>();
  @Output() dataExported = new EventEmitter<void>();
  @Output() dataImported = new EventEmitter<void>();
  @Output() helpOpened = new EventEmitter<void>();
  @Output() settingsOpened = new EventEmitter<void>();

  constructor(private menuService: MenuService, private router: Router) {
    this.topNavConfig$ = this.menuService.topNavConfig$;
    this.activeMenuTab$ = this.menuService.activeMenuTab$;
  }

  ngOnInit(): void {
    // Initialize component
  }

  setActiveMenuTab(tab: string): void {
    this.menuService.setActiveMenuTab(tab);
    this.menuTabChanged.emit(tab);
  }

  onMenuItemClicked(item: MenuItem): void {
    if (item.action) {
      this.executeAction(item.action);
    }
    if (item.routerLink) {
      this.router.navigate([item.routerLink]);
      this.setActiveMenuTab(item.id);
    }
  }

  onActionButtonClicked(button: ActionButton): void {
    this.executeAction(button.action);
  }

  hasChildren(item: MenuItem): boolean {
    return !!(item.children && item.children.length > 0);
  }

  getChildrenById(parentItem: MenuItem, childId: string): MenuItem[] {
    const child = parentItem.children?.find((c) => c.id === childId);
    return child?.children || [];
  }

  private executeAction(action: string): void {
    switch (action) {
      case 'performSearch':
        this.performSearch();
        break;
      case 'openNotifications':
        this.openNotifications();
        break;
      case 'exportData':
        this.exportData();
        break;
      case 'importData':
        this.importData();
        break;
      case 'openHelp':
        this.openHelp();
        break;
      case 'openSettings':
        this.openSettings();
        break;
      default:
        console.log(`Action not implemented: ${action}`);
    }
  }

  performSearch(): void {
    this.searchPerformed.emit(this.searchText);
  }

  openNotifications(): void {
    this.notificationsOpened.emit();
  }

  exportData(): void {
    this.dataExported.emit();
  }

  importData(): void {
    this.dataImported.emit();
  }

  openHelp(): void {
    this.helpOpened.emit();
  }

  openSettings(): void {
    this.settingsOpened.emit();
  }
}
