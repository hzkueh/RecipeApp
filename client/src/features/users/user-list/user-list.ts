import { Component, inject } from '@angular/core';
import { UserService } from '../../../core/services/user-service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { User } from '../../../types/user';
import { UserCard } from "../user-card/user-card";

@Component({
  selector: 'app-user-list',
  imports: [AsyncPipe, UserCard],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList {
  private userService = inject(UserService);
  protected users$ : Observable<User[]>;

  constructor(){
    this.users$ = this.userService.getUsers();
  }
}
