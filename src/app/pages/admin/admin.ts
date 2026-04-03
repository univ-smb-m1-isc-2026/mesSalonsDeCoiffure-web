import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Salon } from '../../core/services/salon';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin implements OnInit {
  salonService = inject(Salon);
  cdr = inject(ChangeDetectorRef);
  // --- ÉTATS GLOBAUX ---
  salons: any[] = [];
  salonSelectionne: any = null; // Le salon en cours de gestion

  messages = { global: '', salon: '', employe: '', prestation: '' };

  // --- FORMULAIRES (Sert pour l'Ajout ET la Modification) ---
  formSalon: any = { id: null, nom: '', adresse: '', latitude: 0, longitude: 0 };
  formEmploye: any = { id: null, nom: '' };
  formPrestation: any = { id: null, nom: '', dureeMinutes: 30, prix: 10 };

  // --- SIMULATION DES DONNÉES (En attendant ton Backend) ---
  employes: any[] = [];
  prestations: any[] = [];

  afficherModalSuppression = false;
  salonASupprimerId: number | null = null;

  // Ajoute ceci avec tes autres variables (employes, prestations...)
  creneaux: any[] = [];

// Liste pour le menu déroulant
joursDeLaSemaine = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'];

formCreneau: any = {
  employeId: null,
  jourSemaine: '', // 👈 Changé
  heureDebut: '',
  heureFin: ''
};

  ngOnInit() {
    this.chargerSalons();
  }

  // ==========================================
  // 1. GESTION DES SALONS
  // ==========================================
  chargerSalons() {
    this.salonService.getMesSalons().subscribe({
      next: (data) => {
        this.salons = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur salons', err)
    });
  }

  sauvegarderSalon() {
    if (this.formSalon.id) {
      // ✏️ LOGIQUE DE MODIFICATION
      this.salonService.updateMonSalon(this.formSalon.id, this.formSalon).subscribe({
        next: (salonMisAJour) => {
          // On met à jour la liste visuelle sans recharger la page
          const index = this.salons.findIndex(s => s.id === salonMisAJour.id);
          if (index !== -1) {
            this.salons[index] = salonMisAJour;
          }

          this.messages.salon = `✅ Salon modifié avec succès !`;
          this.annulerEditionSalon();
          setTimeout(() => this.messages.salon = '', 3000);
          this.cdr.detectChanges(); // On réveille l'écran
        },
        error: (err) => {
          this.messages.salon = "❌ Erreur lors de la modification.";
          console.error(err);
        }
      });
    } else {
      // ➕ LOGIQUE DE CRÉATION
      this.salonService.createMonSalon(this.formSalon).subscribe({
        next: (nouveauSalon) => {
          this.salons.push(nouveauSalon); // On ajoute visuellement
          this.messages.salon = `✅ Salon ajouté avec succès !`;
          this.annulerEditionSalon();
          setTimeout(() => this.messages.salon = '', 3000);
          this.cdr.detectChanges(); // On réveille l'écran
        },
        error: (err) => {
          this.messages.salon = "❌ Erreur lors de l'ajout.";
          console.error(err);
        }
      });
    }
  }

  editerSalon(salon: any) {
    this.formSalon = { ...salon }; // Copie les données dans le formulaire
  }

  supprimerSalon(id: number) {
    if (confirm("Êtes-vous sûr de vouloir supprimer définitivement ce salon ?")) {

      // On appelle notre nouvelle méthode du service
      this.salonService.deleteMonSalon(id).subscribe({
        next: () => {
          // 1. On retire le salon de la liste visuelle
          this.salons = this.salons.filter(s => s.id !== id);

          // 2. Si on était en train de gérer ce salon, on ferme la vue détaillée
          if (this.salonSelectionne?.id === id) {
            this.salonSelectionne = null;
          }

          // 3. On affiche un message de succès
          this.messages.global = "🗑️ Salon supprimé avec succès.";
          setTimeout(() => this.messages.global = '', 3000);

          // 4. On réveille l'écran pour appliquer les changements
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.messages.global = "❌ Erreur lors de la suppression.";
          console.error("Erreur suppression :", err);
          this.cdr.detectChanges();
        }
      });
    }
  }

  annulerEditionSalon() {
    this.formSalon = { id: null, nom: '', adresse: '', latitude: 0, longitude: 0 };
  }

  // ----------------------------------------------------------------------
  // MODIFICATION DE gererSalon() pour charger les données depuis la BDD
  // ----------------------------------------------------------------------
  gererSalon(salon: any) {
    this.salonSelectionne = salon;
    this.messages = { global: '', salon: '', employe: '', prestation: '' };

    this.salonService.getEmployes(salon.id).subscribe(data => { this.employes = data; this.cdr.detectChanges(); });
    this.salonService.getPrestations(salon.id).subscribe(data => { this.prestations = data; this.cdr.detectChanges(); });
    // 👇 NOUVEAU
    this.salonService.getCreneaux(salon.id).subscribe(data => { this.creneaux = data; this.cdr.detectChanges(); });
  }
  retourSalons() {
    this.salonSelectionne = null;
  }

  // ==========================================
  // 3. GESTION DES EMPLOYÉS DU SALON
  // ==========================================
  sauvegarderEmploye() {
    if (this.formEmploye.id) {
      this.salonService.updateEmploye(this.formEmploye.id, this.formEmploye).subscribe(emp => {
        const index = this.employes.findIndex(e => e.id === emp.id);
        if(index !== -1) this.employes[index] = emp;
        this.messages.employe = "✅ Coiffeur modifié";
        this.formEmploye = { id: null, nom: '' };
        this.cdr.detectChanges();
      });
    } else {
      this.salonService.addEmploye(this.salonSelectionne.id, this.formEmploye).subscribe(emp => {
        this.employes.push(emp);
        this.messages.employe = "✅ Coiffeur ajouté";
        this.formEmploye = { id: null, nom: '' };
        this.cdr.detectChanges();
      });
    }
  }

  editerEmploye(emp: any) { this.formEmploye = { ...emp }; }

  supprimerEmploye(id: number) {
    // Suppression immédiate sans confirmation (UX plus rapide)
    this.salonService.deleteEmploye(id).subscribe({
      next: () => {
        this.employes = this.employes.filter(e => e.id !== id);
        this.messages.employe = "🗑️ Coiffeur retiré de l'équipe.";
        setTimeout(() => this.messages.employe = '', 3000); // Fait disparaître le message
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.messages.employe = "❌ Erreur lors de la suppression.";
        console.error("Erreur suppression employé :", err);
        this.cdr.detectChanges();
      }
    });
  }
  // ==========================================
  // 4. GESTION DES PRESTATIONS DU SALON
  // ==========================================
  sauvegarderPrestation() {
    if (this.formPrestation.id) {
      this.salonService.updatePrestation(this.formPrestation.id, this.formPrestation).subscribe(prest => {
        const index = this.prestations.findIndex(p => p.id === prest.id);
        if(index !== -1) this.prestations[index] = prest;
        this.messages.prestation = "✅ Service modifié";
        this.formPrestation = { id: null, nom: '', dureeMinutes: 30, prix: 10 };
        this.cdr.detectChanges();
      });
    } else {
      this.salonService.addPrestation(this.salonSelectionne.id, this.formPrestation).subscribe(prest => {
        this.prestations.push(prest);
        this.messages.prestation = "✅ Service ajouté";
        this.formPrestation = { id: null, nom: '', dureeMinutes: 30, prix: 10 };
        this.cdr.detectChanges();
      });
    }
  }

  editerPrestation(prest: any) { this.formPrestation = { ...prest }; }

  supprimerPrestation(id: number) {
    // Suppression immédiate sans confirmation
    this.salonService.deletePrestation(id).subscribe({
      next: () => {
        this.prestations = this.prestations.filter(p => p.id !== id);
        this.messages.prestation = "🗑️ Prestation retirée du catalogue.";
        setTimeout(() => this.messages.prestation = '', 3000);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.messages.prestation = "❌ Erreur lors de la suppression.";
        console.error("Erreur suppression prestation :", err);
        this.cdr.detectChanges();
      }
    });
  }




  // Vérifie si un employé possède déjà une prestation (pour cocher la case)
  employePossedePrestation(emp: any, prest: any): boolean {
    return emp.prestations && emp.prestations.some((p: any) => p.id === prest.id);
  }

  // Clic sur la case à cocher (Ajoute ou Retire)
  togglePrestation(emp: any, prest: any, event: any) {
    const estCoche = event.target.checked;

    if (estCoche) {
      this.salonService.assignerPrestation(emp.id, prest.id).subscribe(updatedEmp => {
        const index = this.employes.findIndex(e => e.id === emp.id);
        if (index !== -1) this.employes[index] = updatedEmp;
        this.cdr.detectChanges();
      });
    } else {
      this.salonService.retirerPrestation(emp.id, prest.id).subscribe(updatedEmp => {
        const index = this.employes.findIndex(e => e.id === emp.id);
        if (index !== -1) this.employes[index] = updatedEmp;
        this.cdr.detectChanges();
      });
    }
  }




  // 1. Quand on clique sur la poubelle (On ouvre la modale au lieu du window.confirm)
  demanderSuppression(id: number) {
    this.salonASupprimerId = id;
    this.afficherModalSuppression = true;
  }

  // 2. Si on clique sur "Annuler" dans la modale
  annulerSuppression() {
    this.afficherModalSuppression = false;
    this.salonASupprimerId = null;
  }

  // 3. Si on clique sur "Oui, supprimer" dans la modale (C'est ton ancien code !)
  confirmerSuppression() {
    if (this.salonASupprimerId !== null) {
      this.salonService.deleteMonSalon(this.salonASupprimerId).subscribe({
        next: () => {
          this.salons = this.salons.filter(s => s.id !== this.salonASupprimerId);
          if (this.salonSelectionne?.id === this.salonASupprimerId) {
            this.salonSelectionne = null;
          }
          this.messages.global = "🗑️ Salon supprimé avec succès.";
          setTimeout(() => this.messages.global = '', 3000);

          // On ferme la modale et on réveille l'écran
          this.annulerSuppression();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.messages.global = "❌ Erreur lors de la suppression.";
          console.error("Erreur suppression :", err);
          this.annulerSuppression();
          this.cdr.detectChanges();
        }
      });
    }
  }



  // 👇 MÉTHODES POUR LES CRÉNEAUX 👇
  sauvegarderCreneau() {
    if (!this.formCreneau.employeId || !this.formCreneau.jourSemaine || !this.formCreneau.heureDebut) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    // L'appel au service reste identique, c'est l'objet envoyé qui change
    this.salonService.addCreneau(this.formCreneau.employeId, this.formCreneau).subscribe({
      next: (nouveau) => {
        this.creneaux.push(nouveau);
        this.cdr.detectChanges();
      }
    });
  }

  supprimerCreneau(id: number) {
    this.salonService.deleteCreneau(id).subscribe(() => {
      this.creneaux = this.creneaux.filter(c => c.id !== id);
      this.cdr.detectChanges();
    });
  }
}
