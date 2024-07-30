import { Routes } from '@angular/router';
import { RolesComponent } from './roles.component';

export default [
    {
        path     : '',
        data     : {
            permission: 'Roles'
        },
        component: RolesComponent,
    },
] as Routes;