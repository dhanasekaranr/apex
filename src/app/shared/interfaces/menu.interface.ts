// Menu Interface Definitions for Dynamic Navigation System

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  routerLink?: string;
  action?: string;
  children?: MenuItem[];
  dividerAfter?: boolean;
  permission?: string;
  isActive?: boolean;
  badge?: {
    text: string;
    color: 'primary' | 'accent' | 'warn';
  };
}

export interface MenuSection {
  id: string;
  label: string;
  items: MenuItem[];
  order: number;
  permission?: string;
}

export interface TopNavConfig {
  menuSections: MenuSection[];
  actionButtons: ActionButton[];
}

export interface ActionButton {
  id: string;
  icon: string;
  tooltip: string;
  action: string;
  order: number;
  permission?: string;
  badge?: {
    text: string;
    color: 'primary' | 'accent' | 'warn';
  };
}

export type MenuAction = 'navigate' | 'action' | 'submenu' | 'divider';
