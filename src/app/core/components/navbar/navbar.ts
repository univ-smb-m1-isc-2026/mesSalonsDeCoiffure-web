import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- Indispensable pour *ngIf
import { Auth } from '../../services/auth'; // <-- Vérifie bien le chemin vers ton service !

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  authService = inject(Auth);
  router = inject(Router);

  // La méthode appelée par le bouton Déconnexion
  deconnecter() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
