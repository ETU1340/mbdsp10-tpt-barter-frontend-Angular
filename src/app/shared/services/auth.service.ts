import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { urls } from './urls';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // propriété pour savoir si l'utilisateur est connecté
  loggedIn = false;

  constructor(private http: HttpClient) {}
  // uri = "http://localhost:8010/api/teachers";
  // méthode pour connecter l'utilisateur
  // Typiquement, il faudrait qu'elle accepte en paramètres
  // un nom d'utilisateur et un mot de passe, que l'on vérifierait
  // auprès d'un serveur...
  isLoggedIn() {
    const promesse = new Promise((resolve, reject) => {
      const logIn = localStorage.getItem('login');
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
      .pipe(catchError(this.handleError));
  }

  register(name: string,email: string,username: string, password: string): Observable<any> {
    let roleId = 1;
    const body = { name, username,password,email,roleId };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log(urls.auth.register, body);
    return this.http
      .post<any>(urls.auth.register, body, { headers: headers })
      .pipe(catchError(this.handleError));
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
    localStorage.removeItem('login');
    this.loggedIn = false;
  }

  isAdmin() {
    const isAdmin = localStorage.getItem('login');
    if (isAdmin == 'true') {
      return true;
    }
    return false;
  }
}
