import { Component, computed, inject, input } from '@angular/core';
import { User } from '../../../types/user';
import { RouterLink } from '@angular/router';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { LikesService } from '../../../core/services/likes-service';
import { PresenceService } from '../../../core/services/presence-service';

@Component({
  selector: 'app-user-card',
  imports: [RouterLink, AgePipe],
  templateUrl: './user-card.html',
  styleUrl: './user-card.css'
})
export class UserCard {
  private likeService = inject(LikesService);
  private presenceService = inject(PresenceService);
  user = input.required<User>();
  protected hasLiked = computed( () => this.likeService.likeIds().includes(this.user().id));
  protected isOnline = computed( () => this.presenceService.onlineUsers().includes(this.user().id));

  toggleLike(event : Event){
    event.stopPropagation();
    this.likeService.toggleLike(this.user().id).subscribe({
      next : () => {
        if(this.hasLiked()){
          this.likeService.likeIds.update(ids => ids.filter(x => x !== this.user().id));
        }
        else{
          this.likeService.likeIds.update(ids => [...ids, this.user().id])
        }
      }
    })
  }
}
