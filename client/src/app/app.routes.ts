import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { UserList } from '../features/users/user-list/user-list';
import { UserDetail } from '../features/users/user-detail/user-detail';
import { Lists } from '../features/lists/lists';
import { Messages } from '../features/messages/messages';
import { authGuard } from '../core/guards/auth-guard';
import { TestErrors } from '../features/test-errors/test-errors';
import { NotFound } from '../shared/errors/not-found/not-found';
import { ServerError } from '../shared/errors/server-error/server-error';
import { UserProfile } from '../features/users/user-profile/user-profile';
import { UserPhotos } from '../features/users/user-photos/user-photos';
import { UserMessages } from '../features/users/user-messages/user-messages';
import { userResolver } from '../features/users/user-resolver';

export const routes: Routes = [
    { path: '', component: Home },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            { path: 'users', component: UserList,},
            { 
                path: 'users/:id',
                resolve: {user : userResolver},
                runGuardsAndResolvers: 'always',
                component: UserDetail,
                children: [
                    { path : '', redirectTo: 'profile', pathMatch: 'full'},
                    { path : 'profile',component: UserProfile, title: 'Profile'},
                    { path : 'photos',component: UserPhotos, title: 'Photos'},
                    { path : 'messages',component: UserMessages, title: 'Messages'},
                ],
            },
            { path: 'lists', component: Lists },
            { path: 'messages', component: Messages },
        ]
    }
    ,
    { path: 'errors', component: TestErrors },
    { path: 'server-error', component: ServerError },
    { path: '**', component : NotFound },
];
