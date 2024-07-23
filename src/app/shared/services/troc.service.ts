import { Injectable } from '@angular/core';
import { Assignment } from '../../object/object.model';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LoggingService } from './logging.service';
import { HttpClient } from '@angular/common/http';
import { delay } from 'rxjs/operators';
// importation des données de test
import { IObject } from '../interfaces/subject.interface';
import { urls } from './urls';

@Injectable({
  providedIn: 'root',
})
export class TrocService {
  assignments: Assignment[] = [];

  constructor(private logService: LoggingService, private http: HttpClient) {}
  // uri = 'http://localhost:8010/api/assignments';
  //uri = 'https://angularmbdsmadagascar2024.onrender.com/api/assignments';

  // retourne tous les assignments
  getAssignments(): Observable<IObject[]> {
    return this.http.get<IObject[]>(urls.assignments.get);
  }
/*
  getAssignmentsPagines(page: number, limit: number): Observable<any> {
    return this.http.get<IObject[]>(
      urls.objects.get + '?page=' + page + '&limit=' + limit
    );
  }
*/


private generateFakeData(): IObject[] {
  return [
    {
      _id: '1',
      name: 'Object 1',
      category: 'Category 1',
      categoryId: 'cat1',
      owner: {
        _id: 'owner1',
        name: 'Owner 1',
        email: 'owner1@example.com'
      },
      photo: ['photo1.jpg']
    },
    {
      _id: '2',
      name: 'Object 2',
      category: 'Category 2',
      categoryId: 'cat2',
      owner: {
        _id: 'owner2',
        name: 'Owner 2',
        email: 'owner2@example.com'
      },
      photo: ['photo2.jpg']
    }
    // Ajoutez autant de fausses données que nécessaire
  ];
}

getObjectPagines(page: number, limit: number): Observable<any> {
  const fakeData = this.generateFakeData();
  const startIndex = (page - 1) * limit;
  const paginatedData = fakeData.slice(startIndex, startIndex + limit);

  const response = {
    objects: paginatedData,
    totalDocs: fakeData.length,
    totalPages: Math.ceil(fakeData.length / limit),
    nextPage: page * limit < fakeData.length ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
    hasNextPage: page * limit < fakeData.length,
    hasPrevPage: page > 1
  };

  return of(response).pipe(delay(1000)); 

}

  getObject(id: number): Observable<IObject | undefined> {
    return this.http.get<Object>(urls.objects.get + '/' + id).pipe(
      catchError(
        this.handleError<any>(
          '### catchError: getAssignments by id avec id=' + id
        )
      )
      /*
      map(a => {
        a.nom += " MODIFIE PAR LE PIPE !"
        return a;
      }),
      tap(a => console.log("Dans le pipe avec " + a.nom)),
      map(a => {
        a.nom += " MODIFIE UNE DEUXIEME FOIS PAR LE PIPE !";
        return a;
      })
      */
    );
    //let a = this.assignments.find(a => a.id === id);
    //return of(a);
  }

  private handleError<T>(operation: any, result?: T) {
    return (error: any): Observable<T> => {
      console.log(error); // pour afficher dans la console
      console.log(operation + ' a échoué ' + error.message);

      return of(result as T);
    };
  }

  // ajoute un assignment et retourne une confirmation
  addAssignment(assignment: IObject): Observable<any> {
    return this.http.post<Assignment>(urls.assignments.post, assignment);
  }

  updateAssignment(assignment: IObject): Observable<any> {
    return this.http.put<Assignment>(urls.assignments.put, assignment);
  }

  deleteAssignment(assignment: IObject): Observable<any> {
    return this.http.delete(urls.assignments.delete + '/' + assignment._id);
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