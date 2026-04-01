import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Salon {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // 🌍 PUBLIC : Utilisé par la page d'accueil pour afficher la carte (Tous les salons)
  getSalonsPublics() {
    return this.http.get<any[]>(`${this.apiUrl}/salons`);
  }

  // 🔒 PRIVÉ : Utilisé par le Dashboard Admin (Seulement SES salons)
  getMesSalons() {
    return this.http.get<any[]>(`${this.apiUrl}/admin/salons`);
  }

  // 🔒 PRIVÉ : Créer un salon dans SON espace
  createMonSalon(salon: any) {
    return this.http.post<any>(`${this.apiUrl}/admin/salons`, salon);
  }

  // Ajoute ceci dans ta classe Salon
  updateMonSalon(id: number, salon: any) {
    // N'oublie pas d'envoyer le Token dans les headers de ta requête si tu ne le fais pas déjà globalement !
    return this.http.put<any>(`${this.apiUrl}/admin/salons/${id}`, salon);
  }

  // Ajoute ceci dans ta classe Salon
  deleteMonSalon(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/admin/salons/${id}`);
  }



  // --- EMPLOYÉS ---
  getEmployes(salonId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/admin/salons/${salonId}/employes`);
  }
  addEmploye(salonId: number, employe: any) {
    return this.http.post<any>(`${this.apiUrl}/admin/salons/${salonId}/employes`, employe);
  }
  updateEmploye(employeId: number, employe: any) {
    return this.http.put<any>(`${this.apiUrl}/admin/salons/employes/${employeId}`, employe);
  }
  deleteEmploye(employeId: number) {
    return this.http.delete(`${this.apiUrl}/admin/salons/employes/${employeId}`);
  }

  // --- PRESTATIONS ---
  getPrestations(salonId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/admin/salons/${salonId}/prestations`);
  }
  addPrestation(salonId: number, prestation: any) {
    return this.http.post<any>(`${this.apiUrl}/admin/salons/${salonId}/prestations`, prestation);
  }
  updatePrestation(prestationId: number, prestation: any) {
    return this.http.put<any>(`${this.apiUrl}/admin/salons/prestations/${prestationId}`, prestation);
  }
  deletePrestation(prestationId: number) {
    return this.http.delete(`${this.apiUrl}/admin/salons/prestations/${prestationId}`);
  }

  // --- COMPÉTENCES DES EMPLOYÉS ---
  assignerPrestation(employeId: number, prestationId: number) {
    return this.http.post<any>(`${this.apiUrl}/admin/salons/employes/${employeId}/prestations/${prestationId}`, {});
  }

  retirerPrestation(employeId: number, prestationId: number) {
    return this.http.delete<any>(`${this.apiUrl}/admin/salons/employes/${employeId}/prestations/${prestationId}`);
  }

  // --- CRÉNEAUX ---
  getCreneaux(salonId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/admin/salons/${salonId}/creneaux`);
  }
  addCreneau(employeId: number, creneau: any) {
    return this.http.post<any>(`${this.apiUrl}/admin/salons/employes/${employeId}/creneaux`, creneau);
  }
  deleteCreneau(creneauId: number) {
    return this.http.delete(`${this.apiUrl}/admin/salons/creneaux/${creneauId}`);
  }

  // Ajoute ceci dans src/app/core/services/salon.ts

  // --- PUBLIC : Pour la page de réservation ---
  getPrestationsPubliques(salonId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/salons/${salonId}/prestations`);
  }

  getEmployesPublics(salonId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/salons/${salonId}/employes`);
  }
}
