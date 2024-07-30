import { Routes } from '@angular/router';
import { ExampleComponent } from 'app/modules/admin/tickets/tickets.component';

export default [
    {
        path     : '',
        data     : {
            permission: 'Tickets asignados'
        },
        component: ExampleComponent,
    },
] as Routes;
