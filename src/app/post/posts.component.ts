import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { CdkVirtualScrollViewport,  ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { map, pairwise, filter, throttleTime, tap } from 'rxjs/operators';
import { IPost } from '../shared/interfaces/other.interface';
import { PostService } from '../shared/services/posts.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditPostComponent } from './edit-post/edit-post.component';
import { DeletePostComponent } from './delete-post/delete-post.component';

@Component({
  selector: 'app-post',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  standalone: true,
  imports: [
    CdkVirtualScrollViewport,
    ScrollingModule,
    NgFor,
    CommonModule,
    NgxSpinnerModule,
  ],
})
export class PostComponent implements OnInit {
  title = 'Liste des posts';
  page = 0;
  limit = 10;
  totalDocs!: number;
  totalPages!: number;
  nextPage!: number;
  prevPage!: number;
  hasNextPage!: boolean;
  hasPrevPage!: boolean;

  posts: IPost[] = [];
  isLoading = false;

  @ViewChild('scroller') scroller!: CdkVirtualScrollViewport;

  constructor(
    private postService: PostService,
    private ngZone: NgZone,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getPostsFromService();
  }

  getPostsFromService() {
    this.isLoading = true;
    this.postService.getPosts(this.page, this.limit).subscribe(
      (data :any) => {
        console.log(data);
        this.posts = data.posts;
        this.totalDocs = data.totalDocs;
        this.totalPages = data.totalPages;
        this.nextPage = data.nextPage;
        this.prevPage = data.prevPage;
        this.hasNextPage = data.hasMore;
        this.hasPrevPage = this.page > 0;
        this.isLoading = false;
      },
      (error:any) => {
        console.error('Error fetching posts:', error);
        this.isLoading = false;
      }
    );
  }

  getPostsFromServiceForInfiniteScroll() {
    this.postService.getPosts(this.page, this.limit).subscribe(
      (data:any) => {
        this.posts = [...this.posts, ...data.posts];
        this.totalDocs = data.totalDocs;
        this.totalPages = data.totalPages;
        this.nextPage = data.nextPage;
        this.prevPage = data.prevPage;
        this.hasNextPage = data.hasMore;
        this.hasPrevPage = this.page > 0;
      },
      (error:any) => {
        console.error('Error fetching posts:', error);
      }
    );
  }

  ngAfterViewInit() {
    if (!this.scroller) return;
    this.scroller.elementScrolled().pipe(
      tap(() => {}),
      map(() => this.scroller.measureScrollOffset('bottom')),
      pairwise(),
      filter(([y1, y2]) => y2 < y1 && y2 < 100),
      throttleTime(200)
    ).subscribe(() => {
      this.ngZone.run(() => {
        if (!this.hasNextPage) return;
        this.page = this.nextPage;
        this.getPostsFromServiceForInfiniteScroll();
      });
    });
  }


  editPost(post: any): void {
    const dialogRef = this.dialog.open(EditPostComponent, {
      width: '600px',
      data: { post }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getPostsFromService();
        this.snackBar.open('Post modifié avec succès', 'Fermer', {
          duration: 2000,
        });
      }
    });
  }

 
  deletePost(post: any): void {
    const dialogRef = this.dialog.open(DeletePostComponent, {
      width: '400px',
      data: { post }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.postService.deletePost(post.id).subscribe(() => {
          this.getPostsFromService();
          this.snackBar.open('Post supprimé avec succès', 'Fermer', {
            duration: 2000,
          });
        });
      }
    });
  }
}
