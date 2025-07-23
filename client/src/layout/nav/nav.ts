import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { ToastService } from '../../core/services/toast-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { themes } from '../theme';

@Component({
  selector: 'app-nav',
  imports: [FormsModule,RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav implements OnInit {
  
  protected accountService = inject(AccountService);
  private router = inject(Router);
  private toast = inject(ToastService);


  protected creds : any = {};
  protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light');
  protected themes = themes;

  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', this.selectedTheme());
  }

  handleSelectTheme(theme : string){
    this.selectedTheme.set(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    const element_theme = document.activeElement as HTMLDivElement;
    if(element_theme) element_theme.blur();
  }

  login(){
    this.accountService.login(this.creds).subscribe({
      next: () => {
        this.router.navigateByUrl('/users');
        this.toast.success('Logged in successfully');
        this.creds = {};
      },
      error: error => {
        this.toast.error(error.error);
      }
    })
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
