import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AssignmentsService } from '../../shared/services/object.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IAssignment,
  ISubject,
} from '../../shared/interfaces/other.interface';
import { StudentsService } from '../../shared/services/students.service';
import { SubjectsService } from '../../shared/services/posts.service';
import { Student } from '../../shared/interfaces/person.interface';
import { StudentCardComponent } from '../../students/student-card/student-card.component';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit-assignment',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  templateUrl: './edit-assignment.component.html',
  styleUrl: './edit-assignment.component.css',
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
export class EditAssignmentComponent implements OnInit {
  assignment: IAssignment | undefined;
  // Pour les champs de formulaire
  name = '';
  dateRendu?: Date = undefined;
  mark = 10;
  remark = '';

  students: Student[] = [];
  subjects: ISubject[] = [];

  showModal = false;

  constructor(
    private assignmentsService: AssignmentsService,
    private router: Router,
    private route: ActivatedRoute,
    private studentsService: StudentsService,
    private subjectsService: SubjectsService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.studentsService.getStudents().subscribe((data) => {
      this.students = data;
    });
    this.subjectsService.getSubjects().subscribe((data) => {
      this.subjects = data;
    });
    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      this.assignment = assignment;
      console.log(assignment);

      if (assignment !== undefined) {
        this.name = assignment.name;
        this.dateRendu = assignment.dateRendu;
      }
    });
  }
  handleStudentChange(index: number) {
    this.assignment!.student = {
      name:
        this.students[index].name.first + ' ' + this.students[index].name.last,
      profile: this.students[index].picture.medium,
      _id: this.students[index]._id,
    };
    this.toggleModal();
  }
  handleSubjectChange(event: any) {
    this.assignment!.subject = {
      name: this.subjects[event.value].title,
      picture: this.subjects[event.value].picture,
      _id: this.subjects[event.value]._id,
    };
    this.assignment!.teacher = {
      fullName: this.subjects[event.value].teacher.fullName,
      picture: this.subjects[event.value].teacher.picture,
      _id: this.subjects[event.value].teacher._id,
    };
  }
  toggleModal() {
    this.showModal = !this.showModal;
  }
  handleUpdate() {
    if (!this.assignment) return;
    if (this.name == '' || this.dateRendu === undefined) return;
    console.log(this.remark);

    this.assignment.name = this.name;
    this.assignment.dateRendu = this.dateRendu;
    this.assignment.mark = this.mark;
    this.assignment.remark = this.remark;
    this.assignmentsService
      .updateAssignment(this.assignment)
      .subscribe((message) => {
        console.log(message);
        this.router.navigate([
          '/app/assignment/details/' + this.assignment!._id,
        ]);
      });
  }
  handleDelete() {
    if (this.assignment) {
      this.assignmentsService
        .deleteAssignment(this.assignment)
        .subscribe((message) => {
          this.assignment = undefined;
          this.router.navigate(['/app/assignments']);
        });
    }
  }
}
