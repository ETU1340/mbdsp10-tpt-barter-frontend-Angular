import { Routes } from '@angular/router';
import { AssignmentsComponent } from './object/assignments.component';
import { AddAssignmentComponent } from './object/add-object/add-assignment.component';
import { AssignmentDetailComponent } from './object/detail-object/assignment-detail.component';
import { RenderComponent } from './render/render.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EditAssignmentComponent } from './object/edit-object/edit-assignment.component';
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
        component: AddAssignmentComponent,
        canActivate: [authGuard],
      },
      { path: 'assignments', component: AssignmentsComponent },
      {
        path: 'render',
        component: RenderComponent,
        canActivate: [authGuard, isAdmin],
      },
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
