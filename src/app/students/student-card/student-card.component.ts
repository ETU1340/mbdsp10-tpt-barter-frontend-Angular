import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-student-card',
  standalone: true,
  imports: [],
  templateUrl: './student-card.component.html',
  styleUrl: './student-card.component.css',
})
export class StudentCardComponent {
  @Input({ required: true })
  sid!: string;

  @Input({ required: true })
  name!: string;

  @Input({ required: true })
  photo!: string;
}
