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

  updatePost( postId: number ,objectIds: number[]): Observable<any> {
    const body = {objectIds};
    return this.http.put<any>(urls.posts.put+'/'+postId, body);
  }

  addSuggestToPost( postId: number ,objects: number[], suggestedById: number): Observable<any> {
    const body = {objects,suggestedById};
    return this.http.post<any>(urls.suggestion.post +'/'+postId, body);
  }

  validationSuggest(suggestionId: number): Observable<any> {
    const body = {status:'ACCEPTED'};
    return this.http.patch<any>(urls.suggestion.post +'/status/'+suggestionId, body);
  }





  getSuggestPost( postId: number): Observable<any> {
    return this.http.get<any>(urls.suggestion.get +'/'+postId);
  }



  deletePost(postId: number): Observable<any> {
    console.log(postId);
    return this.http.delete<any>(urls.posts.delete + "/" +postId);
  }
}
