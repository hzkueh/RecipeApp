import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginCreds, RegisterCreds, Account } from '../../types/account';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private likesService = inject(LikesService);
  currentUser = signal<Account | null >(null);
  private baseUrl = environment.apiUrl;

  register(creds: RegisterCreds){
    return this.http.post<Account>(this.baseUrl +'account/register', creds).pipe(
      tap(user => {
        if(user){
          this.setCurrentUser(user)
        }
      })
    )
  }

  login(creds : LoginCreds){
    return this.http.post<Account>(this.baseUrl + 'account/login', creds).pipe(
      tap(user => {
        if(user){
          this.setCurrentUser(user)
        }
      })
    )
  }

  setCurrentUser(user: Account){
    localStorage.setItem('user', JSON.stringify(user)),
    this.currentUser.set(user);
    this.likesService.getLikeIds();
  }

  logout(){
    localStorage.removeItem('user');
    localStorage.removeItem('filters');
    this.likesService.clearLikeIds();
    this.currentUser.set(null);
    
  }
}
