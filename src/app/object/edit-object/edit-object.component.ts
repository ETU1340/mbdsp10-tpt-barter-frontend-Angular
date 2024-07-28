import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ObjectService } from '../../shared/services/object.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IObject } from '../../shared/interfaces/other.interface';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit-object',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  templateUrl: './edit-object.component.html',
  styleUrls: ['./edit-object.component.css'],
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
export class EditObjectComponent implements OnInit {
  object: IObject | undefined;
  // Pour les champs de formulaire
  description = '';
  name = '';
  photos: string[] = [];
  categoryId :number | undefined;
  categories: { id: number, title: string }[] = []; // Liste des catégories
  showModal = false;

  constructor(
    private objectService: ObjectService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.objectService.getObject(id).subscribe((object) => {
      
      this.object = object;
      console.log(this.object);
      if (object !== undefined) {
        this.name = object.name;
        this.description = object.description;
        this.photos = object.photos || [];
      }
    });

    this.loadCategories();
  }

  handleCategoryChange(event: any) {
    const selectedCategory = this.categories[event.value];
    if (this.object && selectedCategory) {
      this.categoryId  = selectedCategory.id;
    }
  }
  handlePhotoUpload(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.photos.push(e.target.result.split(',')[1]); // On sauvegarde uniquement la partie base64
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }
  loadCategories() {
    // Supposons que le service possède une méthode pour obtenir les catégories
    this.objectService.getCategories().subscribe((categories) => {
      console.log(categories);
      this.categories = categories;

    });
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  handleUpdate() {
    if (!this.object) return;
    if (this.name === '' || this.description === '' || this.categoryId === undefined) return;
    // Assurez-vous de mettre à jour les autres champs nécessaires

    this.objectService.updateObject(this.object.id,this.name,this.description,this.categoryId,parseInt(this.object.owner.id),this.photos).subscribe((message) => {
      console.log(message);
      this.router.navigate(['/app/object/details/' + this.object!.id]);
    });
  }

  handleDelete() {
    if (this.object) {
      this.objectService.deleteObject(this.object).subscribe((message) => {
        this.object = undefined;
        this.router.navigate(['/app/objects']);
      });
    }
  }
}
