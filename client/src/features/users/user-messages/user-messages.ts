import { Component, effect, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { MessageService } from '../../../core/services/message-service';
import { UserService } from '../../../core/services/user-service';
import { Message } from '../../../types/message';
import { DatePipe } from '@angular/common';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';
import { FormsModule } from '@angular/forms';
import { PresenceService } from '../../../core/services/presence-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-messages',
  imports: [DatePipe, TimeAgoPipe, FormsModule],
  templateUrl: './user-messages.html',
  styleUrl: './user-messages.css'
})
export class UserMessages implements OnInit, OnDestroy {
  @ViewChild('messageEndRef') messageEndRef! : ElementRef
  protected messageService = inject(MessageService);
  private userService = inject(UserService);
  protected presenceService = inject(PresenceService);
  
  protected messageContent = '';
  private route = inject(ActivatedRoute);

  constructor(){
    effect( () => {
      const currentMessages = this.messageService.messageThread();
      if(currentMessages.length > 0){
        this.scrollToBottom();
      }
    })
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe({
      next: params => {
        const otherUserId = params.get('id');
        if(!otherUserId) throw new Error('Cannot connect to hub');
        this.messageService.createHubConnection(otherUserId);

      }
    })
  }



  sendMessage(){
    const recipientId = this.userService.user()?.id;
    if(!recipientId) return;

    this.messageService.sendMessage(recipientId, this.messageContent)?.then(
      () => {
        this.messageContent = '';
      }
    )
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
