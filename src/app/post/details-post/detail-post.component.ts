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
  currentPhotoIndex: number = 0;

  constructor(
    public dialogRef: MatDialogRef<PostDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { post: IPost }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  showPhoto(index: number) {
    this.currentPhotoIndex = index;
  }

  getActivePhoto(objectPost: any) {
    return objectPost.object.photos[this.currentPhotoIndex];
  }
}
