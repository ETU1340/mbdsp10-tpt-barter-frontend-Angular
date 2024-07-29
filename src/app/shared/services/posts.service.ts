import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPost } from '../interfaces/other.interface';
import { urls } from './urls';
@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) {}

  getPosts(page: number, limit: number): Observable<IPost[]> {
    
  const params = new HttpParams()
  .set('page', page.toString())
  .set('limit', limit.toString());
    return this.http.get<IPost[]>(urls.posts.get+'/pagin',{ params });
  }


  createPost(authorId: number, objectIds: number[]): Observable<any> {
    const body = { authorId,objectIds};
    return this.http.post(urls.posts.post, body);
  }

  updatePost( objectIds: number[]): Observable<any> {
    const body = { objectIds};
    return this.http.put<any>(urls.posts.put, body);
  }

  deletePost(postId: number): Observable<any> {
    return this.http.delete<any>(urls.posts.delete + "/" +postId);
  }
}
