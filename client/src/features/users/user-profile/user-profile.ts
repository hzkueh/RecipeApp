import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../types/user';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  imports: [DatePipe],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfile implements OnInit{
  
  private route = inject(ActivatedRoute);
  protected user = signal<User | undefined>(undefined);

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.user.set(data['user']);
    })
  }
}
