import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule,
    CommonModule,
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  // Angular 20 signal for reactive current year
  private readonly _currentDate = signal(new Date());

  readonly currentYear = computed(() => this._currentDate().getFullYear());
  readonly appName = signal('Apex Dashboard');
  readonly version = signal('2.0.0');

  // System information signals
  readonly buildNumber = signal('APEX-2024.09.20-1247');
  readonly environment = signal('Production');
  readonly timezone = computed(() => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  });
  readonly dateFormat = signal('MM/dd/yyyy');
  readonly timeFormat = signal('12-hour');
  readonly currentDateTime = computed(() => {
    const now = this._currentDate();
    return now.toLocaleString('en-US', {
      timeZone: this.timezone(),
      dateStyle: 'medium',
      timeStyle: 'medium',
    });
  });
  readonly userAgent = computed(() => navigator.userAgent);
  readonly screenResolution = computed(
    () => `${screen.width}x${screen.height}`
  );

  /**
   * Update current date (for testing or manual refresh)
   */
  refreshDate(): void {
    this._currentDate.set(new Date());
  }

  /**
   * Show system information popover
   * Displays build number, timezone, date format, and other system details
   */
  showSystemInfo(): void {
    // This method will be handled by the mat-menu trigger in the template
    // The menu will automatically open when the button is clicked
    this.refreshDate(); // Update current time when opening
  }

  /**
   * Copy system information to clipboard
   */
  copySystemInfo(): void {
    const systemInfo = `
Apex Dashboard - System Information
===================================
App Version: ${this.version()}
Build Number: ${this.buildNumber()}
Environment: ${this.environment()}
Timezone: ${this.timezone()}
Date Format: ${this.dateFormat()}
Time Format: ${this.timeFormat()}
Current Time: ${this.currentDateTime()}
Screen Resolution: ${this.screenResolution()}
User Agent: ${this.userAgent()}
    `.trim();

    navigator.clipboard
      .writeText(systemInfo)
      .then(() => {
        console.log('System information copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy system information', err);
      });
  }

  /**
   * Alternative: Show social media menu
   */
  private showSocialMenu(): void {
    // Implementation for social menu
    console.log('Social media menu would open here');
  }
}
