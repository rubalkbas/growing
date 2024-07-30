import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/modules/services/alerts.service';
import { of, switchMap, take } from 'rxjs';

export const PermissionGuard: CanActivateFn | CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    
    const router: Router = inject(Router);
    const userService: UserService = inject(UserService);
    const alertService: AlertService = inject(AlertService);

    return userService.user$.pipe(
        take(1),
        switchMap((user: any) => {
            // Si el usuario no está autenticado...
            if (!user) {
                // Redirigir a la página de inicio de sesión con un parámetro redirectUrl
                const redirectURL = state.url === '/sign-out' ? '' : `redirectURL=${state.url}`;
                const urlTree = router.parseUrl(`sign-in?${redirectURL}`);

                return of(urlTree);
            }

            // Obtener el permiso requerido de los datos de la ruta
            const requiredPermission = route.data && route.data['permission'];

            // Si el usuario no tiene el permiso requerido...
            if (requiredPermission && !user.permisos.some((item: any) => item.idPermiso.nombre === requiredPermission)) {
                // Redirigir a una página de acceso denegado
                const urlTree = router.parseUrl('access-denied');
                alertService.error('Error', 'No tienes permiso para acceder a esta página');

                return of(router.parseUrl('access-denied'));
            }

            // Permitir el acceso
            return of(true);
        }),
    );
};
