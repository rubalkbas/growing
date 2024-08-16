import { Routes } from '@angular/router'; 
import { CriptomonedasComponent } from './criptomonedas/criptomonedas.component';
import { FondosComponent } from './fondos/fondos.component';
import { AccionesComponent } from './acciones/acciones.component';
import { MateriasPrimasComponent } from './materiasPrimas/materiasPrimas.component';
import { DivisasComponent } from './divisas/divisas.component';
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
