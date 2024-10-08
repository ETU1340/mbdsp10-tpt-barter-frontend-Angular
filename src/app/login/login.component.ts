import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-assignment',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // champs du formulaire
  mail = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}
  onSubmit(event: any) {
    if (this.mail == '' || this.password === undefined) return;
    this.authService
      .logInConnexion(this.mail, this.password)
      .subscribe((reponse) => {
        if (reponse !== false) {
          console.log(reponse);
          this.errorMessage = '';
          localStorage.setItem('authToken', reponse.token);
          const userJson = JSON.stringify(reponse.user);
          console.log(userJson);
          localStorage.setItem('user',userJson);
          this.router.navigate(['/app']);
        } else {
          this.errorMessage = 'Information incorrecte';
          return;
        }
      });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
