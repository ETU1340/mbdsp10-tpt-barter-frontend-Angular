import { Injectable } from '@angular/core';
import { Assignment } from '../../object/object.model';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
// importation des données de test
import { IObject ,ICategory} from '../interfaces/other.interface';
import { urls } from './urls';

@Injectable({
  providedIn: 'root',
})
export class ObjectService {
  assignments: Assignment[] = [];

  constructor(private http: HttpClient) {}



getObjectPagines(page: number, limit: number): Observable<any> {

  const params = new HttpParams()
  .set('page', page.toString())
  .set('limit', limit.toString());

  return this.http.get<IObject>(urls.objects.get+'/pagin', { params }).pipe(
    catchError(
      this.handleError<any>(
        '### catchError: getAssignments'
      )
    ));


}

  getObject(id: number): Observable<IObject | undefined> {
    return this.http.get<IObject>(urls.objects.get + '/allData/' + id).pipe(
      catchError(
        this.handleError<any>(
          '### catchError: getAssignments by id avec id=' + id
        )
      ));
   
  }
  getObjectsByOwner(id: number): Observable<IObject | undefined> {
    return this.http.get<IObject>(urls.objects.get + '/objectOwner/' + id).pipe(
      catchError(
        this.handleError<any>(
          '### catchError: getAssignments by id avec id=' + id
        )
      ));
   
  }

  

  getCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(urls.categories.get);
  }


  // ajoute un assignment et retourne une confirmation
  addObject( name: string, description: string, categoryId: number, ownerId: number,photos:File[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { name,description,categoryId,ownerId,photos};
    return this.http.post<IObject>(urls.objects.post,body,{ headers: headers });
  }

  updateObject(id:string,name: string , description: string ,categoryId:number,ownerId:number,photos:string[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { name,description,categoryId,ownerId,photos};
    console.log(body);

   return this.http.put<IObject>(urls.objects.put+'/'+id, body, { headers: headers });
  }

  exchangeObject(idObject: number,ownerId:number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { ownerId};
    console.log(body);

   return this.http.put<IObject>(urls.objects.put+'/owner/'+idObject, body, { headers: headers });
  }




  deleteObject(object: IObject): Observable<any> {
    return this.http.delete(urls.objects.delete + '/status/' + object.id);
  }

  private handleError<T>(operation: any, result?: T) {
    return (error: any): Observable<T> => {
      console.log(error); // pour afficher dans la console
      console.log(operation + ' a échoué ' + error.message);

      return of(result as T);
    };
  }

  getStat() {
    return this.http.get(urls.stat.get);
  }

  searchReturned(name: string): Observable<IObject[]> {
    return this.http.get<IObject[]>(
      urls.searchReturned.get + '?name=' + name
    );
  }

  searchNotReturned(name: string): Observable<IObject[]> {
    return this.http.get<IObject[]>(
      urls.searchNotReturned.get + '?name=' + name
    );
  }
}