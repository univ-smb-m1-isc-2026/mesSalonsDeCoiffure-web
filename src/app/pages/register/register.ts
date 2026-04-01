import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  authService = inject(Auth);
  router = inject(Router);

  // L'objet qui va contenir les infos du formulaire
  nouvelUtilisateur = {
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    role: 'USER' // Rôle par défaut
  };

  // Pour gérer la case à cocher Admin (uniquement pour le projet scolaire !)
  isAdmin = false;

  messageErreur = '';
  messageSucces = '';

  sInscrire() {
    // Si la case Admin est cochée, on change le rôle avant d'envoyer au backend
    this.nouvelUtilisateur.role = this.isAdmin ? 'ADMIN' : 'USER';

    this.authService.register(this.nouvelUtilisateur).subscribe({
      next: (response) => {
        this.messageSucces = "✅ Compte créé avec succès ! Redirection vers la connexion...";

        // On attend 2 secondes pour qu'il lise le message, puis on l'envoie vers le login
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        // Le backend renvoie une erreur (ex: email déjà pris)
        this.messageErreur = err.error.message || "❌ Erreur lors de l'inscription.";
        console.error(err);
      }
    });
  }
}
