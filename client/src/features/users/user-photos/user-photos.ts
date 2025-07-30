import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../../core/services/user-service';
import { ActivatedRoute } from '@angular/router';
import { User, UserPhoto } from '../../../types/user';
import { ImageUpload } from "../../../shared/image-upload/image-upload";
import { AccountService } from '../../../core/services/account-service';
import { Account } from '../../../types/account';
import { StarButton } from "../../../shared/star-button/star-button";
import { DeleteButton } from "../../../shared/delete-button/delete-button";

@Component({
  selector: 'app-user-photos',
  imports: [ImageUpload, StarButton, DeleteButton],
  templateUrl: './user-photos.html',
  styleUrl: './user-photos.css'
})
export class UserPhotos implements OnInit {
  protected userService = inject(UserService);
  protected accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  protected photos = signal<UserPhoto[]>([]);
  protected loading = signal(false);
  

  ngOnInit(): void {
    const userId = this.route.parent?.snapshot.paramMap.get('id');
    if(userId){
      this.userService.getUserPhotos(userId).subscribe({
        next : photos => this.photos.set(photos)
      });
    }
  }

  onUploadImage(file: File){
    
    this.loading.set(true);
    this.userService.uploadPhoto(file).subscribe({
      next: photo => {
        this.userService.editMode.set(false);
        this.loading.set(false);
        this.photos.update(photos => [...photos, photo]);
        //check if user has at least 1 image when register
        if(!this.userService.user()?.imageUrl){
          this.setMainLocalPhoto(photo);
        }
      },
      error: error => {
        console.log('Error uploading image', error);
        this.loading.set(false);
      }
    })
  }

  setMainPhoto(photo : UserPhoto){
    this.userService.setMainPhoto(photo).subscribe({
      next : () => {
        this.setMainLocalPhoto(photo);
      }
    })
  }

  deletePhoto(photoId : number){
    this.userService.deletePhoto(photoId).subscribe({
      next: () => {
        this.photos.update(photos => photos.filter(x => x.id !== photoId))
      }
    })
  }

  private setMainLocalPhoto(photo : UserPhoto){
    const currentUser = this.accountService.currentUser();
        if(currentUser) currentUser.imageURL = photo.url;
        this.accountService.setCurrentUser(currentUser as Account);
        this.userService.user.update(user => ({
          //take existing props of user
          ...user,
          imageUrl: photo.url
        }) as User)
  }
}
