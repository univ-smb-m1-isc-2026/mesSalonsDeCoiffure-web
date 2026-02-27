import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalonService } from '../../core/services/salon.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  salonService = inject(SalonService);
  salons: any[] = [];

  ngOnInit() {
    // Au chargement de la page, on va chercher les salons dans la base de données
    this.salonService.getSalons().subscribe({
      next: (data) => this.salons = data,
      error: (err) => console.error('Erreur de chargement', err)
    });
  }
}
