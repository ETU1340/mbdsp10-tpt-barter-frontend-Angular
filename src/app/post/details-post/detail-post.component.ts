import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { IPost } from '../../shared/interfaces/other.interface';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-post-detail',
  templateUrl: './detail-post.component.html',
  styleUrls: ['./detail-post.component.css'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule]
})
export class PostDetailComponent {
  // Tableau pour stocker l'index de la photo courante pour chaque objet
  photoIndices: number[] = [];

  constructor(
    public dialogRef: MatDialogRef<PostDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { post: IPost }
  ) {
    // Initialisation du tableau d'index des photos
    this.photoIndices = data.post.objects.map(() => 0);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  showPhoto(objectIndex: number, photoIndex: number) {
    // Mise à jour de l'index de la photo pour l'objet spécifique
    this.photoIndices[objectIndex] = photoIndex;
  }
}
