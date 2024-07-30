import { Routes } from '@angular/router';
import { UsersComponent } from './users.component';

export default [
    {
        path     : '',
        data     : {
            permission: 'Usuarios'
        },
        component: UsersComponent,
    },
] as Routes;