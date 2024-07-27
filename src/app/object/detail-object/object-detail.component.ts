import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TrocService } from '../../shared/services/troc.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UtilityService } from '../../shared/services/utility.service';
import { IObject } from '../../shared/interfaces/other.interface';
import { MatDialog } from '@angular/material/dialog';
import { AuthPopupComponent } from '../../popups/auth-popup/auth-popup.component';
@Component({
  selector: 'app-object-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
  ],
  templateUrl: './object-detail.component.html',
  styleUrl: './object-detail.component.css',
})
export class ObjectDetailComponent implements OnInit {
  object!: IObject | undefined;
  constructor(
    private trocService: TrocService,
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
    this.trocService.getObject(id).subscribe((object) => {
      console.log(object);
      this.object = object;
    });

  }

  handleDelete() {
    if (this.object) {
      console.log(this.object);
      this.trocService
        .deleteObject(this.object)
        .subscribe((message) => {
          this.object = undefined;
          this.router.navigate(['/app/objects']);
        });
    }
  }

  handleUpdate() {
    this.router.navigate(['/app/object/edit/' + this.object?.id]);
  }

  isAdmin() {
    return this.authService.loggedIn;
  }
}
