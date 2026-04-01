import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth';
@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin {
  authService = inject(Auth);
  router = inject(Router);

  credentials = { email: '', motDePasse: '' };
  messageErreur = '';

  seConnecterAdmin() {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        // VÉRIFICATION DE SÉCURITÉ : Est-ce vraiment un Admin ?
        if (response.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          // Si c'est un client normal, on le déconnecte de force et on affiche une erreur
          this.authService.logout();
          this.messageErreur = "🛑 Accès refusé. Vous n'avez pas les droits d'administration.";
        }
      },
      error: (err) => {
        this.messageErreur = "Identifiants incorrects.";
      }
    });
  }
}
