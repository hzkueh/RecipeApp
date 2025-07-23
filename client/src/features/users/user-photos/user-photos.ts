import { Component, inject } from '@angular/core';
import { UserService } from '../../../core/services/user-service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { UserPhoto } from '../../../types/user';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-user-photos',
  imports: [AsyncPipe],
  templateUrl: './user-photos.html',
  styleUrl: './user-photos.css'
})
export class UserPhotos {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  protected photos$? : Observable<UserPhoto[]>;

  constructor(){
    const userId = this.route.parent?.snapshot.paramMap.get('id');
    if(userId){
      this.photos$ = this.userService.getUserPhotos(userId);
    }
  }

  get photoMocks(){
    return Array.from({length:20}, (_, i ) => ({
      url: '/user.png'
    }))
  }
}
