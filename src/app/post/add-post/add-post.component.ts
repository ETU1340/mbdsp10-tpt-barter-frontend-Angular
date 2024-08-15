// add-post.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostService } from '../../shared/services/posts.service';
import { ObjectService } from '../../shared/services/object.service';
import { UtilityService} from '../../shared/services/utility.service';
import { IObject } from '../../shared/interfaces/other.interface';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css'],
  standalone: true,
  imports: [
    MatOptionModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    ReactiveFormsModule,
    MatListModule,
    MatCheckboxModule,
    MatCardModule,
    MatGridListModule
  ],
})
export class AddPostComponent implements OnInit {
  postForm: FormGroup;
  objects: IObject[] = [];
  selectedObjectIds: number[] = [];
  userId: number = 0;
  isLoading = false;
  userObject = JSON.parse(localStorage.getItem('user')!);

  constructor(
    private fb: FormBuilder,
    private objectService: ObjectService,
    private postService: PostService,
    private utilityService:UtilityService
  ) {
    this.postForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = Number(this.userObject.id);
    this.objectService.getObjectsByOwner(this.userId).subscribe(
      (data: any) => {
        this.objects = data;
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error fetching posts:', error);
        this.isLoading = false;
      }
    );
  }

  onObjectSelect(objectId: string, isSelected: boolean): void {
    let id = Number(objectId);
    if (isSelected) {
      this.selectedObjectIds.push(id);
    } else {
      this.selectedObjectIds = this.selectedObjectIds.filter(id => id !== id);
    }
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      this.postService.createPost(this.userId, this.selectedObjectIds).subscribe(
        (response) => {
        this.utilityService.showSuccessMessage ('Poste créé avec succès')
        },
        (error) => {
          this.utilityService.showSuccessMessage ('Erreur lors de la création du poste')
        }
      );
    }
  }
}
