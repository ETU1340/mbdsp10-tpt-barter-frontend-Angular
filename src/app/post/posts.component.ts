import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule, NgFor,NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { map, pairwise, filter, throttleTime, tap } from 'rxjs/operators';
import { IChat, IMessage, IPost,IUser } from '../shared/interfaces/other.interface';
import { PostService } from '../shared/services/posts.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditPostComponent } from './edit-post/edit-post.component';
import { DeletePostComponent } from './delete-post/delete-post.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PostDetailComponent } from './details-post/detail-post.component';
import { SuggestionsComponent } from './suggestion/suggestions.component';
import { ChatService } from '../shared/services/chat.service'; 
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { NgIf} from '@angular/common';
import {MapModalComponent} from '../map/mapModal.component';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-post',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  standalone: true,
  imports: [
    CdkVirtualScrollViewport,
    ScrollingModule,
    NgFor,
    NgStyle,
    CommonModule,
    NgxSpinnerModule,
    MatIconModule,
    MatButtonModule,
    NgIf,
    MapModalComponent,
    MatTooltipModule
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
  contacts: IUser[] = [];
  userObject = JSON.parse(localStorage.getItem('user')!);
  currentUserId: number = Number(this.userObject.id) ;
  showMapFlag = false;



  posts: IPost[] = [];
  isLoading = true;
  contactExists! :boolean;

  @ViewChild('scroller') scroller!: CdkVirtualScrollViewport;

  constructor(
    private postService: PostService,
    private ngZone: NgZone,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private chatService: ChatService,
  ) {}

  ngOnInit() {
    this.getPostsFromService();
  }

  getPostsFromService() {
    this.postService.getPosts(this.page, this.limit).subscribe(
      (data: any) => {
        console.log( data.posts);
        this.posts = data.posts;
        this.totalDocs = data.totalDocs;
        this.totalPages = data.totalPages;
        this.nextPage = data.nextPage;
        this.prevPage = data.prevPage;
        this.hasNextPage = data.hasMore;
        this.hasPrevPage = this.page > 0;
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error fetching posts:', error);
        this.isLoading = false;
      }
    );
  }

  getPostsFromServiceForInfiniteScroll() {
    this.postService.getPosts(this.page, this.limit).subscribe(
      (data: any) => {
        this.posts = [...this.posts, ...data.posts];
        this.totalDocs = data.totalDocs;
        this.totalPages = data.totalPages;
        this.nextPage = data.nextPage;
        this.prevPage = data.prevPage;
        this.hasNextPage = data.hasMore;
        this.hasPrevPage = this.page > 0;
      },
      (error: any) => {
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


  showMap(post: any): void {
    const postCoordinates: [number, number] = [post.longitude,post.latitude]; // Coordonnées du post (longitude, latitude)

    this.dialog.open(MapModalComponent, {
      width: '800px',
      data: {postLocation: postCoordinates }
    });
  }

  editPost(post: any): void {
    const dialogRef = this.dialog.open(EditPostComponent, {
      width: '600px',
      data: { post }
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

  showPostDetails(post: IPost): void {
    this.dialog.open(PostDetailComponent, {
      width: '800px',
      data: { post }
    });
  }

  openSuggestions(post: IPost): void {
    const dialogRef = this.dialog.open(SuggestionsComponent, {
      width: '700px',  // Ajustez la largeur
      height: '100vh', // Ajustez la hauteur
      data: { post }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('atooooooooooooo');
        this.getPostsFromService();
      }
      // Traitement après la fermeture du modal
    });
  }

  initiateChat(post: IPost) {
    const text = `Bonjour, je suis intéressé par votre post.`;
    
    const receiver: IUser = {
      id:post.author.id,
      name: post.author.name,
      username: post.author.username,
      email: post.author.email,
    }

    const sender: IUser = {
      id:this.currentUserId,
      name: this.userObject.name,
      username: this.userObject.username,
      email: this.userObject.email,
    }

    const message: IMessage = {
      author: sender.id?.toString()!,
      text: text,
      timestamp: new Date(),
    }
    const chat: IChat = {
      sender: sender,
      receiver:receiver ,
      messages: [message]
    }

     this.chatService.getContacts(this.currentUserId.toString()).subscribe((contacts) => {
      console.log(contacts);
      const contact = contacts.find(contact => contact.id === post.author.id);
      console.log(contact);
      
      if (!contact) {
        this.chatService.createMessage(chat).subscribe(
          (response) => {
            console.log(response.chat._id);
            // Redirige vers la discussion une fois le message créé
            this.router.navigate(['/app/chats', response.chat._id]);
          },
          (error) => {
            console.error('Erreur lors de la création du message :', error);
          }
        );

      } else {
        this.router.navigate(['/app/chats',contact.idChat]);
      }
      
    });
    
  }

  getRelativeDate(date: Date): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
  }
}
