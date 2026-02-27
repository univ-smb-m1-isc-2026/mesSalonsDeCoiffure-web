import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Page par défaut (Accueil)
  { path: 'admin', component: AdminComponent }, // Page d'administration
  { path: '**', redirectTo: '' } // Redirige les mauvaises URLs vers l'accueil
];
