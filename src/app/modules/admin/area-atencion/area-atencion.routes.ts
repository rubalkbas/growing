import { Routes } from '@angular/router';
import { AreaAtencionComponent } from './area-atencion.component';

export default [
    {
        path     : '',
        data     : {
            permission: 'Área de atención'
        },
        component: AreaAtencionComponent,
    },
] as Routes;
