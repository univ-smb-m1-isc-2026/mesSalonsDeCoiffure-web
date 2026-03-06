import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Indispensable pour ngModel
import { SalonService } from '../../core/services/salon.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  salonService = inject(SalonService);

  // L'objet qui contiendra les données du formulaire
  nouveauSalon = {
    nom: '',
    adresse: '',
    latitude: 0,
    longitude: 0
  };

  message = '';

ajouterSalon() {
    this.salonService.createSalon(this.nouveauSalon).subscribe({
      next: (response: any) => {
        this.message = `✅ Salon "${response.nom}" ajouté avec succès !`;
        this.nouveauSalon = { nom: '', adresse: '', latitude: 0, longitude: 0 };
      },
      error: (err: any) => {
        console.error(err);
        this.message = '❌ Erreur lors de l\'ajout du salon.';
      }
    });
  }
}
