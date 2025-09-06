import { ComponentType } from '@angular/cdk/portal';
import { Injectable, TemplateRef } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  open<T, D = any, R = any>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    config?: MatDialogConfig<D>
  ): MatDialogRef<T, R> {
    // Close any existing dialogs first
    this.dialog.closeAll();

    // Force backdrop settings with custom class
    const defaultConfig: MatDialogConfig<D> = {
      hasBackdrop: true,
      disableClose: false,
      closeOnNavigation: true,
      autoFocus: true,
      restoreFocus: true,
      backdropClass: 'custom-dialog-backdrop',
      panelClass: ['single-dialog-container', 'custom-dialog-panel'],
      ...config,
    };

    // Add body class when dialog opens
    document.body.classList.add('dialog-open');

    // Open the dialog
    const dialogRef = this.dialog.open(componentOrTemplateRef, defaultConfig);

    // Remove body class when dialog closes
    dialogRef.afterClosed().subscribe(() => {
      document.body.classList.remove('dialog-open');
    });

    return dialogRef;
  }
}
