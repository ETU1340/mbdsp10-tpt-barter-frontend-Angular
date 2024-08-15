import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
  ]
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  mail: string = '';
  name: string = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.mail == '' || this.name === undefined || this.password === undefined || this.username === undefined) return;
    this.authService
      .register(this.name,this.mail,this.username, this.password)
      .subscribe((reponse) => {
        console.log(reponse);
        if (reponse) {
          this.errorMessage = '';
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = 'email non correcte';
          return;
        }
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
