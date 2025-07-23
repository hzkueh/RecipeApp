import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User, UserPhoto } from '../../types/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;


  getUsers(){
    return this.http.get<User[]>(this.baseUrl + 'user');
  }

  getUser(id: string){
    return this.http.get<User>(this.baseUrl + 'user/' + id);
  }

  getUserPhotos(id: string){
    return this.http.get<UserPhoto[]>(this.baseUrl + 'user/' + id + '/photos')
  }
}
