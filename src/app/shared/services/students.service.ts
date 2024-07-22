import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Assignment } from '../../object/assignment.model';
import { HttpClient } from '@angular/common/http';
import { Student } from '../interfaces/person.interface';
import { urls } from './urls';
@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  constructor(private http: HttpClient) {}
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(urls.students.get);
  }
}
