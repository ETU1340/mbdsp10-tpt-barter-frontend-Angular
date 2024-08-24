import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../shared/services/notification.service';
import { Notification } from '../shared/interfaces/other.interface';
import { CommonModule} from '@angular/common';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  standalone: true,
  imports: [
    CommonModule,
  ],
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  userObject = JSON.parse(localStorage.getItem('user')!);
  currentUserId: number = Number(this.userObject.id) ;
  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.getNotifications();
  }

  getNotifications(): void {

      this.notificationService.getNotifications(this.currentUserId).subscribe((data: Notification[]) => {
        console.log(data);
      this.notifications = data;
    });
  }

  markAsRead(notification: Notification): void {
    this.notificationService.markAsRead(notification).subscribe(() => {
      notification.isRead = true;
    });
  }
}
