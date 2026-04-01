import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // 👈 AJOUT INDISPENSABLE
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  authService = inject(Auth);
  router = inject(Router); // 👈 AJOUT INDISPENSABLE pour la redirection
  cdr = inject(ChangeDetectorRef);

  message = '';
  erreur = '';

  utilisateur: any = {
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    rappelsReguliers: false,
    notifsWhatsapp: false
  };

  mesRendezVous: any[] = [];

  ngOnInit() {
    // 1. Chargement du profil
    this.authService.getMe().subscribe({
      next: (userFromDb) => {
        this.utilisateur = userFromDb;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors du chargement du profil", err);
        this.erreur = "Impossible de charger votre profil. Le serveur a renvoyé une erreur " + err.status;
      }
    });

    // 2. Chargement de l'historique des RDV
    this.authService.getMesRendezVous().subscribe({

      next: (rdvs: any[]) => {
        this.mesRendezVous = rdvs;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error(err)
    });
  }

  anticiperRendezVous(rdv: any) {
    // Redirection vers la réservation avec les paramètres nécessaires
    this.router.navigate(['/reserver'], {
      queryParams: { salonId: rdv.salon.id, mode: 'anticiper', oldRdvId: rdv.id }
    });
  }

  sauvegarderProfil() {
    this.message = '';
    this.erreur = '';

    this.authService.updateMe(this.utilisateur).subscribe({
      next: (userMisAJour) => {
        this.utilisateur = userMisAJour;
        this.message = "✅ Profil et préférences mis à jour avec succès !";
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        console.error("Erreur lors de la sauvegarde", err);
        this.erreur = "❌ Une erreur est survenue lors de l'enregistrement.";
      }
    });
  }
}
