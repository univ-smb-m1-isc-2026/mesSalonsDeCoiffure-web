import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalonService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/salons'; // L'URL de ton backend Spring Boot

  // Récupérer la liste des salons
  getSalons(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Créer un nouveau salon
  createSalon(salon: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, salon);
  }
}
