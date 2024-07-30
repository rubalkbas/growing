import { Routes } from '@angular/router';
import { ProyectosComponent } from './proyectos.component';

export default [
    {
        path     : '',
        data     : {
            permission: 'Proyectos'
        },
        component: ProyectosComponent,
    },
] as Routes;
