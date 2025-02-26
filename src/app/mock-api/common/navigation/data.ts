/* eslint-disable */
import { ittivaNavigationItem } from '@ittiva/components/navigation';

export const defaultNavigation: ittivaNavigationItem[] = [
 
    {
        id: 'usuarios',
        perfil: 'Cliente',
        title: 'Simbolos',
        type: 'collapsable',
        icon: 'heroicons_outline:currency-dollar',
        children: [
            {
                id: 'dashboards.project',
                title: 'Criptomonedas',
                type: 'basic',
                icon: 'heroicons_outline:currency-dollar',
                link: '/growing/criptomonedas',
            },
            {
                id: 'dashboards.materias',
                title: 'Materias Primas',
                type: 'basic',
                icon: 'heroicons_outline:currency-dollar',
                link: '/growing/materiasPrimas',
            } ,
            {
                id: 'dashboards.divisas',
                title: 'Divisas',
                type: 'basic',
                icon: 'heroicons_outline:currency-dollar',
                link: '/growing/divisas',
            } ,
            {
                id: 'dashboards.acciones',
                title: 'Acciones',
                type: 'basic',
                icon: 'heroicons_outline:currency-dollar',
                link: '/growing/acciones',
            } ,
            {
                id: 'dashboards.fondo',
                title: 'Fondo',
                type: 'basic',
                icon: 'heroicons_outline:currency-dollar',
                link: '/growing/fondos',
            } ,
      
        ],
    },
   
    {
        id: 'dashboards.fondo',
        perfil: 'Cliente',
        title: 'Mis Operaciones',
        type: 'collapsable',
        icon: 'heroicons_outline:banknotes',
        children: [
            {
                id: 'dashboards.project',
                title: 'Abiertas',
                type: 'basic',
                icon: 'heroicons_outline:banknotes',
                link: '/growing/operacionesAbiertas',
            },
            {
                id: 'dashboards.materias',
                title: 'Cerradas',
                type: 'basic',
                icon: 'heroicons_outline:banknotes',
                link: '/growing/operacionesCerradas',
            } 
        ]
    } ,
    {
        id: 'dashboards.fondo',
        perfil: 'Administrador',
        title: 'Usuarios',
        type: 'collapsable',
        icon: 'heroicons_outline:user-group',
        children: [
            {
                id: 'dashboards.project',
                title: 'Clientes',
                type: 'basic',
                icon: 'heroicons_outline:user-group',
                link: '/growing/clientes'
            }
        ]
    } ,
       
    {
        id: 'dashboards.fondo',
        perfil: 'Cliente',
        title: 'Calendario Economico',
        type: 'basic',
        icon: 'heroicons_outline:calendar-days',
        link: '/growing/calendario',
    }  ,
   
    {
        id: 'dashboards.fondo',
        perfil: 'Cliente',
        title: 'Mi Cuenta',
        type: 'basic',
        icon: 'heroicons_outline:user',
        link: '/growing/miCuenta',
    } ,   
    {
        id: 'dashboards.cuenta',
        perfil: 'Cliente',
        title: 'Cuenta',
        type: 'basic',
        icon: 'heroicons_outline:user',
        link: '/growing/miCuenta',
    } 
   
];
/* export const compactNavigation: ittivaNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: ittivaNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: ittivaNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
]; */
