import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../core/services/reservation';
import { Salon } from '../../core/services/salon';
import { Auth } from '../../core/services/auth';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation.html',
  styleUrls: ['./reservation.css'] // 👈 J'ai décommenté cette ligne !
})
export class Reservation implements OnInit {
  reservationService = inject(ReservationService);
  salonService = inject(Salon);
  authService = inject(Auth);
  route = inject(ActivatedRoute);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  estConnecte: boolean = false;
  salonId: number | null = null;

  prestationsDuSalon: any[] = [];
  tousLesEmployesDuSalon: any[] = [];
  employesFiltres: any[] = [];

  client = { nom: '', telephone: '' };

  choix = {
    prestationId: null,
    employeId: null,
    nImporteQui: false,
    date: ''
  };

  creneauxDisponibles: any[] = [];
  creneauSelectionne: any = null;
  message = '';

  ngOnInit() {
    this.estConnecte = this.authService.isLoggedIn();

    if (this.estConnecte) {
      this.authService.getMe().subscribe({
        next: (user) => {
          this.client.nom = user.prenom + ' ' + user.nom;
          this.client.telephone = user.telephone;
          this.cdr.detectChanges();
        },
        error: (err) => console.error("Erreur chargement profil client", err)
      });
    } else {
      this.allerVersConnexion();
    }

    this.route.queryParams.subscribe(params => {
      if (params['salonId']) {
        this.salonId = params['salonId'];
        this.chargerDonneesSalon(this.salonId!);
      }
    });
  }

  allerVersConnexion() {
    this.router.navigate(['/login']);
  }

  chargerDonneesSalon(salonId: number) {
    this.salonService.getPrestationsPubliques(salonId).subscribe(data => this.prestationsDuSalon = data);

    this.salonService.getEmployesPublics(salonId).subscribe(data => {
      this.tousLesEmployesDuSalon = data;
      this.employesFiltres = [...data];
    });
  }

  onPrestationChange() {
    this.choix.employeId = null;
    this.creneauxDisponibles = [];

    if (this.choix.prestationId) {
      this.employesFiltres = this.tousLesEmployesDuSalon.filter(emp =>
        emp.prestations && emp.prestations.some((p: any) => p.id == this.choix.prestationId)
      );
    }
  }

  chercherDispos() {
    if (!this.choix.prestationId || !this.choix.date) {
      this.message = "Veuillez choisir une prestation et une date.";
      return;
    }

    const empId = this.choix.nImporteQui ? null : this.choix.employeId;

    if (!empId && !this.choix.nImporteQui) {
      this.message = "Veuillez choisir un coiffeur ou cocher 'Peu importe'.";
      return;
    }

    this.reservationService.getCreneauxDisponibles(empId, this.choix.prestationId, this.choix.date)
      .subscribe({
        next: (creneaux) => {
          const resultats = creneaux || [];
          this.creneauxDisponibles = resultats;
          this.message = resultats.length === 0 ? "Aucun créneau disponible à cette date." : "";
        },
        error: (err) => {
          console.error(err);
          this.message = "Erreur de recherche.";
        }
      });
  }

confirmerRendezVous() {
    if (!this.estConnecte) {
      this.message = "Veuillez vous connecter pour réserver.";
      return;
    }

    if (!this.creneauSelectionne) return;

  const demande = {
      salonId: this.salonId,
      prestationId: this.choix.prestationId,
      employeId: this.creneauSelectionne.employe?.id || this.creneauSelectionne.employeId || this.choix.employeId,

      date: this.choix.date,
      heureDebut: this.creneauSelectionne.heureDebut
    };

    this.reservationService.reserver(demande).subscribe({
      next: () => {
        alert("🎉 Réservation confirmée ! Vous recevrez un rappel WhatsApp.");
        this.router.navigate(['/']);
      },
      error: () => alert("Erreur lors de la réservation.")
    });
  }

  // 👇 NOUVELLE FONCTION POUR CORRIGER LE BUG DE L'HEURE 👇
formaterHeure(heure: string): string {
    if (!heure) return '';

    // Si l'API renvoie "2026-04-03T09:00:00"
    if (heure.includes('T')) {
      // On coupe au 'T', on prend la 2ème partie ("09:00:00"), et on garde 5 caractères
      return heure.split('T')[1].substring(0, 5);
    }

    // Au cas où l'API renverrait juste "09:00:00" un jour
    return heure.substring(0, 5);
  }
}
