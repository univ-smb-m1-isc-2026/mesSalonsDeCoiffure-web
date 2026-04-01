import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private http = inject(HttpClient);
  // 👇 Enlève le /reservations ici
  private apiUrl = environment.apiUrl;

  getCreneauxDisponibles(employeId: number | null, prestationId: number, date: string) {
    let params = new HttpParams().set('prestationId', prestationId).set('date', date);
    if (employeId !== null) params = params.set('employeId', employeId);

    // 👇 Garde-le ici !
    return this.http.get<any[]>(`${this.apiUrl}/reservations/disponibles`, { params });
  }

  reserver(demande: any) {
    // 👇 Garde-le ici !
    return this.http.post<any>(`${this.apiUrl}/reservations/reserver`, demande);
  }

}
