import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AssignmentsService } from '../../shared/services/troc.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UtilityService } from '../../shared/services/utility.service';
import { IAssignment } from '../../shared/interfaces/subject.interface';
import { MatDialog } from '@angular/material/dialog';
import { AuthPopupComponent } from '../../popups/auth-popup/auth-popup.component';
@Component({
  selector: 'app-assignment-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
  ],
  templateUrl: './assignment-detail.component.html',
  styleUrl: './assignment-detail.component.css',
})
export class AssignmentDetailComponent implements OnInit {
  assignment!: IAssignment | undefined;
  isAuthorizedToDelete = false;
  constructor(
    private assignmentsService: AssignmentsService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // Recuperation des query params (ce qui suit le ? dans l'url)
    console.log(this.route.snapshot.queryParams);
    // Recuperation des fragment (ce qui suit le # dans l'url)
    console.log(this.route.snapshot.fragment);

    // On recupere l'id de l'assignment dans l'URL à l'aide de ActivatedRoute
    const id = this.route.snapshot.params['id'];
    // On utilise le service pour récupérer l'assignment avec cet id
    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      this.assignment = assignment;
    });
    this.isAuthorizedToDelete = this.authService.isAdmin();
  }

  handleDelete() {
    if (!this.isAuthorizedToDelete) {
      this.dialog.open(AuthPopupComponent);
      return;
    }
    if (this.assignment) {
      this.assignmentsService
        .deleteAssignment(this.assignment)
        .subscribe((message) => {
          this.assignment = undefined;
          this.router.navigate(['/app/assignments']);
        });
    }
  }

  handleUpdate() {
    this.router.navigate(['/app/assignment/edit/' + this.assignment?._id]);
  }

  isAdmin() {
    return this.authService.loggedIn;
  }
}
