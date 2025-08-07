import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { AccountService } from '../../../core/services/account-service';
import { UserService } from '../../../core/services/user-service';
import { LikesService } from '../../../core/services/likes-service';


@Component({
  selector: 'app-user-detail',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.css'
})
export class UserDetail implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private accountService = inject(AccountService);
  protected userService = inject(UserService);
  protected likeService = inject(LikesService);

  
  protected title = signal<string | undefined>('Profile');
  protected isCurrentUser = computed(() => {
    return this.accountService.currentUser()?.id === this.route.snapshot.paramMap.get('id');
  })

  ngOnInit(): void {

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
