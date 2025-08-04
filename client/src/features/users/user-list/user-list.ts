import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { UserService } from '../../../core/services/user-service';
import { User, UserParams } from '../../../types/user';
import { UserCard } from "../user-card/user-card";
import { PaginatedResult } from '../../../types/pagination';
import { Paginator } from "../../../shared/paginator/paginator";
import { FilterModal } from '../filter-modal/filter-modal';


@Component({
  selector: 'app-user-list',
  imports: [UserCard, Paginator, FilterModal],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList implements OnInit{
  @ViewChild('filterModal') modal!: FilterModal;
  private userService = inject(UserService);
  protected paginatedUsers = signal<PaginatedResult<User> | null>(null);
  protected userParams = new UserParams();
  protected updatedParams = new UserParams();

  constructor(){
    const filters = localStorage.getItem('filters');
    if(filters){
      this.userParams = JSON.parse(filters);
      this.updatedParams = JSON.parse(filters);
    }
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(){
    this.userService.getUsers(this.userParams).subscribe({
      next: result => {
        this.paginatedUsers.set(result);
      }
    })
  }

  onPageChange(event : {pageNumber: number, pageSize : number}){
    this.userParams.pageNumber = event.pageNumber;
    this.userParams.pageSize = event.pageSize;
    this.loadUsers();
  }

  openModal(){
    this.modal.open();
  }

  onClose(){
    console.log('modal close');
  }

  onFilterChange(data: UserParams){
    this.userParams = {...data};
    this.updatedParams = {...data};
    this.loadUsers();
  }

  resetFilter(){
    this.userParams = new UserParams();
    this.updatedParams = new UserParams();

    this.modal.reset();

    this.loadUsers();
  }

  get displayMessage(): string {
    const defaultParams = new UserParams();
    const filters: string[] = [];

    if(this.updatedParams.gender){
      filters.push(this.updatedParams.gender + 's')
    }else{
      filters.push('Males, Females');
    }

    if(this.updatedParams.minAge !== defaultParams.minAge 
      || this.updatedParams.maxAge !== defaultParams.maxAge){
        filters.push(` ages ${this.updatedParams.minAge}-${this.updatedParams.maxAge}`)
    }

    filters.push(this.updatedParams.orderBy === 'lastActivity' ? 'Last Active' : 'Newest Users');

    return filters.length > 0 ? `Selected: ${filters.join('  | ')}` : 'All Members'
  }
}
