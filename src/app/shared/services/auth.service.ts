import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { urls } from './urls';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // propriété pour savoir si l'utilisateur est connecté
  loggedIn = false;

  constructor(private http: HttpClient ,   private router: Router) {}
  // uri = "http://localhost:8010/api/teachers";
  // méthode pour connecter l'utilisateur
  // Typiquement, il faudrait qu'elle accepte en paramètres
  // un nom d'utilisateur et un mot de passe, que l'on vérifierait
  // auprès d'un serveur...
  isLoggedIn() {
    const promesse = new Promise((resolve, reject) => {
      const logIn = localStorage.getItem('authToken');
      let valueReturn = false;
      if (logIn !== null) {
        valueReturn = true;
      }
      resolve(valueReturn);
    });
    return promesse;
  }


  logInConnexion(name: string, mdp: string): Observable<any> {
    const body = { email: name, password: mdp };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log(urls.auth.login, body);
    return this.http
      .post<any>(urls.auth.login, body, { headers: headers })
      .pipe(
        map(response => response), // Retourne la réponse en cas de succès
        catchError(() => of(false)) // Retourne false en cas d'erreur
      );
  }
  register(name: string, email: string, username: string, password: string): Observable<boolean> {
    const roleId = 1;
    const body = { name, username, password, email, roleId };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log(urls.auth.register, body);
    return this.http
      .post<any>(urls.auth.register, body, { headers: headers })
      .pipe(
        map(() => true), // Retourne true en cas de succès
        catchError(() => of(false)) // Retourne false en cas d'erreur
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      console.error("Une erreur s'est produite :", error.error.message);
    } else {
      // Erreur côté serveur
      console.error(
        `Code d'erreur : ${error.status}, ` + `Message : ${error.error}`
      );
    }
    // Retourne une observable avec un message d'erreur
    return throwError(
      "Une erreur s'est produite. Veuillez réessayer plus tard."
    );
  }

  logout() {
    console.log('atooooo');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    this.loggedIn = false;
    this.router.navigate(['/login']);

  }

  isAdmin() {
    const isAdmin = localStorage.getItem('login');
    if (isAdmin == 'true') {
      return true;
    }
    return false;
  }
}
