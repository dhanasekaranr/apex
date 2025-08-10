import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  stats = [
    { title: 'Total Users', value: '1,234', icon: 'people', color: '#4CAF50' },
    {
      title: 'Revenue',
      value: '$12,345',
      icon: 'attach_money',
      color: '#2196F3',
    },
    { title: 'Orders', value: '567', icon: 'shopping_cart', color: '#FF9800' },
    { title: 'Products', value: '89', icon: 'inventory_2', color: '#9C27B0' },
  ];

  recentActivities = [
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
  ];
}
