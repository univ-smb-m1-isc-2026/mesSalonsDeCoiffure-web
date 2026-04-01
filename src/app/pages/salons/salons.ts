import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👈 INDISPENSABLE pour la barre de recherche
import { Salon } from '../../core/services/salon';
import * as L from 'leaflet';

@Component({
  selector: 'app-salons',
  standalone: true,
  imports: [CommonModule, FormsModule], // 👈 Ne l'oublie pas ici
  templateUrl: './salons.html',
  styleUrls: ['./salons.css']
})
export class Salons implements OnInit {
  salonService = inject(Salon);
  cdr = inject(ChangeDetectorRef);

  // --- Données ---
  salons: any[] = [];           // La liste brute (tous les salons)
  salonsFiltres: any[] = [];    // La liste après recherche
  salonsPagines: any[] = [];    // La liste affichée sur la page actuelle

  // --- Pagination & Filtre ---
  termeRecherche: string = '';
  pageActuelle: number = 1;
  salonsParPage: number = 4;    // Nombre de salons par page

  // --- Carte Leaflet ---
  private map: any;
  private markersLayer = L.layerGroup(); // 👈 Permet de grouper les punaises pour les effacer facilement

  customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  ngOnInit() {
    this.salonService.getSalonsPublics().subscribe({
      next: (data: any[]) => {
        this.salons = data;
        this.salonsFiltres = [...this.salons]; // Au début, on affiche tout
        this.mettreAJourPagination();
        this.initMap();
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error("Erreur lors du chargement des salons", err)
    });
  }

  // ==========================================
  // LOGIQUE DE FILTRE ET PAGINATION
  // ==========================================

  appliquerFiltre() {
    const terme = this.termeRecherche.toLowerCase().trim();

    // On filtre par nom OU par adresse
    this.salonsFiltres = this.salons.filter(salon =>
      salon.nom?.toLowerCase().includes(terme) ||
      salon.adresse?.toLowerCase().includes(terme)
    );

    this.pageActuelle = 1; // On revient à la première page après une recherche
    this.mettreAJourPagination();
    this.mettreAJourCarte(); // 👈 On actualise les punaises sur la carte
  }

  mettreAJourPagination() {
    const debut = (this.pageActuelle - 1) * this.salonsParPage;
    const fin = debut + this.salonsParPage;
    this.salonsPagines = this.salonsFiltres.slice(debut, fin);
  }

  changerPage(delta: number) {
    this.pageActuelle += delta;
    this.mettreAJourPagination();
  }

  get totalPages(): number {
    return Math.ceil(this.salonsFiltres.length / this.salonsParPage) || 1;
  }

  // ==========================================
  // LOGIQUE DE LA CARTE (LEAFLET)
  // ==========================================

  private initMap(): void {
    this.map = L.map('map').setView([46.603354, 1.888334], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // On ajoute le calque des marqueurs à la carte
    this.markersLayer.addTo(this.map);

    // On dessine les marqueurs initiaux
    this.mettreAJourCarte();
  }

  private mettreAJourCarte(): void {
    if (!this.map) return;

    // 1. On efface toutes les anciennes punaises
    this.markersLayer.clearLayers();

    // 2. On dessine une punaise pour chaque salon FILTRÉ (pas seulement ceux de la page)
    this.salonsFiltres.forEach(salon => {
      if (salon.latitude && salon.longitude) {
        const marker = L.marker([salon.latitude, salon.longitude], { icon: this.customIcon });

        marker.bindPopup(`
          <div style="text-align: center;">
            <b style="font-size: 1.1em; color: #2c3e50;">${salon.nom}</b><br>
            <span style="color: #7f8c8d; font-size: 0.9em;">${salon.adresse}</span><br><br>
            <a href="/reserver?salonId=${salon.id}" style="background: #27ae60; color: white; padding: 6px 12px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Réserver</a>
          </div>
        `);

        // On ajoute le marqueur à notre groupe de calques
        this.markersLayer.addLayer(marker);
      }
    });
  }
}
