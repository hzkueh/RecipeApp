import { Component, effect, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MessageService } from '../../../core/services/message-service';
import { UserService } from '../../../core/services/user-service';
import { Message } from '../../../types/message';
import { DatePipe } from '@angular/common';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-messages',
  imports: [DatePipe, TimeAgoPipe, FormsModule],
  templateUrl: './user-messages.html',
  styleUrl: './user-messages.css'
})
export class UserMessages implements OnInit {
  @ViewChild('messageEndRef') messageEndRef! : ElementRef
  private messageService = inject(MessageService);
  private userService = inject(UserService);
  protected messages = signal<Message[]>([]);
  protected messageContent = '';

  constructor(){
    effect( () => {
      const currentMessages = this.messages();
      if(currentMessages.length > 0){
        this.scrollToBottom();
      }
    })
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(){
    const userId = this.userService.user()?.id;
    if(userId){
      this.messageService.getMessageThread(userId).subscribe({
        next : response => this.messages.set(response.map(message => ({
          ...message,
          currentUserSender: message.senderId !== userId
        }))),
        
      })
    }
  }

  sendMessage(){
    const recipientId = this.userService.user()?.id;
    if(!recipientId) return;

    this.messageService.sendMessage(recipientId,this.messageContent).subscribe({
      next : response => {
        this.messages.update(messages => {
          response.currentUserSender = true;
          return [...messages, response]
        });
        this.messageContent = '';
      }
    })
  }

  scrollToBottom(){
    setTimeout( () => {
      if(this.messageEndRef){
        this.messageEndRef.nativeElement.scrollIntoView({
          behavior: 'smooth'
        })
      }
    })
    
  }
}
