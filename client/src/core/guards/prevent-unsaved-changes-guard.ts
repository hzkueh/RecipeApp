import { CanDeactivateFn } from '@angular/router';
import { UserProfile } from '../../features/users/user-profile/user-profile';

export const preventUnsavedChangesGuard: CanDeactivateFn<UserProfile> = (component) => {
  if(component.editForm?.dirty){
    return confirm('Are you sure you want to continue? Unsaved changes will be lost');
  }

  return true;
};
