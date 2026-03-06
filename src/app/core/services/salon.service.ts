// src/app/core/services/salon.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// On importe TOUJOURS le fichier par défaut (sans le .development)
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalonService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/salons`;

  getSalons() {
    return this.http.get<any[]>(this.apiUrl);
  }
}
