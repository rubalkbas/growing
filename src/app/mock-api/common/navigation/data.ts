/* eslint-disable */
import { ittivaNavigationItem } from '@ittiva/components/navigation';

export const defaultNavigation: ittivaNavigationItem[] = [
 
    {
        id: 'dsra ',
        title: 'Tickets asignados',
        type: 'collapsable',
        icon: 'heroicons_solid:academic-cap',
        children: [
            {
                id: 'dashboards.project',
                title: 'Criptomonedas',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/ticketsAsignados',
            },
            {
                id: 'dashboards.materias',
                title: 'Materias Primas',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/ticketsAsignados',
            } ,
            {
                id: 'dashboards.divisas',
                title: 'Divisas',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/ticketsAsignados',
            } ,
            {
                id: 'dashboards.acciones',
                title: 'Acciones',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/ticketsAsignados',
            } ,
            {
                id: 'dashboards.fondo',
                title: 'Fondo',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/ticketsAsignados',
            } 
        ],
    },
    {
        id: 'roles',
        title: 'Roles1',
        type: 'basic',
        icon: 'heroicons_solid:user-circle',
        link: '/roles',
    },
    {
        id: 'usuarios',
        title: 'Usuarios1',
        type: 'basic',
        icon: 'heroicons_solid:user-circle',
        link: '/usuarios',
    },
    {
        id: 'usuarios',
        title: 'Área de atención1',
        type: 'basic',
        icon: 'heroicons_solid:user-circle',
        link: '/area-atencion',
    },
    // {
    //     id: 'modal',
    //     title: 'Modal',
    //     type: 'basic',
    //     icon: 'heroicons_solid:user-circle',
    //     link: '/modal',
    // },
    {
        id: 'proyectos',
        title: 'Proyectos1',
        type: 'collapsable',
        icon: 'heroicons_solid:clipboard-document-list',
        link: '/proyectos',
    },
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
