import { Component, ViewChild } from '@angular/core';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  bootstrapCheck2All,
  bootstrapLayoutSidebarInset,
  bootstrapList,
  bootstrapPlusLg,
} from '@ng-icons/bootstrap-icons';
import { heroHome } from '@ng-icons/heroicons/outline';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { ObjectComponent } from '../../object/object.component';
import { TeachersComponent } from '../../teachers/teachers.component';
import { ObjectService } from '../../shared/services/object.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-app-layout',
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
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css',
  providers: [
    provideIcons({
      bootstrapLayoutSidebarInset,
      heroHome,
      bootstrapPlusLg,
      bootstrapList,
      bootstrapCheck2All,
    }),
  ],
})
export class AppLayoutComponent {
  title = 'Application de gestion des assignments';
  showFiller = true;
  constructor(
    private authService: AuthService,
    private assignmentsService: ObjectService,
    private router: Router
  ) {}
  ngOnInit(): void {}
  login() {
    // on utilise le service d'autentification
    // pour se connecter ou se déconnecter
    this.authService.logout();

    // on navigue vers la page d'accueil
  }
}
