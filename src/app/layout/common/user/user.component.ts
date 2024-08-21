import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types'; 
import { ClienteService } from 'app/modules/admin/clientes/clientes.service';
import { Subject, takeUntil } from 'rxjs';
import { ClienteModalComponent } from './clientes-modal/cliente.component';

@Component({
    selector       : 'user',
    templateUrl    : './user.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'user',
    standalone     : true,
    imports        : [MatButtonModule, MatMenuModule, NgIf, MatIconModule, NgClass, MatDividerModule],
})
export class UserComponent implements OnInit, OnDestroy
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = true;
    user: User;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    usuario: any;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userService: UserService,
        public dialog: MatDialog,
        private vlienteService: ClienteService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {

        let request = {
            "accion": "string",
            "dinero": 0,
            "estatusRetiro": 0,
            "fechaCreacion": "2024-08-12T05:15:57.772Z",
            "idDinero": 0,
            "idUsuario": localStorage.getItem('idUserWrog'),
            "tipo": "string"
          }
      
        

        this.vlienteService.consultaCliente(request).subscribe({
            next: (respuesta: any) => {
              console.log('Respuesta completa: ', respuesta);
              // Accediendo a la lista de areas de atención dentro de la respuesta
              if (respuesta.estatus === 'OK') {
                this.usuario = respuesta.dto; 
              } else {
                console.log(
                  'La respuesta no contiene una lista válida de areas de atención.'
                );
              }
            },
            error: (error: Error) => {
              console.error(error);
            },
          });

        // Subscribe to user changes
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) =>
            {
                this.user = user;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the user status
     *
     * @param status
     */
    updateUserStatus(status: string): void
    {
        // Return if user is not available
        if ( !this.user )
        {
            return;
        }

        // Update the user
        this._userService.update({
            ...this.user,
            status,
        }).subscribe();
    }

    /**
     * Sign out
     */
    signOut(): void
    {
        this._router.navigate(['/sign-out']);
    }

  
    modalCuenta( ): void {
        
        const dialogRef = this.dialog.open(ClienteModalComponent , {
          width: '550px',
          height: '550px',
          // height: '700px'
          data: {
            data: { data: this.usuario, usuario: 'Usuario de prueba' },
          }
        });
    
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            console.log('The dialog was closed');
          }
        });
      }

      


}
