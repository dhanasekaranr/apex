import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface User {
  id: number;
  userCode: string;
  userName: string;
  userRole: string;
  screenAccess: string[];
  dualMode: boolean;
  debugMode: 'Y' | 'N';
  lastLogin: Date;
  status: 'Active' | 'Inactive' | 'Suspended';
}

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatChipsModule,
    MatDialogModule,
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  displayedColumns: string[] = [
    'userCode',
    'userName',
    'userRole',
    'screenAccess',
    'dualMode',
    'debugMode',
    'lastLogin',
    'status',
    'actions',
  ];

  dataSource = new MatTableDataSource<User>();
  expandedElement: User | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Filter properties
  filterValue = '';
  roleFilter = '';
  statusFilter = '';
  debugModeFilter = '';

  // Available options for filters
  roles = ['Admin', 'Manager', 'User', 'Developer', 'Analyst', 'Support'];
  statuses = ['Active', 'Inactive', 'Suspended'];
  debugModeOptions = ['Y', 'N'];

  // All available screens in the system
  allAvailableScreens = [
    'Dashboard',
    'Users',
    'Orders',
    'Reports',
    'Settings',
    'Analytics',
    'Inventory',
    'Billing',
    'Support',
    'Audit',
    'Configuration',
  ];

  constructor(private dialog: MatDialog) {}

  // Sample data
  users: User[] = [
    {
      id: 1,
      userCode: 'ADM001',
      userName: 'Watson Joyce',
      userRole: 'Admin',
      screenAccess: ['Dashboard', 'Users', 'Orders', 'Reports', 'Settings'],
      dualMode: true,
      debugMode: 'Y',
      lastLogin: new Date('2024-12-28'),
      status: 'Active',
    },
    {
      id: 2,
      userCode: 'MGR002',
      userName: 'Sarah Manager',
      userRole: 'Manager',
      screenAccess: ['Dashboard', 'Orders', 'Reports', 'Analytics'],
      dualMode: false,
      debugMode: 'N',
      lastLogin: new Date('2024-12-27'),
      status: 'Active',
    },
    {
      id: 3,
      userCode: 'USR003',
      userName: 'Mike User',
      userRole: 'User',
      screenAccess: ['Dashboard', 'Orders'],
      dualMode: false,
      debugMode: 'N',
      lastLogin: new Date('2024-12-26'),
      status: 'Active',
    },
    {
      id: 4,
      userCode: 'DEV004',
      userName: 'Emma Developer',
      userRole: 'Developer',
      screenAccess: [
        'Dashboard',
        'Users',
        'Orders',
        'Reports',
        'Settings',
        'Debug',
      ],
      dualMode: true,
      debugMode: 'Y',
      lastLogin: new Date('2024-12-29'),
      status: 'Active',
    },
    {
      id: 5,
      userCode: 'ANL005',
      userName: 'David Analyst',
      userRole: 'Analyst',
      screenAccess: ['Dashboard', 'Reports', 'Analytics'],
      dualMode: false,
      debugMode: 'N',
      lastLogin: new Date('2024-12-25'),
      status: 'Inactive',
    },
    {
      id: 6,
      userCode: 'SUP006',
      userName: 'Lisa Support',
      userRole: 'Support',
      screenAccess: ['Dashboard', 'Orders', 'Users'],
      dualMode: false,
      debugMode: 'Y',
      lastLogin: new Date('2024-12-24'),
      status: 'Active',
    },
    {
      id: 7,
      userCode: 'USR007',
      userName: 'Tom Wilson',
      userRole: 'User',
      screenAccess: ['Dashboard'],
      dualMode: false,
      debugMode: 'N',
      lastLogin: new Date('2024-12-20'),
      status: 'Suspended',
    },
    {
      id: 8,
      userCode: 'MGR008',
      userName: 'Alice Johnson',
      userRole: 'Manager',
      screenAccess: ['Dashboard', 'Orders', 'Reports', 'Users'],
      dualMode: true,
      debugMode: 'N',
      lastLogin: new Date('2024-12-28'),
      status: 'Active',
    },
    {
      id: 9,
      userCode: 'DEV009',
      userName: 'Robert Chen',
      userRole: 'Developer',
      screenAccess: ['Dashboard', 'Orders', 'Settings', 'Analytics'],
      dualMode: false,
      debugMode: 'Y',
      lastLogin: new Date('2024-12-29'),
      status: 'Active',
    },
    {
      id: 10,
      userCode: 'USR010',
      userName: 'Maria Rodriguez',
      userRole: 'User',
      screenAccess: ['Dashboard', 'Orders'],
      dualMode: false,
      debugMode: 'N',
      lastLogin: new Date('2024-12-23'),
      status: 'Active',
    },
    {
      id: 11,
      userCode: 'ANL011',
      userName: 'James Thompson',
      userRole: 'Analyst',
      screenAccess: ['Dashboard', 'Reports', 'Analytics', 'Audit'],
      dualMode: true,
      debugMode: 'N',
      lastLogin: new Date('2024-12-27'),
      status: 'Active',
    },
    {
      id: 12,
      userCode: 'SUP012',
      userName: 'Jennifer White',
      userRole: 'Support',
      screenAccess: ['Dashboard', 'Users', 'Support'],
      dualMode: false,
      debugMode: 'Y',
      lastLogin: new Date('2024-12-26'),
      status: 'Inactive',
    },
    {
      id: 13,
      userCode: 'ADM013',
      userName: 'Michael Brown',
      userRole: 'Admin',
      screenAccess: [
        'Dashboard',
        'Users',
        'Orders',
        'Reports',
        'Settings',
        'Analytics',
        'Audit',
      ],
      dualMode: true,
      debugMode: 'Y',
      lastLogin: new Date('2024-12-30'),
      status: 'Active',
    },
    {
      id: 14,
      userCode: 'MGR014',
      userName: 'Susan Davis',
      userRole: 'Manager',
      screenAccess: ['Dashboard', 'Orders', 'Reports', 'Inventory'],
      dualMode: true,
      debugMode: 'N',
      lastLogin: new Date('2024-12-25'),
      status: 'Active',
    },
    {
      id: 15,
      userCode: 'DEV015',
      userName: 'Kevin Lee',
      userRole: 'Developer',
      screenAccess: ['Dashboard', 'Users', 'Settings', 'Configuration'],
      dualMode: false,
      debugMode: 'Y',
      lastLogin: new Date('2024-12-22'),
      status: 'Suspended',
    },
    {
      id: 16,
      userCode: 'USR016',
      userName: 'Patricia Garcia',
      userRole: 'User',
      screenAccess: ['Dashboard', 'Orders', 'Billing'],
      dualMode: false,
      debugMode: 'N',
      lastLogin: new Date('2024-12-21'),
      status: 'Active',
    },
    {
      id: 17,
      userCode: 'ANL017',
      userName: 'Christopher Miller',
      userRole: 'Analyst',
      screenAccess: ['Dashboard', 'Reports', 'Analytics'],
      dualMode: true,
      debugMode: 'N',
      lastLogin: new Date('2024-12-28'),
      status: 'Active',
    },
    {
      id: 18,
      userCode: 'SUP018',
      userName: 'Linda Wilson',
      userRole: 'Support',
      screenAccess: ['Dashboard', 'Users', 'Orders', 'Support'],
      dualMode: false,
      debugMode: 'N',
      lastLogin: new Date('2024-12-24'),
      status: 'Inactive',
    },
  ];

  ngOnInit() {
    this.dataSource.data = this.users;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Custom filter predicate for multiple filters
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      const filters = JSON.parse(filter);

      const textMatch =
        !filters.text ||
        data.userCode.toLowerCase().includes(filters.text.toLowerCase()) ||
        data.userName.toLowerCase().includes(filters.text.toLowerCase()) ||
        data.userRole.toLowerCase().includes(filters.text.toLowerCase());

      const roleMatch = !filters.role || data.userRole === filters.role;
      const statusMatch = !filters.status || data.status === filters.status;
      const debugModeMatch =
        !filters.debugMode || data.debugMode === filters.debugMode;

      return textMatch && roleMatch && statusMatch && debugModeMatch;
    };
  }

  applyFilter() {
    const filterObject = {
      text: this.filterValue,
      role: this.roleFilter,
      status: this.statusFilter,
      debugMode: this.debugModeFilter,
    };

    this.dataSource.filter = JSON.stringify(filterObject);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilters() {
    this.filterValue = '';
    this.roleFilter = '';
    this.statusFilter = '';
    this.debugModeFilter = '';
    this.applyFilter();
  }

  toggleDualMode(user: User) {
    user.dualMode = !user.dualMode;
    // Here you would typically call a service to update the user
    console.log(
      `Dual mode ${user.dualMode ? 'enabled' : 'disabled'} for user ${
        user.userCode
      }`
    );
  }

  updateDebugMode(user: User, value: 'Y' | 'N') {
    user.debugMode = value;
    // Here you would typically call a service to update the user
    console.log(`Debug mode set to ${value} for user ${user.userCode}`);
  }

  editUser(user: User) {
    console.log('Edit user:', user);
    // Here you would typically open an edit dialog or navigate to edit page
  }

  deleteUser(user: User) {
    console.log('Delete user:', user);
    // Here you would typically show a confirmation dialog and then delete
    const index = this.dataSource.data.indexOf(user);
    if (index > -1) {
      this.dataSource.data.splice(index, 1);
      this.dataSource._updateChangeSubscription();
    }
  }

  addUser() {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '600px',
      data: {
        roles: this.roles,
        allAvailableScreens: this.allAvailableScreens,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Add the new user to the data source
        const newUser: User = {
          id: this.users.length + 1,
          userCode: result.userCode,
          userName: result.userName,
          userRole: result.userRole,
          screenAccess: result.screenAccess,
          dualMode: false,
          debugMode: 'N',
          lastLogin: new Date(),
          status: 'Active',
        };

        this.users.push(newUser);
        this.dataSource.data = this.users;
        console.log('New user added:', newUser);
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Active':
        return 'primary'; // Blue background
      case 'Inactive':
        return 'accent'; // Orange background
      case 'Suspended':
        return 'warn'; // Red background
      default:
        return ''; // Default gray background
    }
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'Admin':
        return 'warn'; // Red background for admin
      case 'Manager':
        return 'primary'; // Blue background for manager
      case 'Developer':
        return 'accent'; // Orange background for developer
      case 'User':
        return ''; // Default gray background for regular user
      case 'Analyst':
        return 'primary'; // Blue background for analyst
      case 'Support':
        return 'accent'; // Orange background for support
      default:
        return ''; // Default gray background
    }
  }

  toggleExpandRow(user: User) {
    console.log(
      'Before toggle - Current expanded user:',
      this.expandedElement?.userCode
    );
    console.log('Clicking on user:', user.userCode);

    this.expandedElement = this.expandedElement === user ? null : user;

    console.log(
      'After toggle - New expanded user:',
      this.expandedElement?.userCode
    );
    console.log('Is expanded?', this.isExpanded(user));
  }

  isExpanded(user: User): boolean {
    return this.expandedElement === user;
  }
}

// Dialog Data Interface
export interface AddUserDialogData {
  roles: string[];
  allAvailableScreens: string[];
}

// Add User Dialog Component
@Component({
  selector: 'add-user-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="compact-dialog">
      <h2 mat-dialog-title>
        <mat-icon>person_add</mat-icon>
        Add New User
      </h2>

      <mat-dialog-content class="dialog-content">
        <div class="form-container">
          <mat-form-field appearance="outline">
            <mat-label>User Name</mat-label>
            <input
              matInput
              [(ngModel)]="userName"
              placeholder="Enter user name"
              required
            />
            <mat-icon matSuffix>person</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>User Code</mat-label>
            <input
              matInput
              [(ngModel)]="userCode"
              placeholder="Enter user code"
              required
            />
            <mat-icon matSuffix>badge</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>User Role</mat-label>
            <mat-select [(value)]="userRole" required>
              <mat-option *ngFor="let role of data.roles" [value]="role">
                {{ role }}
              </mat-option>
            </mat-select>
            <mat-icon matSuffix>work</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Available Screens</mat-label>
            <mat-select [(value)]="screenAccess" multiple required>
              <mat-option
                *ngFor="let screen of data.allAvailableScreens"
                [value]="screen"
              >
                {{ screen }}
              </mat-option>
            </mat-select>
            <mat-icon matSuffix>apps</mat-icon>
          </mat-form-field>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions">
        <button mat-button (click)="onCancel()">
          <mat-icon>close</mat-icon>
          Cancel
        </button>
        <button
          mat-raised-button
          color="primary"
          (click)="onSave()"
          [disabled]="!isFormValid()"
        >
          <mat-icon>save</mat-icon>
          Add User
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .compact-dialog {
        width: 400px;
        max-width: 90vw;
      }

      .dialog-content {
        padding: 0 !important;
        margin: 0;
        overflow: visible;
      }

      .form-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 0;
      }

      mat-form-field {
        width: 100%;
        margin: 0;
      }

      h2[mat-dialog-title] {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 20px 0;
        color: var(--primary-color);
        font-size: 18px;
        padding: 0;
      }

      .dialog-actions {
        padding: 16px 0 0 0 !important;
        margin: 0;
        gap: 8px;
        justify-content: flex-end;
      }

      .dialog-actions button {
        min-width: 80px;
        height: 36px;
      }
    `,
  ],
})
export class AddUserDialogComponent {
  userName = '';
  userCode = '';
  userRole = '';
  screenAccess: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddUserDialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.isFormValid()) {
      this.dialogRef.close({
        userName: this.userName,
        userCode: this.userCode,
        userRole: this.userRole,
        screenAccess: this.screenAccess,
      });
    }
  }

  isFormValid(): boolean {
    return !!(
      this.userName.trim() &&
      this.userCode.trim() &&
      this.userRole &&
      this.screenAccess.length > 0
    );
  }
}
