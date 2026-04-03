import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../core/services/reservation';
import { Salon } from '../../core/services/salon';
import { Auth } from '../../core/services/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

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

  modeAnticipation: boolean = false;
  oldRdvId: number | null = null;

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
      // On détecte le mode
      if (params['mode'] === 'anticiper' && params['oldRdvId']) {
        this.modeAnticipation = true;
        this.oldRdvId = params['oldRdvId'];
      }

      if (params['salonId']) {
        this.salonId = params['salonId'];
        // 👇 On passe "params" à la fonction pour qu'elle pré-remplisse les listes
        this.chargerDonneesSalon(this.salonId!, params);
      }
    });
  }

  allerVersConnexion() {
    this.router.navigate(['/login']);
  }

chargerDonneesSalon(salonId: number, params?: any) {
    // 🚀 On lance les deux requêtes EN MÊME TEMPS (Parallèle)
    forkJoin({
      prestations: this.salonService.getPrestationsPubliques(salonId),
      employes: this.salonService.getEmployesPublics(salonId)
    }).subscribe({
      next: ({ prestations, employes }) => {

        // 1. On stocke les données reçues
        this.prestationsDuSalon = prestations;
        this.tousLesEmployesDuSalon = employes;

        // 2. Pré-remplissage de la prestation
        if (params && params['prestationId']) {
          this.choix.prestationId = Number(params['prestationId']) as any;
        }

        // 3. Filtrage des coiffeurs
        if (this.choix.prestationId) {
          this.employesFiltres = this.tousLesEmployesDuSalon.filter(emp =>
            emp.prestations && emp.prestations.some((p: any) => p.id == this.choix.prestationId)
          );
        } else {
          this.employesFiltres = [...employes];
        }

        // 4. Pré-remplissage de l'employé et de la date
        if (params && params['employeId']) {
          this.choix.employeId = Number(params['employeId']) as any;
        }
        if (params && params['date']) {
          this.choix.date = params['date'];

          // On lance la recherche de créneaux
          this.chercherDispos();
        }

        // 🌟 LE COUP DE FOUET MAGIQUE (Ton idée !) 🌟
        // On force Angular à mettre à jour le HTML instantanément
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Erreur lors du chargement des données du salon", err)
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

    // On force null si "Peu m'importe" est coché
    const empId = this.choix.nImporteQui ? null : this.choix.employeId;

    if (empId === null && !this.choix.nImporteQui) {
        this.message = "Veuillez choisir un coiffeur ou cocher 'Peu importe'.";
        return;
    }

    this.reservationService.getCreneauxDisponibles(empId, this.choix.prestationId, this.choix.date)
          .subscribe({
            next: (resultats) => {
              let liste = resultats || [];

              // 🌟 TRI CHRONOLOGIQUE 🌟
              liste.sort((a: any, b: any) => {
                // On compare les chaînes ISO ou les tableaux de temps
                return a.heureDebut > b.heureDebut ? 1 : -1;
              });

              this.creneauxDisponibles = liste;
              this.message = liste.length === 0 ? "Aucun créneau disponible." : "";
              this.cdr.detectChanges();
            },
            error: (err) => {
                console.error("Erreur API :", err);
                this.message = "Erreur lors de la recherche des créneaux.";
            }
        });
}
confirmerRendezVous() {
    if (!this.estConnecte || !this.creneauSelectionne) return;

    const demande = {
      salonId: this.salonId,
      prestationId: this.choix.prestationId,
      employeId: this.creneauSelectionne.employe?.id || this.creneauSelectionne.employeId || this.choix.employeId,
      date: this.choix.date,
      heureDebut: this.creneauSelectionne.heureDebut
    };

    // 👇 LOGIQUE DE CHOIX : DÉPLACER ou CRÉER 👇
    if (this.modeAnticipation && this.oldRdvId) {
      this.reservationService.deplacer(this.oldRdvId, demande).subscribe({
        next: () => {
          alert("✅ Rendez-vous déplacé avec succès !");
          this.router.navigate(['/profile']); // On le renvoie sur son profil
        },
        error: () => alert("Erreur lors du déplacement.")
      });
    } else {
      this.reservationService.reserver(demande).subscribe({
        next: () => {
          alert("🎉 Réservation confirmée ! Vous recevrez un rappel WhatsApp.");
          this.router.navigate(['/']);
        },
        error: () => alert("Erreur lors de la réservation.")
      });
    }
  }

  // 👇 NOUVELLE FONCTION POUR CORRIGER LE BUG DE L'HEURE 👇
formaterHeure(heure: any): string {
    if (!heure) return '';

    // Cas 1 : C'est une String ISO "2026-04-03T14:30:00"
    if (typeof heure === 'string' && heure.includes('T')) {
        return heure.split('T')[1].substring(0, 5);
    }

    // Cas 2 : C'est un tableau [année, mois, jour, heure, minute]
    if (Array.isArray(heure) && heure.length >= 5) {
        const h = heure[3].toString().padStart(2, '0');
        const m = heure[4].toString().padStart(2, '0');
        return `${h}:${m}`;
    }

    return 'Heure'; // Valeur par défaut pour debug
}
}
