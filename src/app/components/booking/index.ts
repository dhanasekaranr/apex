import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BookingComponent } from './booking.component';
import { BookingService } from './booking.service';
import { AccountInformationTabComponent } from './tabs/account-information-tab.component';
import { BillingInformationTabComponent } from './tabs/billing-information-tab.component';
import { CollateralInformationTabComponent } from './tabs/collateral-information-tab.component';

// Export all booking-related components and service
export {
  AccountInformationTabComponent,
  BillingInformationTabComponent,
  BookingComponent,
  BookingService,
  CollateralInformationTabComponent,
};

// Export interfaces
export * from './booking.service';

@NgModule({
  imports: [CommonModule],
  providers: [BookingService],
})
export class BookingModule {}
