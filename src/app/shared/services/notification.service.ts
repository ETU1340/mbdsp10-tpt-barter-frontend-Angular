import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../interfaces/other.interface';
import { urls } from './urls';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) {}

  getNotifications(userId:number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${urls.notification.get}/user/${userId}`);
  }

  markAsRead(notification: Notification): Observable<any> {
    return this.http.put(`${urls.notification.put}/${notification._id}/read`, { });
  }

  // Nouvelle méthode pour créer une notification
  createNotification(userId: number|undefined, subject: string, message: string): Observable<Notification> {
    console.log(message);
    console.log(urls.notification.post);
    return this.http.post<Notification>(urls.notification.post, { userId, subject, message });
  }
}
