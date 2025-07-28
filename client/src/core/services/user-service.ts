import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { EditableUSer, User, UserPhoto } from '../../types/user';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  editMode = signal(false);
  user = signal<User | null>(null);


  getUsers(){
    return this.http.get<User[]>(this.baseUrl + 'user');
  }

  getUser(id: string){
    return this.http.get<User>(this.baseUrl + 'user/' + id).pipe(
      tap(user => {
        this.user.set(user);
      })
    );
  }

  getUserPhotos(id: string){
    return this.http.get<UserPhoto[]>(this.baseUrl + 'user/' + id + '/photos')
  }

  //no need route params
  updateUser(user: EditableUSer){
    return this.http.put(this.baseUrl + 'user', user)
  }

  uploadPhoto(file: File){
    const formData = new FormData();
    formData.append('file',file);
    return this.http.post<UserPhoto>(this.baseUrl + 'user/add-photo', formData);
  }

  setMainPhoto(photo : UserPhoto){
    return this.http.put(this.baseUrl + 'user/set-main-photo/' + photo.id, {});
  }

  deletePhoto(photoId: number){
    return this.http.delete(this.baseUrl + 'user/delete-photo/' + photoId);
  }
}
