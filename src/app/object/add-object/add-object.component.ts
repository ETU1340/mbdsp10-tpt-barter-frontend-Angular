import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ObjectService } from '../../shared/services/object.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService} from '../../shared/services/utility.service';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-object',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-object.component.html',
  styleUrls: ['./add-object.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSelectModule,
  ],
})
export class AddObjectComponent implements OnInit {
  name = '';
  description = '';
  photos: File[] = [];
  ownerId: number | undefined;
  categoryId: number | undefined;
  categories: { id: number, title: string }[] = [];
  
  constructor(
    private objectService: ObjectService,
    private utilityService: UtilityService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  handleCategoryChange(event: any) {
    this.categoryId = event.value;
  }
  handleFileInput(event: any) {
    const files = event.target.files;
    if (files) {
      this.photos = Array.from(files); // Convertir en tableau de fichiers
    }
  }

  loadCategories() {
    this.objectService.getCategories().subscribe((categories) => {
      console.log(categories);
      this.categories = categories;
    });
  }

  handleAddObject() {
    if (!this.name || !this.description || this.categoryId === undefined) return;

    const objectData = {
      name: this.name,
      description: this.description,
      categoryId: this.categoryId,
      photos: this.photos // Pour la prévisualisation seulement
    };
    const   userObject = JSON.parse(localStorage.getItem('user')!);
    this.ownerId =   Number(userObject.id);
    this.objectService.addObject( this.name,this.description,this.categoryId,this.ownerId,this.photos).subscribe((response:any) => {
      this.utilityService.showSuccessMessage('Objet créé avec succès');
    },
    (error) => {
      this.utilityService.showErrorMessage('Erreur lors de la création de l\'objet');
    });
  }
}
