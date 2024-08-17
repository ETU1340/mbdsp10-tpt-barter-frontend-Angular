import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { urls } from './urls';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  // Méthode pour obtenir le nombre de postes
  getPostCount(): Observable<number> {
    return this.http.get<number>(`${urls.dash}/postCount`);
  }


}
