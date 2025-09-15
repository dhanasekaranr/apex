import { NgClass } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';

interface DashboardStat {
  title: string;
  value: string;
  icon: string;
  color: string;
}

interface Activity {
  action: string;
  time: string;
  icon: string;
  type: 'success' | 'info' | 'primary' | 'warning' | 'error';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgClass,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  // Angular 20 signals for reactive data
  private readonly _stats = signal<DashboardStat[]>([
    { title: 'Total Users', value: '1,234', icon: 'people', color: '#4CAF50' },
    {
      title: 'Revenue',
      value: '$12,345',
      icon: 'attach_money',
      color: '#2196F3',
    },
    { title: 'Orders', value: '567', icon: 'shopping_cart', color: '#FF9800' },
    { title: 'Products', value: '89', icon: 'inventory_2', color: '#9C27B0' },
  ]);

  private readonly _recentActivities = signal<Activity[]>([
    {
      action: 'New user registered',
      time: '2 minutes ago',
      icon: 'person_add',
      type: 'success',
    },
    {
      action: 'Order #1234 completed',
      time: '5 minutes ago',
      icon: 'check_circle',
      type: 'success',
    },
    {
      action: 'Product updated',
      time: '10 minutes ago',
      icon: 'edit',
      type: 'info',
    },
    {
      action: 'Payment received',
      time: '15 minutes ago',
      icon: 'payment',
      type: 'primary',
    },
    {
      action: 'Low stock alert',
      time: '20 minutes ago',
      icon: 'warning',
      type: 'warning',
    },
  ]);

  // Public computed signals for template
  readonly stats = computed(() => this._stats());
  readonly recentActivities = computed(() => this._recentActivities());

  /**
   * Get critical activities (warnings/errors)
   */
  readonly criticalActivities = computed(() =>
    this._recentActivities().filter(
      (activity) => activity.type === 'warning' || activity.type === 'error'
    )
  );

  /**
   * Get total stats count
   */
  readonly totalStatsCount = computed(() => this._stats().length);

  /**
   * Refresh dashboard data
   */
  refreshData(): void {
    // In a real app, this would trigger API calls
    console.log('🔄 Refreshing dashboard data');
  }

  /**
   * Handle stat card click
   */
  onStatClick(stat: DashboardStat): void {
    console.log('📊 Stat clicked:', stat.title);
  }
}
