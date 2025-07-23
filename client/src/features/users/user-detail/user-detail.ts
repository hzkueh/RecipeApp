import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { User } from '../../../types/user';
import { AgePipe } from '../../../core/pipes/age-pipe';


@Component({
  selector: 'app-user-detail',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.css'
})
export class UserDetail implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router)
  protected user = signal<User | undefined>(undefined);
  protected title = signal<string | undefined>('Profile');

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => this.user.set(data['user'])
    })
    this.title.set(this.route.firstChild?.snapshot?.title);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe({
      next : () => {
        this.title.set(this.route.firstChild?.snapshot?.title);
      }
    })
  }


}
