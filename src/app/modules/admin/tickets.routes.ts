import { Routes } from '@angular/router'; 
import { CriptomonedasComponent } from './criptomonedas/tickets.component';
import { FondosComponent } from './fondos/tickets.component';
import { AccionesComponent } from './acciones/tickets.component';
import { MateriasPrimasComponent } from './materiasPrimas/tickets.component';
import { DivisasComponent } from './divisas/tickets.component';
import { ClientesComponent } from './clientes/clientes.component';

export default [
    {
        path     : 'divisas',
        data     : {
            permission: 'usuarios'
        },
        component: DivisasComponent,
    },
    {
        path     : 'criptomonedas',
        data     : {
            permission: 'usuarios'
        },
        component: CriptomonedasComponent,
    },
    {
        path     : 'fondos',
        data     : {
            permission: 'usuarios'
        },
        component: FondosComponent,
    },
    {
        path     : 'acciones',
        data     : {
            permission: 'usuarios'
        },
        component: AccionesComponent,
    },
    {
        path     : 'materiasPrimas',
        data     : {
            permission: 'usuarios'
        },
        component: MateriasPrimasComponent,
    },
    {
        path     : 'clientes',
        data     : {
            permission: 'usuarios'
        },
        component: ClientesComponent,
    },
    
] as Routes;
