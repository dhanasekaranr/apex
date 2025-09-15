import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  // Angular 20 signal for reactive current year
  private readonly _currentDate = signal(new Date());

  readonly currentYear = computed(() => this._currentDate().getFullYear());
  readonly appName = signal('Apex Dashboard');
  readonly version = signal('2.0.0');

  /**
   * Update current date (for testing or manual refresh)
   */
  refreshDate(): void {
    this._currentDate.set(new Date());
  }
}
