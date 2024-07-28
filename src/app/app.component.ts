import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ObjectComponent } from './object/object.component';
import { TeachersComponent } from './teachers/teachers.component';
import { AuthService } from './shared/services/auth.service';
import { ObjectService } from './shared/services/object.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

import {
  bootstrapLayoutSidebarInset,
  bootstrapPlusLg,
} from '@ng-icons/bootstrap-icons';
import { heroHome } from '@ng-icons/heroicons/outline';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatSlideToggleModule,
    ObjectComponent,
    MatSidenavModule,
    NgIconComponent,
    TeachersComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [
    provideIcons({ bootstrapLayoutSidebarInset, heroHome, bootstrapPlusLg }),
  ],
})
export class AppComponent {
  title = 'Application de gestion des assignments';
  showFiller = true;

  constructor(
    private authService: AuthService,
    private assignmentsService: ObjectService,
    private router: Router
  ) {}

  login() {
    // on utilise le service d'autentification
    // pour se connecter ou se déconnecter
    this.router.navigate(['/login']);
    // on navigue vers la page d'accueil
  }

  // genererDonneesDeTest() {
  // on utilise le service
  /* VERSION NAIVE
    this.assignmentsService.peuplerBD();
    */
  // VERSION AVEC Observable
  // this.assignmentsService.peuplerBDavecForkJoin().subscribe(() => {
  //   console.log(
  //     'Données générées, on rafraichit la page pour voir la liste à jour !'
  //   );
  //   window.location.reload();
  //   // On devrait pouvoir le faire avec le router, jussqu'à la version 16 ça fonctionnait avec
  //   // this.router.navigate(['/home'], {replaceUrl:true});
  // });
  // }
}
