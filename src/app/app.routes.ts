import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { PermissionGuard } from './core/auth/guards/role.guard';
import { FirstPassGuard } from './core/auth/guards/firstPass.guard';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    {path: '', pathMatch : 'full', redirectTo: 'tickets'},

    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'tickets'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes')},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes')},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes')},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes')},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes')},
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard, PermissionGuard, FirstPassGuard],
        canActivateChild: [AuthGuard, PermissionGuard, FirstPassGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes')},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes')}
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes')},
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard, PermissionGuard, FirstPassGuard],
        data: {
            permission: 'Tickets asignados'
        },
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'ticketsAsignados', loadChildren: () => import('app/modules/admin/tickets/tickets.routes')},
            // {path: 'nvo-ticket', loadChildren: () => import('app/modules/modal-nvo-ticket/modal-nvo-ticket.routes')},

        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard, PermissionGuard, FirstPassGuard],
        component: LayoutComponent,
        data: {
            permission: 'Proyectos'
        },
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            //{path: 'example', loadChildren: () => import('app/modules/admin/example/example.routes')},
            {path: 'proyectos', loadChildren: () => import('app/modules/admin/proyectos/proyectos.routes')},

        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard, PermissionGuard, FirstPassGuard],
        component: LayoutComponent,
        data: {
            permission: 'Roles'
        },
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            //{path: 'example', loadChildren: () => import('app/modules/admin/example/example.routes')},
            {path: 'roles', loadChildren: () => import('app/modules/admin/roles/roles.routes')},

        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard, PermissionGuard, FirstPassGuard],
        component: LayoutComponent,
        data: {
            permission: 'Mis Tickets'
        },
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            //{path: 'example', loadChildren: () => import('app/modules/admin/example/example.routes')},
            {path: 'tickets', loadChildren: () => import('app/modules/admin/misTickets/misTickets.routes')},

        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard, PermissionGuard, FirstPassGuard],
        component: LayoutComponent,
        data: {
            permission: 'Usuarios'
        },
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            //{path: 'example', loadChildren: () => import('app/modules/admin/example/example.routes')},
            {path: 'usuarios', loadChildren: () => import('app/modules/admin/users/users.routes')},

        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard, PermissionGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            //{path: 'example', loadChildren: () => import('app/modules/admin/example/example.routes')},
            {path: 'first-pass', loadChildren: () => import('app/modules/auth/first-pass/first-pass.routes')}

        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard, PermissionGuard, FirstPassGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            //{path: 'example', loadChildren: () => import('app/modules/admin/example/example.routes')},
            {path: 'area-atencion', loadChildren: () => import('app/modules/admin/area-atencion/area-atencion.routes')},

        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard, PermissionGuard, FirstPassGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            //{path: 'example', loadChildren: () => import('app/modules/admin/example/example.routes')},
            {path: 'modal', loadChildren: () => import('app/modules/admin/modales/modal.routes')},

        ]
    },


    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard, PermissionGuard, FirstPassGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            //{path: 'example', loadChildren: () => import('app/modules/admin/example/example.routes')},
            {path: 'scrumboard', loadChildren: () => import('app/modules/admin/scrumboard/scrumboard.routes')},

        ]
    },



];
