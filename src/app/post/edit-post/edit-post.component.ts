import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../shared/services/posts.service';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms'; // Ajoutez ceci
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { ScrollingModule,CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CommonModule, NgFor } from '@angular/common';
import { ObjectService } from '../../shared/services/object.service';
import {IObject } from '../../shared/interfaces/other.interface';

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
    NgFor,
    CommonModule,
    ReactiveFormsModule,
    ScrollingModule,
    MatListModule,
    MatCheckboxModule,
    CdkVirtualScrollViewport,
    MatCardModule,
    MatGridListModule
  ],

})
export class EditPostComponent {
  postForm: FormGroup;
  objects: IObject[] = [];
  filteredObjects: IObject[] = [];
  selectedObjectIds: number[];
  userId: number ;
  postId: number ;
  isLoading = false;
  userObject = JSON.parse(localStorage.getItem('user')!);

  constructor(
    public dialogRef: MatDialogRef<EditPostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private objectService: ObjectService,
    private postService: PostService
  ) {
    this.selectedObjectIds = data.post.objects.map((obj: any) => obj.id);
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
      console.log(this.filteredObjects);
      this.selectedObjectIds = this.data.post.objects.map((object: any) => object.id);
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

  onSubmit(): void {
    if (this.postForm.valid) {
      this.postService.addSuggestToPost(this.postId,this.selectedObjectIds,Number(this.userObject.id)).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
