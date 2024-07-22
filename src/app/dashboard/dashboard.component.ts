import { Component } from '@angular/core';
import { TrocService } from '../shared/services/troc.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  stat:
    | {
        nbPost: number;
        nbExchangeSuccess: number;
      }
    | undefined;
  constructor(private trocService: TrocService) {}
  ngOnInit(): void {
    this.trocService.getStat().subscribe((data: any) => {
      console.log(data);
      this.stat = data;
    });
  }
}
