import { Component, HostListener, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { EditableUSer, User } from '../../../types/user';
import { DatePipe } from '@angular/common';
import { UserService } from '../../../core/services/user-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';
import { AccountService } from '../../../core/services/account-service';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';

@Component({
  selector: 'app-user-profile',
  imports: [DatePipe, FormsModule, TimeAgoPipe],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfile implements OnInit, OnDestroy{
  
  @ViewChild('editForm') editForm? : NgForm; 
  @HostListener('window:beforeunload',['$event']) notify($event:BeforeUnloadEvent){
    if(this.editForm?.dirty){
      $event.preventDefault();
    }
  }
  private accountService = inject(AccountService);
  protected userService = inject(UserService);
  private toast = inject(ToastService);
  
  //initialize value with empty string
  protected editableUser : EditableUSer = {
      displayName :  '',
      description :  '',
      city :  '',
      country :  '',
  };



  ngOnInit(): void {
    
    this.editableUser = {
      displayName : this.userService.user()?.displayName || '',
      description : this.userService.user()?.description || '',
      city : this.userService.user()?.city || '',
      country : this.userService.user()?.country || '',
    }
  }

  updateProfile(){
    if(!this.userService.user()) return;

    //triple dot for all the properties of user
    const updatedUser = {...this.userService.user(), ...this.editableUser};
    this.userService.updateUser(this.editableUser).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();

        if(currentUser && updatedUser.displayName !== currentUser?.displayName){
          currentUser.displayName = updatedUser.displayName;
          this.accountService.setCurrentUser(currentUser);
        }

        this.toast.success('Profile updated!');
        this.userService.editMode.set(false);
        this.userService.user.set(updatedUser as User);
        this.editForm?.reset(updatedUser);
      }
    })
    
  }

  ngOnDestroy(): void {
    if(this.userService.editMode()){
      this.userService.editMode.set(false);
    }
  }
}
