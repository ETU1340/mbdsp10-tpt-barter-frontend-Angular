import { Injectable, IterableChangeRecord } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IChat, IMessage, IUser } from '../../shared/interfaces/other.interface';
import { urls } from './urls';
import {NotificationService} from './notification.service';
import { map, switchMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient,private notificationService: NotificationService) {}
  // Récupère la liste des contacts d'un utilisateur
  getContacts(userId: string): Observable<IUser[]> {
    return this.http.get<IChat[]>(`${urls.chats.getByUser}/${userId}`).pipe(
      map((chats: IChat[]) => this.transformChatsToContacts(chats, userId))
    );
  }

  private transformChatsToContacts(chats: IChat[], userId: string): IUser[] {
    const contacts: IUser[] = chats.map((chat) => {
      let lastMessage = chat.messages[chat.messages.length - 1].text;
      if (lastMessage.length > 17) {
        lastMessage = lastMessage.substring(0, 16) + '...';
      }

      let userReceiver : IUser =  chat.receiver;

      if( chat.receiver.id == Number(userId)) {
         
        userReceiver = chat.sender;

      }
      const user : IUser = {  id: userReceiver.id,
        name: userReceiver.name,
        username: userReceiver.username,
        email: userReceiver.email,
        idChat : chat._id,
        lastMessage: lastMessage};
        return user;
      // Si l'utilisateur courant est l'expéditeur, le contact est le destinataire
      //return 
    });
    return contacts;
  }

  // Récupère la discussion entre deux utilisateurs
  getChat(idChat: string): Observable<IChat> {
    return this.http.get<IChat>(`${urls.chats.get}/${idChat}`);
  }

  // Envoie un message entre deux utilisateurs
  sendMessage(idChat:string, message: IMessage, idReceiver: number|undefined,nameSender:string): Observable<any> {
    return this.notificationService.createNotification(idReceiver,"Nouveau message",`${nameSender} vous a envoyer un nouveau message `).pipe(
      // Utiliser un opérateur 'switchMap' pour enchaîner les observables
      switchMap((response) => {
      const body = { author:String(message.author),text:message.text,timestamp:message.timestamp };
      console.log(body);
      return this.http.patch<any>(`${urls.chats.continueMessage}/${idChat}`, body);
    })
  );
  
  }

  // Envoie un message entre deux utilisateurs
  createMessage(chat: IChat): Observable<any> {
    // Créer une notification puis envoyer le message
    console.log(chat.receiver);
    return this.notificationService
      .createNotification(
        chat.receiver.id,
        "Nouveau message",
        `${chat.sender.username} vous a envoyé un nouveau message`
      )
      .pipe(
        // Utiliser un opérateur 'switchMap' pour enchaîner les observables
        switchMap((response) => {
          const body = {
            sender: chat.sender,
            receiver: chat.receiver,
            messages: chat.messages,
          };
          // Retourner l'observable du post HTTP
          return this.http.post<any>(`${urls.chats.post}`, body);
        })
      );
  }
  
}
