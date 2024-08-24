import { Component } from '@angular/core';
import { ObjectService } from '../shared/services/object.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
exhange : number = 0;
  constructor(private ObjectService: ObjectService) {}
  ngOnInit(): void {
    this.ObjectService.getStat().subscribe((data: any) => {
      console.log(data);
      this.exhange = data.dailyExchange;
    });
  }
}
