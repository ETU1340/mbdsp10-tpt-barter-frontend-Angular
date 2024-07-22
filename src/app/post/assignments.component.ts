import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';

import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatTable, MatTableModule } from '@angular/material/table';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';

import { RenduDirective } from '../shared/rendu.directive';
import { Assignment } from './assignment.model';
import { AssignmentDetailComponent } from './detail-object/assignment-detail.component';
import { AddAssignmentComponent } from './add-post/add-assignment.component';
import { AssignmentsService } from '../shared/services/troc.service';
import { Router, RouterLink } from '@angular/router';
import { filter, map, pairwise, tap, throttleTime } from 'rxjs/operators';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import {} from 'ngx-spinner';
import { IAssignment } from '../shared/interfaces/subject.interface';
@Component({
  selector: 'app-assignments',
  standalone: true,
  providers: [],
  templateUrl: './assignments.component.html',
  styleUrl: './assignments.component.css',
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    RouterLink,
    MatButtonModule,
    MatTable,
    MatTableModule,
    MatPaginatorModule,
    MatListModule,
    MatSliderModule,
    RenduDirective,
    AssignmentDetailComponent,
    AddAssignmentComponent,
    NgxSpinnerModule,
  ],
})
export class AssignmentsComponent implements OnInit {
  titre = 'Liste des assignments';
  // Pour la pagination
  page = 1;
  limit = 10;
  totalDocs!: number;
  totalPages!: number;
  nextPage!: number;
  prevPage!: number;
  hasNextPage!: boolean;
  hasPrevPage!: boolean;
  // tableau des assignments POUR AFFICHAGE
  displayedColumns: string[] = ['nom', 'dateDeRendu'];

  assignments: IAssignment[] = [];

  // UI control
  isLoading = true;

  // pour virtual scroll infini
  @ViewChild('scroller') scroller!: CdkVirtualScrollViewport;

  // ici on injecte le service
  constructor(
    private assignmentsService: AssignmentsService,
    private ngZone: NgZone, // private spinner: NgxSpinnerService
    private router: Router
  ) {}

  ngOnInit() {
    this.getAssignmentsFromService();
  }

  ngAfterViewInit() {
    if (!this.scroller) return;
    this.scroller
      .elementScrolled()
      .pipe(
        tap(() => {}),
        map((event) => {
          return this.scroller.measureScrollOffset('bottom');
        }),
        pairwise(),
        filter(([y1, y2]) => {
          return y2 < y1 && y2 < 100;
        }),
        throttleTime(200)
      )
      .subscribe(() => {
        this.ngZone.run(() => {
          if (!this.hasNextPage) return;
          this.page = this.nextPage;
          this.getAssignmentsFromServicePourScrollInfini();
        });
      });
  }

  getAssignmentsFromService() {
    this.isLoading = true;
    this.assignmentsService
      .getAssignmentsPagines(this.page, this.limit)
      .subscribe((data) => {
        console.log(data);
        this.assignments = data.assignments;
        this.totalDocs = data.totalDocs;
        this.totalPages = data.totalPages;
        this.nextPage = data.nextPage;
        this.prevPage = data.prevPage;
        this.hasNextPage = data.hasNextPage;
        this.hasPrevPage = data.hasPrevPage;
        this.isLoading = false;
      });
  }

  getAssignmentsFromServicePourScrollInfini() {
    // on récupère les assignments depuis le service
    this.assignmentsService
      .getAssignmentsPagines(this.page, this.limit)
      .subscribe((data) => {
        // les données arrivent ici au bout d'un certain temps
        console.log('Données arrivées');
        this.assignments = [...this.assignments, ...data.docs];
        this.totalDocs = data.totalDocs;
        this.totalPages = data.totalPages;
        this.nextPage = data.nextPage;
        this.prevPage = data.prevPage;
        this.hasNextPage = data.hasNextPage;
        this.hasPrevPage = data.hasPrevPage;
      });
    console.log('Requête envoyée');
  }

  // Pour la pagination
  pagePrecedente() {
    this.page = this.prevPage;
    this.getAssignmentsFromService();
  }
  pageSuivante() {
    this.page = this.nextPage;
    this.getAssignmentsFromService();
  }
  premierePage() {
    this.page = 1;
    this.getAssignmentsFromService();
  }
  dernierePage() {
    this.page = this.totalPages;
    this.getAssignmentsFromService();
  }
  handlePageEvent(event: PageEvent) {
    this.page = event.pageIndex;
    this.limit = event.pageSize;
    this.getAssignmentsFromService();
  }

  handleAssignmentCardClick(assignmentId: string) {
    this.router.navigate(['/app/assignment/details/' + assignmentId]);
  }
}
