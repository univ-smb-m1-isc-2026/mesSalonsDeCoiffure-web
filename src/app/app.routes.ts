import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Admin } from './pages/admin/admin';
import { Reservation } from './pages/reservation/reservation';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { AdminLogin } from './pages/admin-login/admin-login'
import { Salons } from './pages/salons/salons'
import { Profile } from './pages/profile/profile';

export const routes: Routes = [
  { path: '', component: Home }, // Page par défaut (Accueil)
  { path: 'admin', component: Admin }, // Page d'administration
  { path: 'reserver', component: Reservation },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'admin/login', component: AdminLogin },
  { path: 'salons', component: Salons},
  { path: 'profil', component: Profile},
  { path: '**', redirectTo: '' }
];
