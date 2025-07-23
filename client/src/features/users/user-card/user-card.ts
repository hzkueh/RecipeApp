import { Component, input } from '@angular/core';
import { User } from '../../../types/user';
import { RouterLink } from '@angular/router';
import { AgePipe } from '../../../core/pipes/age-pipe';

@Component({
  selector: 'app-user-card',
  imports: [RouterLink, AgePipe],
  templateUrl: './user-card.html',
  styleUrl: './user-card.css'
})
export class UserCard {
  user = input.required<User>();
}
