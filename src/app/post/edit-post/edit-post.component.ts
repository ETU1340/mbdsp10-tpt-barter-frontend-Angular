import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PostService } from '../../shared/services/posts.service';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { ObjectService } from '../../shared/services/object.service';
import { IObject } from '../../shared/interfaces/other.interface';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UtilityService} from '../../shared/services/utility.service';
@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css'],
  standalone: true,
  imports: [
    MatOptionModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatCardModule,
    MatGridListModule
  ],
})
export class EditPostComponent {
  postForm: FormGroup;
  objects: IObject[] = [];
  filteredObjects: IObject[] = [];
  selectedObjectIds: number[] = []; // Initialiser à un tableau vide
  userId: number;
  postId: number;
  isLoading = false;
  userObject = JSON.parse(localStorage.getItem('user')!);

  constructor(
    public dialogRef: MatDialogRef<EditPostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private objectService: ObjectService,
    private postService: PostService,
    private utilityService: UtilityService
  ) {
    this.userId = Number(this.userObject.id);
    this.postId = data.post.id;
    this.postForm = this.fb.group({
      objectIds: [this.selectedObjectIds]
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    // Récupérer les objets disponibles
    this.objectService.getObjectsByOwner(this.userId).subscribe((objects: any) => {
      this.objects = objects;
      this.filteredObjects = this.objects;
      this.isLoading = false;
    },
    (error: any) => {
      console.error('Error fetching posts:', error);
      this.isLoading = false;
    });
  }

  filterObjects(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.filteredObjects = this.objects.filter(object => object.name.toLowerCase().includes(query.toLowerCase()));
  }

  onObjectSelect(objectId: number, checked: boolean): void {
    if (checked) {
      this.selectedObjectIds.push(objectId);
    } else {
      this.selectedObjectIds = this.selectedObjectIds.filter(id => id !== objectId);
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  onSubmit(): void {
    if (this.postForm.valid) {
      if( this.selectedObjectIds.length < 1) {
        this.utilityService.showErrorMessage("Veuillez sélectionner au moins un objet.");
      } else {
        this.postService.addSuggestToPost(this.postId, this.userId, this.selectedObjectIds).subscribe((response) => {
          this.dialogRef.close(true);
          this.utilityService.showErrorMessage("Suggestion pris en compte");
        },(error) =>{
          this.utilityService.showErrorMessage("L'un ou tous les objets selectionner sont deja suggeré");
        });
      }
     
    }
  }

  convertToNumber(id: any): number {
    return Number(id);
  }
  

}
