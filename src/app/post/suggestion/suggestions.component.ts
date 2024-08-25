import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostService } from '../../shared/services/posts.service';
import { ObjectService } from '../../shared/services/object.service';
import { IPost } from '../../shared/interfaces/other.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgFor,NgStyle } from '@angular/common';
import { UtilityService} from '../../shared/services/utility.service';

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
  userId: number;
  post: IPost;
  exchangeSuggestedObj: boolean = false;
  exchangePostObj: boolean = false;
  userObject = JSON.parse(localStorage.getItem('user')!);
  isLoading = true;
  constructor(
    public dialogRef: MatDialogRef<SuggestionsComponent>,
   @Inject(MAT_DIALOG_DATA) public data: { post: IPost },
    private postService: PostService,
    private objectService: ObjectService,
    private utilityService: UtilityService,
  ) {
    this.post = data.post;
    this.userId = Number(this.userObject.id);
  }

  ngOnInit(): void {
    this.loadSuggestions();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private loadSuggestions(): void {
    this.postService.getSuggestPost(this.data.post.id).subscribe(
      response => {
        console.log(response.data);
        this.suggestions = response.data; 
        this.isLoading = false; // Assurez-vous que le format de réponse est correct
        console.log( this.suggestions);
      },
      error => {
        this.isLoading = false; 
        console.error('Erreur lors de la récupération des suggestions', error);
      }
    );
  }


  validateSuggestion(suggestion: any): void {
    this.postService.validationSuggest(suggestion.id).subscribe(
      async response => {
        try {
          // Étape 1: Échanger les objets suggérés
          const exchangeSuggestedObj = await this.exchangeSuggestedObjects(suggestion.suggestedObject, this.userId);
          if (!exchangeSuggestedObj) {
            throw new Error("Erreur lors de l'échange des objets suggérés");
          }
  console.log(exchangeSuggestedObj);
          // Étape 2: Échanger les objets du post
          const exchangePostObj = await this.exchangePostObjects(this.post.objects, suggestion.suggestedById);
          console.log(exchangePostObj);

          // Étape 3: Supprimer le post
          await this.postService.deletePost(suggestion.postId).toPromise();
          
          // Réussite
          this.onNoClick();
          this.utilityService.showSuccessMessage("Échange effectué avec succès");
        } catch (error:any) {
          // Gérer les erreurs
          console.error(error);
          this.utilityService.showErrorMessage(error.message || "Erreur lors de l'échange");
        }
      },
      error => {
        this.utilityService.showErrorMessage("Erreur lors de la validation de la suggestion");
      }
    );
  }
  
  private exchangeSuggestedObjects(suggestedObjects: any[], postAuthorId: number): Promise<boolean> {
    const promises = suggestedObjects.map(object =>
      this.objectService.exchangeObject(object.id, postAuthorId).toPromise()
    );
  
    return Promise.all(promises)
      .then(() => true)
      .catch(() => false);
  }
  
  private exchangePostObjects(postObjects: any[], suggestionAuthorId: number): Promise<boolean> {
    const promises = postObjects.map(object =>
      this.objectService.exchangeObject(object.id, suggestionAuthorId).toPromise()
    );
  
    return Promise.all(promises)
      .then(() => true)
      .catch(() => false);
  }
  
}

