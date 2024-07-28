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
import { Assignment } from './object.model';
//import { AssignmentDetailComponent } from './detail-object/assignment-detail.component';
//import { AddObjectComponent } from './add-object/add-object.component';
import { ObjectService } from '../shared/services/object.service';
import { Router, RouterLink } from '@angular/router';
import { filter, map, pairwise, tap, throttleTime } from 'rxjs/operators';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import {} from 'ngx-spinner';
import { IObject } from '../shared/interfaces/other.interface';
@Component({
  selector: 'app-object',
  standalone: true,
  providers: [],
  templateUrl: './object.component.html',
  styleUrl: './object.component.css',
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
    //AssignmentDetailComponent,
    //AddObjectComponent,
    NgxSpinnerModule,
  ],
})
export class ObjectComponent implements OnInit {
  titre = 'Liste des objets';
  // Pour la pagination
  page = 0;
  limit = 10;
  totalDocs!: number;
  totalPages!: number;
  nextPage!: number;
  prevPage!: number;
  hasNextPage!: boolean;
  hasPrevPage!: boolean;
  // tableau des assignments POUR AFFICHAGE
  displayedColumns: string[] = ['nom', 'dateDeRendu'];

  objects: IObject[] = [];

  // UI control
  isLoading = true;

  // pour virtual scroll infini
  @ViewChild('scroller') scroller!: CdkVirtualScrollViewport;

  // ici on injecte le service
  constructor(
    private assignmentsService: ObjectService,
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

  getAssignmentsFromService(): void {
    this.isLoading = true;
    this.assignmentsService.getObjectPagines(this.page, this.limit).subscribe(
      
      (data) => {
        console.log(data);
        this.objects = data.objects;
        this.totalDocs = data.totalDocs;
        this.totalPages = data.totalPages;
        this.nextPage = data.nextPage;
        this.prevPage = data.prevPage;
        this.hasNextPage = data.hasNextPage;
        this.hasPrevPage = data.hasPrevPage;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.isLoading = false;
      }
    );
  }

  getAssignmentsFromServicePourScrollInfini() {
    // on récupère les assignments depuis le service
    this.assignmentsService
      .getObjectPagines(this.page, this.limit)
      .subscribe((data) => {
        // les données arrivent ici au bout d'un certain temps
        console.log('Données arrivées');
        this.objects = [...this.objects, ...data.docs];
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

  handleObjectCardClick(objectId: string) {
    this.router.navigate(['/app/object/details/' + objectId]);
  }
}
