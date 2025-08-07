import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

import { PaginatedResult } from '../../types/pagination';
import { User } from '../../types/user';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  likeIds = signal<string[]>([]);
  
  toggleLike(targetMemberId : string){
    return this.http.post(`${this.baseUrl}likes/${targetMemberId}`, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number){
    //couldn't use append because it does not mutate the object but returns a new instance.
    //API calls will go without those query parameters
    let params = new HttpParams()
    .set('pageNumber',pageNumber)
    .set('pageSize',pageSize)
    .set('predicate',predicate);
    
    return this.http.get<PaginatedResult<User>>(this.baseUrl + 'likes', {params} );
  }

  getLikeIds(){
    return this.http.get<string[]>(this.baseUrl + 'likes/list').subscribe({
      next: ids => this.likeIds.set(ids)
    });
  }

  clearLikeIds(){
    this.likeIds.set([]);
  }
}
