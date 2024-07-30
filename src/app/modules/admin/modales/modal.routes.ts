import { Routes } from '@angular/router';
import { ModalComponent } from './modal.component';

export default [
    {
        path     : '',
        data     : {
            permission: 'Proyectos'
        },
        component: ModalComponent,
    },
] as Routes;
