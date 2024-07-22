import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-assignment-card',
  standalone: true,
  imports: [],
  templateUrl: './assignment-card.component.html',
  styleUrl: './assignment-card.component.css',
})
export class AssignmentCardComponent {
  @Input({ required: true })
  data: any;
}
