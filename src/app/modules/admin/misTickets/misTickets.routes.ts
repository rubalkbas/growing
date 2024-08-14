import { Routes } from '@angular/router';

import { MisTicketsComponent } from './misTickets.component';

export default [
    {
        path     : '',
        data     : {
            permission: 'usuarios'
        },
        component: MisTicketsComponent,
    },
] as Routes;
