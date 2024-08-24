import { Component, OnInit } from '@angular/core';
import { IChat, IUser, IMessage } from '../shared/interfaces/other.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../shared/services/chat.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-message',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ChatComponent implements OnInit {
  contacts: IUser[] = [];
  selectedChat: IChat | undefined;
  newMessage = '';
  userObject = JSON.parse(localStorage.getItem('user')!);
  userId: string;
  name: string;

  constructor(private messagingService: ChatService, private route: ActivatedRoute) {
  this.userId = this.userObject.id ;
  this.name = this.userObject.name;
  }

  ngOnInit() {
    this.loadContacts(this.userId);

    this.route.paramMap.subscribe((params) => {
      const chatId = params.get('id');
      if (chatId) {
        this.loadChat(chatId);
      }
    });
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
        console.log(this.userId);
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

      let idReceiver  = this.selectedChat.receiver.id;
      if(idReceiver == Number(this.userId) ) {
        idReceiver = this.selectedChat.sender.id;
      }
      this.messagingService
        .sendMessage(this.selectedChat._id!, message,idReceiver,this.name  )
        .subscribe((updatedChat) => {
          this.selectedChat = updatedChat.chat;
          this.newMessage = '';
        });
    }
  }
}
