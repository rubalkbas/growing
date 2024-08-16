/* eslint-disable */
import { ittivaNavigationItem } from '@ittiva/components/navigation';

export const defaultNavigation: ittivaNavigationItem[] = [
 
    {
        id: 'usuarios',
        title: 'Simbolos',
        type: 'collapsable',
        icon: 'heroicons_solid:academic-cap',
        children: [
            {
                id: 'dashboards.project',
                title: 'Criptomonedas',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/growing/criptomonedas',
            },
            {
                id: 'dashboards.materias',
                title: 'Materias Primas',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/growing/materiasPrimas',
            } ,
            {
                id: 'dashboards.divisas',
                title: 'Divisas',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/growing/divisas',
            } ,
            {
                id: 'dashboards.acciones',
                title: 'Acciones',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/growing/acciones',
            } ,
            {
                id: 'dashboards.fondo',
                title: 'Fondo',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/growing/fondos',
            } ,
      
        ],
    },
   
    {
        id: 'dashboards.fondo',
        title: 'Mis Operaciones',
        type: 'collapsable',
        icon: 'heroicons_outline:clipboard-document-check',
        children: [
            {
                id: 'dashboards.project',
                title: 'Abiertas',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/growing/operacionesAbiertas',
            },
            {
                id: 'dashboards.materias',
                title: 'Cerradas',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/growing/operacionesCerradas',
            } 
        ]
    } ,
    {
        id: 'dashboards.fondo',
        title: 'Clientes',
        type: 'basic',
        icon: 'heroicons_outline:clipboard-document-check',
        link: '/growing/clientes',
    },
   
    {
        id: 'dashboards.fondo',
        title: 'Calendario Economico',
        type: 'basic',
        icon: 'heroicons_outline:clipboard-document-check',
        link: '/growing/calendario',
    }  ,
   
    {
        id: 'dashboards.fondo',
        title: 'Mis Cuenta',
        type: 'basic',
        icon: 'heroicons_outline:clipboard-document-check',
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
