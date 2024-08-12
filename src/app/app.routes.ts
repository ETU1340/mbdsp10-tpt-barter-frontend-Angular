import { Routes } from '@angular/router';
import { ObjectComponent } from './object/object.component';
import { AddObjectComponent } from './object/add-object/add-object.component';
import { ObjectDetailComponent } from './object/detail-object/object-detail.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EditObjectComponent } from './object/edit-object/edit-object.component';
import { authGuard } from './shared/auth.guard';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostComponent } from './post/posts.component';
import { AddPostComponent } from './post/add-post/add-post.component';
import {ChatComponent} from './chat/chat.component'

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'app',
    component: AppLayoutComponent,
    children: [
      { path: '', 
        component: PostComponent, 
        canActivate: [authGuard] },
      {
        path: 'object/add',
        component: AddObjectComponent,
        canActivate: [authGuard],
      },
      { path: 'objects',
        component: ObjectComponent ,
        canActivate: [authGuard]},
      {
        path: 'object/:id',
        component: ObjectDetailComponent,
        canActivate: [authGuard],
      },
      {
        path: 'object/edit/:id',
        component: EditObjectComponent,
        canActivate: [authGuard],
      },
      {
        path: 'object/details/:id',
        component: ObjectDetailComponent,
        canActivate: [authGuard],
      },
      { path: 'posts', 
        component: PostComponent,
      },
      { path: 'post/add', 
        component: AddPostComponent,
      },
      { path: 'chats', 
        component: ChatComponent,
      },
    ],
  },
];
