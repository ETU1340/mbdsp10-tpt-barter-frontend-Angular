import { Component, Inject,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
@Component({
  selector: 'app-map-modal',
  template: `
    <h2 mat-dialog-title>Localisation</h2>
    <mat-dialog-content>
      <app-map  [postLocation]="data.postLocation"></app-map>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="close()">Fermer</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule,MapComponent]

})
export class MapModalComponent {
  constructor(
    public dialogRef: MatDialogRef<MapModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
