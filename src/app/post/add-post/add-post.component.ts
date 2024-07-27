import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

import { TrocService } from '../../shared/services/troc.service';
import { Router } from '@angular/router';
import { StudentCardComponent } from '../../students/student-card/student-card.component';
import { StudentsService } from '../../shared/services/students.service';
import { MatSelectModule } from '@angular/material/select';
import { SubjectsService } from '../../shared/services/subjects.service';
import { UtilityService} from '../../shared/services/utility.service';
import { AuthService } from '../../shared/services/auth.service';
import { Student } from '../../shared/interfaces/person.interface';
import {
  IAssignment,
  ISubject,
} from '../../shared/interfaces/other.interface';
@Component({
  selector: 'app-add-assignment-stepper',
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    StudentCardComponent,
    MatSelectModule,
  ],
})
export class AddObjectComponent implements OnInit {
  currentStep: number = 1;
  // champs du formulaire
  nomAssignment = '';
  dateDeRendu = undefined;
  assignedStudent: Student | null = null;
  selectedSubject: ISubject | null = null;
  subject: string = '';
  // modal controller
  showModal = false;

  //
  students: Student[] = [];
  subjects: ISubject[] = [];
  constructor(
    private assignmentsService: TrocService,
    private authService: AuthService,
    private studentsService: StudentsService,
    private subjectsService: SubjectsService,
    private router: Router,
    private utilityRoute: UtilityService
  ) {}
  ngOnInit(): void {
    this.studentsService.getStudents().subscribe((data) => {
      this.students = data;
    });
    this.subjectsService.getSubjects().subscribe((data) => {
      this.subjects = data;
    });
    // this.subjects = this.subjectsService.getSubjects();
  }
  onSubmit(event: any) {
    if (this.nomAssignment == '' || this.dateDeRendu === undefined) return;
    let nouvelAssignment: IAssignment = {
      dateRendu: this.dateDeRendu,
      name: this.nomAssignment,
      student: {
        _id: this.assignedStudent!._id,
        name:
          this.assignedStudent!.name.first +
          ' ' +
          this.assignedStudent!.name.last,
        profile: this.assignedStudent!.picture.thumbnail,
      },
      subject: {
        _id: this.selectedSubject!._id,
        name: this.selectedSubject!.title,
        picture: this.selectedSubject!.picture,
      },
      teacher: {
        _id: this.selectedSubject!.teacher._id,
        fullName: this.selectedSubject!.teacher.fullName,
        picture: this.selectedSubject!.teacher.picture,
      },
      isHanded: false,
    };

    this.assignmentsService
      .addAssignment(nouvelAssignment)
      .subscribe((response) => {
        console.log(response);
        this.router.navigate(['/app/assignments']);
      });
    this.utilityRoute.showSuccessMessage("Assignment ajouté avec succés");
  }
  toggleModal() {
    this.showModal = !this.showModal;
  }
  setSelectedStudent(index: number) {
    this.assignedStudent = this.students[index];
    console.log(this.assignedStudent);

    this.toggleModal();
  }
  setSubject(event: any) {
    this.selectedSubject = this.subjects[event.value];
  }

  isAdmin() {
    return this.authService.isAdmin();
  }
  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
}
