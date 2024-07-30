import { Routes } from '@angular/router';

import { MisTicketsComponent } from './misTickets.component';

export default [
    {
        path     : '',
        data     : {
            permission: 'Mis tickets'
        },
        component: MisTicketsComponent,
    },
] as Routes;
