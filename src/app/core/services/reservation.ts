import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private http = inject(HttpClient);

  // Base URL de l'API (ex: http://localhost:8080/api)
  private apiUrl = environment.apiUrl;

  getCreneauxDisponibles(employeId: number | null, prestationId: number, date: string) {
    let params = new HttpParams().set('prestationId', prestationId).set('date', date);
    if (employeId !== null) params = params.set('employeId', employeId);

    return this.http.get<any[]>(`${this.apiUrl}/reservations/disponibles`, { params });
  }

  reserver(demande: any) {
    return this.http.post<any>(`${this.apiUrl}/reservations/reserver`, demande);
  }

  // 🌟 L'AJOUT EST ICI : La méthode pour déplacer/anticiper un rendez-vous 🌟
  deplacer(idRdv: number, demande: any) {
    return this.http.put<any>(`${this.apiUrl}/reservations/${idRdv}/deplacer`, demande);
  }
}
