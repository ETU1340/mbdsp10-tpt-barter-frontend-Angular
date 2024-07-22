import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule, NgFor } from '@angular/common';
import { IAssignment } from '../shared/interfaces/subject.interface';
import { TrocService } from '../shared/services/troc.service';
import { UtilityService } from '../shared/services/utility.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { filter, map, pairwise, tap, throttleTime } from 'rxjs/operators';

import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { remixBrush2Fill } from '@ng-icons/remixicon';
/**
 * @title Drag&Drop connected sorting
 */
@Component({
  selector: 'render.component',
  standalone: true,
  templateUrl: 'render.component.html',
  styleUrls: ['render.component.css'],
  imports: [
    DragDropModule,
    CdkVirtualScrollViewport,
    ScrollingModule,
    NgFor,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    CommonModule,
    NgIconComponent,
  ],
  providers: [
    provideIcons({
      remixBrush2Fill,
    }),
  ],
})
export class RenderComponent implements OnInit {
  assignmentReturned: IAssignment[] = [];
  assignmentNotReturned: IAssignment[] = [];
  assignment: IAssignment | undefined;
  // pour virtual scroll infini
  @ViewChild('scrollerNotReturned')
  scrollerNotReturned!: CdkVirtualScrollViewport;
  @ViewChild('scrollerReturned') scrollerReturned!: CdkVirtualScrollViewport;
  dropEvent: any;
  showModal = false;
  remarkTeacher = '';
  noteTeacher = 10;

  pageReturned = 1;
  limitReturned = 10;
  totalPagesReturned = 0;
  hasNextPageReturned!: boolean;
  nextPageReturned!: number;
  pageNotReturned = 1;
  limitNotReturned = 10;
  totalPagesNotReturned = 0;
  hasNextPageNotReturned!: boolean;
  nextPageNotReturned!: number;

  searchReturned = '';
  searchNotReturned = '';

  isLoading = false;

  constructor(
    private assignmentsService: TrocService,
    private ngZone: NgZone,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    this.loadAssignmentsReturned();
    this.loadAssignmentsNotReturned();
  }

  onInputChangeFirst(value: string) {
    this.applyAllFilters(value, 'notReturned');
  }

  onInputChangeSecond(value: string) {
    this.applyAllFilters(value, 'returned');
  }

  clearReturned = () => {
    this.searchReturned = '';
    this.loadAssignmentsReturned();
  };

  clearNotReturned = () => {
    this.searchNotReturned = '';
    this.loadAssignmentsNotReturned();
  };

  toggleModal() {
    this.showModal = !this.showModal;
  }

  private applyAllFilters = (value: string, type: string) => {
    if (type == 'returned') {
      this.assignmentsService.searchReturned(value).subscribe((data) => {
        this.assignmentReturned = data;
      });
    }

    if (type == 'notReturned') {
      this.assignmentsService.searchNotReturned(value).subscribe((data) => {
        this.assignmentNotReturned = data;
      });
    }
  };

  loadAssignmentsNotReturned() {
    this.isLoading = true;
    this.assignmentsService
      .getAssignmentNotReturned(this.pageNotReturned, this.limitNotReturned)
      .subscribe((data) => {
        console.log(data);
        this.assignmentNotReturned = [
          ...this.assignmentNotReturned,
          ...data.assignments,
        ];
        this.totalPagesNotReturned = data.totalPages;
        this.nextPageNotReturned = data.nextPage;
        this.hasNextPageNotReturned = data.hasNextPage;
        this.isLoading = false;
      });
  }

  loadAssignmentsReturned() {
    this.isLoading = true;
    this.assignmentsService
      .getAssignmentReturned(this.pageReturned, this.limitReturned)
      .subscribe((data) => {
        console.log(data);
        this.assignmentReturned = [
          ...this.assignmentReturned,
          ...data.assignments,
        ];
        this.totalPagesReturned = data.totalPages;
        this.nextPageReturned = data.nextPage;
        this.hasNextPageReturned = data.hasNextPage;
        this.isLoading = false;
      });
  }
  // methode pour deplacé un assignment vers la partie non rendu
  drop(event: CdkDragDrop<IAssignment[]>) {
    this.dropEvent = event;
    this.assignment = event.previousContainer.data[event.previousIndex];

    console.log('Dropped Item:', event.previousIndex);
    if (this.dropEvent.previousContainer === this.dropEvent.container) {
      transferArrayItem(
        this.dropEvent.previousContainer.data,
        this.dropEvent.container.data,
        this.dropEvent.previousIndex,
        this.dropEvent.currentIndex
      );
    } else if ('mark' in this.assignment) {
      console.log('assignement deja noté');
      this.assignment.isHanded = true;
      this.assignmentsService.updateAssignment(this.assignment).subscribe();
      transferArrayItem(
        this.dropEvent.previousContainer.data,
        this.dropEvent.container.data,
        this.dropEvent.previousIndex,
        this.dropEvent.currentIndex
      );
      this.utilityService.showSuccessMessage(
        'Assignment already noted, delivered successfully'
      );
    } else {
      console.log('assignement pas noté');
      this.toggleModal();
    }
  }
  ngAfterViewInit() {
    console.log(' ----- Init DATA----');
    this.scrollerNotReturned
      .elementScrolled()
      .pipe(
        tap(() => {}),
        map((event) => {
          return this.scrollerNotReturned.measureScrollOffset('bottom');
        }),
        pairwise(),
        filter(([y1, y2]) => {
          return y2 < y1 && y2 < 100;
        }),
        throttleTime(200)
      )
      .subscribe(() => {
        this.ngZone.run(() => {
          console.log('hasnextPage:' + this.hasNextPageNotReturned);
          if (!this.hasNextPageNotReturned) return;
          this.pageNotReturned = this.nextPageNotReturned;
          this.loadAssignmentsNotReturned();
        });
      });

    this.scrollerReturned
      .elementScrolled()
      .pipe(
        tap(() => {}),
        map((event) => {
          return this.scrollerReturned.measureScrollOffset('bottom');
        }),
        pairwise(),
        filter(([y1, y2]) => {
          return y2 < y1 && y2 < 100;
        }),
        throttleTime(200)
      )
      .subscribe(() => {
        this.ngZone.run(() => {
          console.log('hasnextPage:' + this.hasNextPageReturned);
          if (!this.hasNextPageReturned) return;
          this.pageReturned = this.nextPageReturned;
          this.loadAssignmentsReturned();
        });
      });
  }
  //action de la modal pour ajouter le note et remarque
  onSubmit() {
    if (!this.assignment) this.assignmentReturned;
    //mis à jour de l'assignment dans la bdd
    this.assignment!.mark = this.noteTeacher;
    this.assignment!.remark = this.remarkTeacher;
    this.assignment!.isHanded = true;
    this.assignmentsService
      .updateAssignment(this.assignment!)
      .subscribe((message) => {
        this.toggleModal();
      });
    //deplace l'assignment dans la partie rendu
    transferArrayItem(
      this.dropEvent.previousContainer.data,
      this.dropEvent.container.data,
      this.dropEvent.previousIndex,
      this.dropEvent.currentIndex
    );
    this.utilityService.showSuccessMessage('Assignment delivered successfully');
  }
}
