import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

    constructor(private snackBar: MatSnackBar) {}

    showSuccessMessage(message: string) {
        this.snackBar.open(message, 'Close', {
            duration: 2000, // Durée en millisecondes
            panelClass: ['success-snackbar'] // Classe CSS pour les erreurs
        });
    }

    showErrorMessage(message: string) {
        this.snackBar.open(message, 'Close', {
            duration: 2000, // Durée en millisecondes
            panelClass: ['error-snackbar'] // Classe CSS pour les erreurs
        });
    }
}

