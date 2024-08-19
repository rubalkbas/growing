import { Routes } from '@angular/router'; 
import { CriptomonedasComponent } from './criptomonedas/criptomonedas.component';
import { FondosComponent } from './fondos/fondos.component';
import { AccionesComponent } from './acciones/acciones.component';
import { MateriasPrimasComponent } from './materiasPrimas/materiasPrimas.component';
import { DivisasComponent } from './divisas/divisas.component'; 
import { CuentaComponent } from './cuenta/cuenta.component';
import { OperacionesAbiertasComponent } from './operaciones/abiertas/operaciones-abiertas.component';
import { OperacionesCerradasComponent } from './operaciones/cerradas/operaciones-cerradas.component';
import { CalendarioComponent } from './calendario/calendario.component';
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
            permission: 'administrador'
        },
        component: ClientesComponent,
    },

    {
        path     : 'miCuenta',
        data     : {
            permission: 'usuarios'
        },
        component: CuentaComponent,
    },

    {
        path     : 'operacionesCerradas',
        data     : {
            permission: 'usuarios'
        },
        component: OperacionesCerradasComponent,
    },


    {
        path     : 'operacionesAbiertas',
        data     : {
            permission: 'usuarios'
        },
        component: OperacionesAbiertasComponent,
    },

    {
        path     : 'calendario',
        data     : {
            permission: 'usuarios'
        },
        component: CalendarioComponent,
    },
    
    
] as Routes;
