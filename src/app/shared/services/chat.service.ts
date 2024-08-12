import { Injectable, IterableChangeRecord } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IChat, IMessage, IUser } from '../../shared/interfaces/other.interface';
import { urls } from './urls';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}
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
      const user : IUser = {  id: chat.receiver.id,
        name: chat.receiver.name,
        username: chat.receiver.username,
        email: chat.receiver.email,
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
  sendMessage(idChat:string, message: IMessage): Observable<any> {
    const body = { author:message.author,text:message.text,timestamp:message.timestamp };
    return this.http.patch<any>(`${urls.chats.continueMessage}/${idChat}`, body);
  }
}
