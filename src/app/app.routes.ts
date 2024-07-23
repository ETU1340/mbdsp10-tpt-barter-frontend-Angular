import { Routes } from '@angular/router';
import { ObjectComponent } from './object/object.component';
import { AddObjectComponent } from './object/add-object/add-object.component';
import { AssignmentDetailComponent } from './object/detail-object/object-detail.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EditAssignmentComponent } from './object/edit-object/edit-object.component';
import { authGuard } from './shared/auth.guard';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { isAdmin } from './shared/isAdmin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'app',
    component: AppLayoutComponent,
    children: [
      { path: '', component: DashboardComponent, canActivate: [authGuard] },
      {
        path: 'add',
        component: ObjectComponent,
        canActivate: [authGuard],
      },
      { path: 'assignments', component: ObjectComponent },
      {
        path: 'assignment/:id',
        component: AssignmentDetailComponent,
        canActivate: [authGuard],
      },
      {
        path: 'assignment/edit/:id',
        component: EditAssignmentComponent,
        canActivate: [authGuard, isAdmin],
      },
      {
        path: 'assignment/details/:id',
        component: AssignmentDetailComponent,
        canActivate: [authGuard],
      },
    ],
  },
];
