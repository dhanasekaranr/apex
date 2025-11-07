import { OverlayRef } from '@angular/cdk/overlay';

export class PopoverRef<T = any> {
  constructor(private overlayRef: OverlayRef, public data?: T) {}

  close(result?: any): void {
    this.overlayRef.dispose();
    this.afterClosedResolver?.(result);
  }

  private afterClosedResolver?: (value: any) => void;

  afterClosed(): Promise<any> {
    return new Promise<any>((res) => (this.afterClosedResolver = res));
  }
}
