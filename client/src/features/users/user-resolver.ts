import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { UserService } from '../../core/services/user-service';
import { User } from '../../types/user';
import { EMPTY } from 'rxjs';

export const userResolver: ResolveFn<User> = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const userId = route.paramMap.get('id');

  if(!userId) {
    router.navigateByUrl('/not-found');
    return EMPTY;
  }

  return userService.getUser(userId);
};
