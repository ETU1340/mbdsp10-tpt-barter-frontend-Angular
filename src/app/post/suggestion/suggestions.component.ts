import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostService } from '../../shared/services/posts.service';
import { IPost } from '../../shared/interfaces/other.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgFor,NgStyle } from '@angular/common';


@Component({
  selector: 'app-suggestions-modal',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css'],
  standalone: true,
  imports: [
    NgFor,
    NgStyle,
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class SuggestionsComponent implements OnInit {
  suggestions: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<SuggestionsComponent>,
   @Inject(MAT_DIALOG_DATA) public data: { post: IPost },
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.loadSuggestions();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private loadSuggestions(): void {
    this.postService.getSuggestPost(this.data.post.id).subscribe(
      response => {
        this.suggestions = response.suggestions; // Assurez-vous que le format de réponse est correct
        console.log( this.suggestions);
      },
      error => {
        console.error('Erreur lors de la récupération des suggestions', error);
      }
    );
  }
}
