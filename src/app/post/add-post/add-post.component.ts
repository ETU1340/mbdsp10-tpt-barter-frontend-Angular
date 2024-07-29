// add-post.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ScrollingModule,CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CommonModule, NgFor } from '@angular/common';
import { PostService } from '../../shared/services/posts.service';
import { ObjectService } from '../../shared/services/object.service';
import {IObject } from '../../shared/interfaces/other.interface';
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
    ReactiveFormsModule,
    ScrollingModule,
    MatListModule,
    MatCheckboxModule,
    CdkVirtualScrollViewport,
    MatCardModule,
    MatGridListModule
  ],
})
export class AddPostComponent implements OnInit {
  postForm: FormGroup;
  objects: IObject[] = [];
  selectedObjectIds: number[] = [];
  userId: number = 0;

  constructor(
    private fb: FormBuilder,
    private objectService: ObjectService,
    private postService: PostService
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
    this.objectService.getObjectsByOwner(this.userId).subscribe((data:any) => {
      console.log(data);
      this.objects = data;
    });
  }

  onObjectSelect(objectId: number, isSelected: boolean): void {
    if (isSelected) {
      this.selectedObjectIds.push(objectId);
    } else {
      this.selectedObjectIds = this.selectedObjectIds.filter(id => id !== objectId);
    }
  }

  onSubmit(): void {
    console.log('yess');
    if (this.postForm.valid) {
      console.log('no');
      console.log(this.selectedObjectIds);
      this.postService.createPost(this.userId ,this.selectedObjectIds).subscribe(
        (response) => {
          console.log('Post created successfully', response);
        },
        (error) => {
          console.error('Error creating post', error);
        }
      );
    }
  }

}