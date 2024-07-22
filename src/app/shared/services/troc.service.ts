import { Injectable } from '@angular/core';
import { Assignment } from '../../object/assignment.model';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LoggingService } from './logging.service';
import { HttpClient } from '@angular/common/http';

// importation des données de test
import { IAssignment } from '../interfaces/subject.interface';
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
  getAssignments(): Observable<IAssignment[]> {
    return this.http.get<IAssignment[]>(urls.assignments.get);
  }
  getAssignmentReturned(page: number, limit: number): Observable<any> {
    return this.http.get<any>(
      urls.assignments.returned + '?page=' + page + '&limit=' + limit
    );
  }

  getAssignmentNotReturned(page: number, limit: number): Observable<any> {
    return this.http.get<any>(
      urls.assignments.notReturned + '?page=' + page + '&limit=' + limit
    );
  }

  getAssignmentsPagines(page: number, limit: number): Observable<any> {
    return this.http.get<IAssignment[]>(
      urls.assignments.get + '?page=' + page + '&limit=' + limit
    );
  }

  // renvoie un assignment par son id, renvoie undefined si pas trouvé
  getAssignment(id: number): Observable<IAssignment | undefined> {
    return this.http.get<Assignment>(urls.assignments.get + '/' + id).pipe(
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
  addAssignment(assignment: IAssignment): Observable<any> {
    return this.http.post<Assignment>(urls.assignments.post, assignment);
  }

  updateAssignment(assignment: IAssignment): Observable<any> {
    return this.http.put<Assignment>(urls.assignments.put, assignment);
  }

  deleteAssignment(assignment: IAssignment): Observable<any> {
    return this.http.delete(urls.assignments.delete + '/' + assignment._id);
  }

  getStat() {
    return this.http.get(urls.stat.get);
  }

  searchReturned(name: string): Observable<IAssignment[]> {
    return this.http.get<IAssignment[]>(
      urls.searchReturned.get + '?name=' + name
    );
  }

  searchNotReturned(name: string): Observable<IAssignment[]> {
    return this.http.get<IAssignment[]>(
      urls.searchNotReturned.get + '?name=' + name
    );
  }

  // VERSION NAIVE (on ne peut pas savoir quand l'opération des 1000 insertions est terminée)
  // peuplerBD() {
  //   // on utilise les données de test générées avec mockaroo.com pour peupler la base
  //   // de données
  //   bdInitialAssignments.forEach((a) => {
  //     let nouvelAssignment = new Assignment();
  //     nouvelAssignment.nom = a.nom;
  //     nouvelAssignment.dateDeRendu = new Date(a.dateDeRendu);
  //     nouvelAssignment.rendu = a.rendu;

  //     this.addAssignment(nouvelAssignment).subscribe(() => {
  //       console.log('Assignment ' + a.nom + ' ajouté');
  //     });
  //   });
  // }

  // peuplerBDavecForkJoin(): Observable<any> {
  //   let appelsVersAddAssignment: Observable<any>[] = [];

  //   bdInitialAssignments.forEach((a) => {
  //     const nouvelAssignment = new Assignment();
  //     nouvelAssignment.nom = a.nom;
  //     nouvelAssignment.dateDeRendu = new Date(a.dateDeRendu);
  //     nouvelAssignment.rendu = a.rendu;

  //     appelsVersAddAssignment.push(this.addAssignment(nouvelAssignment));
  //   });

  //   return forkJoin(appelsVersAddAssignment);
  // }
}
