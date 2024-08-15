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
import { AuthService } from '../../shared/services/auth.service';
import { NgIf } from '@angular/common';

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
    NgIf
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
  userObject = JSON.parse(localStorage.getItem('user')!);
  userName: string;
  mail: string;
  constructor(
    private authService: AuthService,
  ) { 
    this.userName = this.userObject.username;
    this.mail = this.userObject.email;
  }
  ngOnInit(): void {}
  login() {
    // on utilise le service d'autentification
    // pour se connecter ou se déconnecter
    this.authService.logout();

    // on navigue vers la page d'accueil
  }
}
