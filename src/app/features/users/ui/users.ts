import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  effect,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import {
  MAT_DIALOG_DATA,
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
import { DialogService } from '../../../core/services/dialog.service';
import { User } from '../data-access/state/users.state';
import { UsersStore } from '../data-access/users.store';

@Component({
  selector: 'app-users',
  standalone: true,
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
    'Reports',
    'Settings',
    'Analytics',
    'Inventory',
    'Billing',
    'Support',
    'Audit',
    'Configuration',
  ];

  private dialogService = inject(DialogService);
  private usersStore = inject(UsersStore);

  // Direct signal access from signal store - no conversion needed!
  users = this.usersStore.users;
  loading = this.usersStore.loading;
  error = this.usersStore.error;
  selectedUser = this.usersStore.selectedUser;
  usersCount = this.usersStore.usersCount;
  activeUsers = this.usersStore.activeUsers;

  constructor() {
    // React to users changes and update data source
    effect(() => {
      const users = this.users();
      console.log('📊 Users state updated:', users.length, 'users');
      this.dataSource.data = users;
    });

    // React to loading state changes
    effect(() => {
      const loading = this.loading();
      console.log('� Loading state changed:', loading);
    });

    // React to error state changes
    effect(() => {
      const error = this.error();
      if (error) {
        console.log('❌ Error state updated:', error);
      }
    });
  }

  ngOnInit() {
    console.log('🚀 Users component initializing');

    // Load users if store is empty
    if (this.users().length === 0) {
      console.log('� Store is empty, loading users via signal store');
      this.usersStore.loadUsers();
    } else {
      console.log('✅ Using cached data from store');
    }
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
    const updatedUser = { ...user, dualMode: !user.dualMode };
    this.usersStore.updateUser(updatedUser);
    console.log(
      `Dual mode ${updatedUser.dualMode ? 'enabled' : 'disabled'} for user ${
        user.userCode
      }`
    );
  }

  updateDebugMode(user: User, value: 'Y' | 'N') {
    const updatedUser = { ...user, debugMode: value };
    this.usersStore.updateUser(updatedUser);
    console.log(`Debug mode set to ${value} for user ${user.userCode}`);
  }

  editUser(user: User) {
    console.log('Edit user:', user);
    // Here you would typically open an edit dialog or navigate to edit page
    // For now, just select the user in the store
    this.usersStore.selectUser(user);
  }

  deleteUser(user: User) {
    console.log('Delete user:', user);
    // Delete the user via signal store
    this.usersStore.deleteUser(user.id);
  }

  clearError() {
    this.usersStore.clearError();
  }

  addUser() {
    const dialogRef = this.dialogService.open(AddUserDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: {
        roles: this.roles,
        allAvailableScreens: this.allAvailableScreens,
      },
    });

    dialogRef
      .afterClosed()
      .subscribe((result: AddUserDialogResult | undefined) => {
        if (result) {
          // Dispatch action to add new user
          const newUser: User = {
            id: Date.now(), // Generate unique ID based on timestamp
            userCode: result.userCode,
            userName: result.userName,
            userRole: result.userRole,
            screenAccess: result.screenAccess,
            dualMode: false,
            debugMode: 'N' as const,
            lastLogin: new Date().toISOString(),
            status: 'Active' as const,
          };

          this.usersStore.addUser(newUser);
          console.log('New user added via signal store:', newUser);
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

// Dialog Result Interface
export interface AddUserDialogResult {
  userCode: string;
  userName: string;
  userRole: string;
  screenAccess: string[];
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
    <div class="material3-dialog">
      <div class="dialog-header">
        <h2 mat-dialog-title>
          <mat-icon>person_add</mat-icon>
          Add New User
        </h2>
      </div>

      <mat-dialog-content class="dialog-content">
        <div class="form-container">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>User Name</mat-label>
            <input
              matInput
              [(ngModel)]="userName"
              placeholder="Enter user name"
              required
            />
            <mat-icon matSuffix>person</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>User Code</mat-label>
            <input
              matInput
              [(ngModel)]="userCode"
              placeholder="Enter user code"
              required
            />
            <mat-icon matSuffix>badge</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>User Role</mat-label>
            <mat-select [(value)]="userRole" required>
              @for (role of data.roles; track role) {
              <mat-option [value]="role">
                {{ role }}
              </mat-option>
              }
            </mat-select>
            <mat-icon matSuffix>work</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Available Screens</mat-label>
            <mat-select [(value)]="screenAccess" multiple required>
              @for (screen of data.allAvailableScreens; track screen) {
              <mat-option [value]="screen">
                {{ screen }}
              </mat-option>
              }
            </mat-select>
            <mat-icon matSuffix>apps</mat-icon>
          </mat-form-field>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions">
        <button mat-button (click)="onCancel()" class="cancel-button">
          <mat-icon>close</mat-icon>
          Cancel
        </button>
        <button
          mat-raised-button
          color="primary"
          (click)="onSave()"
          [disabled]="!isFormValid()"
          class="save-button"
        >
          <mat-icon>save</mat-icon>
          Add User
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      /* Material 3 Dialog Styling */
      .material3-dialog {
        width: 100%;
        max-width: 500px;
        background: var(--md-sys-color-surface);
        border-radius: var(--md-sys-shape-corner-extra-large);
        box-shadow: var(--md-sys-elevation-level3);
        overflow: hidden;
      }

      .dialog-header {
        padding: 24px 24px 0 24px;
        background: var(--md-sys-color-surface);
        border-bottom: 1px solid var(--md-sys-color-outline-variant);
      }

      h2[mat-dialog-title] {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0 0 16px 0;
        color: var(--md-sys-color-on-surface);
        font-family: var(--md-sys-typescale-headline-small-font-family-name);
        font-size: var(--md-sys-typescale-headline-small-font-size);
        font-weight: var(--md-sys-typescale-headline-small-font-weight);
        line-height: var(--md-sys-typescale-headline-small-line-height);
        padding: 0;
      }

      h2[mat-dialog-title] mat-icon {
        color: var(--md-sys-color-primary);
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .dialog-content {
        padding: 24px !important;
        margin: 0;
        overflow: visible;
        background: var(--md-sys-color-surface);
      }

      .form-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 0;
      }

      .form-field {
        width: 100%;
        margin: 0;
      }

      .form-field .mat-mdc-form-field-outline {
        color: var(--md-sys-color-outline);
      }

      .form-field.mat-focused .mat-mdc-form-field-outline-thick {
        color: var(--md-sys-color-primary);
      }

      .form-field .mat-mdc-form-field-label {
        color: var(--md-sys-color-on-surface-variant);
      }

      .form-field.mat-focused .mat-mdc-form-field-label {
        color: var(--md-sys-color-primary);
      }

      .form-field .mat-mdc-input-element {
        color: var(--md-sys-color-on-surface);
        font-family: var(--md-sys-typescale-body-large-font-family-name);
        font-size: var(--md-sys-typescale-body-large-font-size);
      }

      .form-field .mat-icon {
        color: var(--md-sys-color-on-surface-variant);
      }

      .dialog-actions {
        padding: 16px 24px 24px 24px !important;
        margin: 0;
        gap: 12px;
        justify-content: flex-end;
        background: var(--md-sys-color-surface);
        border-top: 1px solid var(--md-sys-color-outline-variant);
      }

      .cancel-button {
        min-width: 80px;
        height: 40px;
        color: var(--md-sys-color-primary);
        border: 1px solid var(--md-sys-color-outline);
        border-radius: var(--md-sys-shape-corner-full);
        font-family: var(--md-sys-typescale-label-large-font-family-name);
        font-size: var(--md-sys-typescale-label-large-font-size);
        font-weight: var(--md-sys-typescale-label-large-font-weight);
      }

      .cancel-button:hover {
        background: var(--md-sys-color-primary-container);
        color: var(--md-sys-color-on-primary-container);
      }

      .save-button {
        min-width: 80px;
        height: 40px;
        background: var(--md-sys-color-primary);
        color: var(--md-sys-color-on-primary);
        border-radius: var(--md-sys-shape-corner-full);
        font-family: var(--md-sys-typescale-label-large-font-family-name);
        font-size: var(--md-sys-typescale-label-large-font-size);
        font-weight: var(--md-sys-typescale-label-large-font-weight);
        box-shadow: var(--md-sys-elevation-level1);
      }

      .save-button:hover:not([disabled]) {
        background: var(--md-sys-color-primary-container);
        color: var(--md-sys-color-on-primary-container);
        box-shadow: var(--md-sys-elevation-level2);
      }

      .save-button:disabled {
        background: var(--md-sys-color-on-surface);
        color: var(--md-sys-color-surface);
        opacity: 0.38;
        box-shadow: none;
      }

      .save-button mat-icon,
      .cancel-button mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        margin-right: 8px;
      }

      /* Global dialog backdrop styling */
      :host ::ng-deep .dialog-backdrop {
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(2px);
      }

      :host ::ng-deep .custom-dialog-container {
        background: transparent;
        box-shadow: none;
        padding: 0;
        border-radius: var(--md-sys-shape-corner-extra-large);
      }

      :host ::ng-deep .custom-dialog-container .mat-mdc-dialog-container {
        background: var(--md-sys-color-surface);
        border-radius: var(--md-sys-shape-corner-extra-large);
        box-shadow: var(--md-sys-elevation-level3);
        padding: 0;
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
