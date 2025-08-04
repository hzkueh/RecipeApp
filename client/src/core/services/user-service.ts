import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { EditableUSer, User, UserParams, UserPhoto } from '../../types/user';
import { tap } from 'rxjs';
import { PaginatedResult } from '../../types/pagination';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  editMode = signal(false);
  user = signal<User | null>(null);


  getUsers(userParams : UserParams){
    let params = new HttpParams();

    params = params.append('pageNumber', userParams.pageNumber);
    params = params.append('pageSize', userParams.pageSize);
    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('orderBy', userParams.orderBy);

    if(userParams.gender) params = params.append('gender', userParams.gender);

    return this.http.get<PaginatedResult<User>>(this.baseUrl + 'user', {params}).pipe(
      tap( () => {
        localStorage.setItem('filters', JSON.stringify(userParams))
      }) 
    );
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
