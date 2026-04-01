import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  // 1. Envoyer la requête de connexion
  login(credentials: { email: string, motDePasse: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      // Le "tap" permet d'exécuter une action invisible si la requête réussit
      tap(response => {
        if (response.token) {
          // On sauvegarde le token et le rôle dans le navigateur !
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
        }
      })
    );
  }

  register(utilisateur: any) {
    return this.http.post<any>(`${this.apiUrl}/register`, utilisateur);
  }

  // 2. Se déconnecter (On vide le navigateur)
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  // 3. Outils pratiques pour savoir si on est connecté
  getToken() {
    return localStorage.getItem('token');
  }

  getRole() {
    return localStorage.getItem('role');
  }


  // Récupérer les infos du profil connecté
// Dans src/app/core/services/auth.ts

  getMe() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // 👇 CORRECTION : On utilise environment.apiUrl directement 👇
    return this.http.get<any>(`${environment.apiUrl}/users/me`, { headers });
  }

  updateMe(data: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // 👇 CORRECTION : On utilise environment.apiUrl directement 👇
    return this.http.put<any>(`${environment.apiUrl}/users/me`, data, { headers });
  }


  getMesRendezVous() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // On suppose que ton backend renverra les réservations sur cette route :
    return this.http.get<any[]>(`${environment.apiUrl}/users/me/reservations`, { headers });
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }
}
