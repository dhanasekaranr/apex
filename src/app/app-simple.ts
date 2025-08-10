import { Component } from '@angular/core';
import { BookingNewComponent } from './components/booking-new/booking-new.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BookingNewComponent],
  template: ` <app-booking-new></app-booking-new> `,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
      }
    `,
  ],
})
export class AppComponent {
  title = 'apex';
}
