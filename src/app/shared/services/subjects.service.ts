import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISubject } from '../interfaces/subject.interface';
import { urls } from './urls';

@Injectable({
  providedIn: 'root',
})
export class SubjectsService {
  constructor(private http: HttpClient) {}
  getSubjects(): Observable<ISubject[]> {
    return this.http.get<ISubject[]>(urls.subjects.get);
  }
}
