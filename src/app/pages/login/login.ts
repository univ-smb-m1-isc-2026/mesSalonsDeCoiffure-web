import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  authService = inject(Auth);
  router = inject(Router);

  credentials = {
    email: '',
    motDePasse: ''
  };

  messageErreur = '';

  seConnecter() {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        // Le client normal va vers la recherche de salons
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.messageErreur = "Email ou mot de passe incorrect.";
      }
    });
  }
}
