// src/app/core/services/salon.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// On importe TOUJOURS le fichier par défaut (sans le .development)
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalonService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/salons`;

  getSalons() {
    return this.http.get<any[]>(this.apiUrl);
  }

  createSalon(salon: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, salon);
  }
}
