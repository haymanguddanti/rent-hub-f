import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { ListingComponent } from './listing/listing.component';
import { RegisterComponent } from './register/register.component';
import { AddComponent } from './add/add.component';
import { AuthGuard } from './auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { EditComponent } from './edit/edit.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [{ path: 'home', component: HomeComponent }],
  },
  {
    path: 'listing',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [{ path: ':id', component: ListingComponent }],
  },
  {
    path: 'add',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: AddComponent }],
  },
  {
    path: 'edit',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [{ path: ':id', component: EditComponent }],
  },
  {
    path: 'profile',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: ProfileComponent }],
  },
];
