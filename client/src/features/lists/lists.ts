import { Component, inject, OnInit, signal } from '@angular/core';
import { LikesService } from '../../core/services/likes-service';
import { User } from '../../types/user';
import { UserCard } from "../users/user-card/user-card";
import { PaginatedResult } from '../../types/pagination';
import { Paginator } from "../../shared/paginator/paginator";


@Component({
  selector: 'app-lists',
  imports: [UserCard, Paginator],
  templateUrl: './lists.html',
  styleUrl: './lists.css'
})
export class Lists implements OnInit {
  
  private likeService = inject(LikesService);
  protected paginatedResult = signal<PaginatedResult<User> | null>(null);
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 5;
  protected isLoading = signal(false);
  

  tabs = [
    {label: 'Liked', value: 'liked'},
    {label: 'Liked me', value: 'likedBy'},
    {label: 'Mutual', value: 'mutual'},
  ];

  ngOnInit(): void {
    this.loadLikes();
  }

  setPredicate(predicate : string){
    if(this.predicate !== predicate){
      this.predicate = predicate;
      this.pageNumber = 1;
      this.loadLikes();
    }
  }

  loadLikes(){
    this.likeService.getLikes(this.predicate, this.pageNumber,this.pageSize)
      .subscribe({
      next: response => {
        this.paginatedResult.set(response)
      }
    }) 
  }

  onPageChange(event : { pageNumber: number, pageSize: number }){
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageNumber;
    this.loadLikes();    
  }

  
}
