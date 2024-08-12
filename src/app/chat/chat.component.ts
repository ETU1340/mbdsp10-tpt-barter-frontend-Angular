import { Component, OnInit } from '@angular/core';
import { IChat, IUser, IMessage } from '../shared/interfaces/other.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../shared/services/chat.service';
import {MapComponent} from '../map/map.component'

@Component({
  selector: 'app-message',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule,MapComponent],
})
export class ChatComponent implements OnInit {
  contacts: IUser[] = [];
  selectedChat: IChat | undefined;
  newMessage = '';
  userObject = JSON.parse(localStorage.getItem('user')!);
  userId: string = this.userObject.id || '';

  constructor(private messagingService: ChatService) {}

  ngOnInit() {
    this.loadContacts(this.userId);
  }

  loadContacts(userId: string) {
    this.messagingService.getContacts(userId).subscribe((contacts) => {
      this.contacts = contacts;
      if (contacts.length > 0) {
        this.loadChat(contacts[0].idChat!); // Charger le premier chat par défaut
      }
    });
  }

  loadChat(idChat: string) {
    this.messagingService.getChat(idChat).subscribe((chat) => {
        console.log(chat);
      this.selectedChat = chat;
    });
  }

  sendMessage() {
    if (this.newMessage.trim() && this.selectedChat) {
      const message: IMessage = {
        author: this.userId,
        text: this.newMessage,
        timestamp: new Date(),
      };

      this.messagingService
        .sendMessage(this.selectedChat._id, message)
        .subscribe((updatedChat) => {
          this.selectedChat = updatedChat.chat;
          this.newMessage = '';
        });
    }
  }
}
