// add-post.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { CommonModule, NgFor } from '@angular/common';
import { PostService } from '../../shared/services/posts.service';
import { AuthService } from '../../shared/services/auth.service';
import { ObjectService } from '../../shared/services/object.service';
import { UtilityService } from '../../shared/services/utility.service';
import { IPost, IObject } from '../../shared/interfaces/other.interface';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

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
    NgFor,
    CommonModule,
  ],
})
export class AddPostComponent implements OnInit {
  postForm: FormGroup;
  objects: IObject[] = [];
  selectedObjects: IObject[] = [];
  userId: number = 0;
  objectIds: number[] = [];

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private authService: AuthService,
    private objectService: ObjectService,
    private router: Router,
    private utilityService: UtilityService
  ) {
    this.postForm = this.fb.group({
      authorId: ['', Validators.required],
      objects: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
    this.objectService.getObjectsByOwner(this.userId).subscribe((data:any) => {
      this.objects = data;
    });
  }

  get objectsArray(): FormArray {
    return this.postForm.get('objects') as FormArray;
  }

  addObject() {
    this.objectsArray.push(this.fb.group({
      objectId: ['', Validators.required],
    }));
  }

  removeObject(index: number) {
    this.objectsArray.removeAt(index);
  }

  onObjectSelect(event: MatSelectChange, index: number) {
    this.objectsArray.at(index).get('objectId')?.setValue(event.value);
  }

  onSubmit() {
    if (this.postForm.valid) {
        this.objectIds = this.postForm.value.objects.map((obj: any) => obj.objectId);
        this.postService.createPost(this.userId,this.objectIds).subscribe(
        (response:any) => {
          console.log('Post added successfully', response);
          this.utilityService.showSuccessMessage('Post added successfully');
          this.router.navigate(['/posts']);
        },
        (error:any) => {
          console.error('Error adding post', error);
        }
      );
    }
  }
}
