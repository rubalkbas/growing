import { Component, Inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TicketsService } from 'app/modules/services/ticket.service';
import { AlertService } from 'app/modules/services/alerts.service';
import { User } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RolesService } from 'app/modules/services/roles.service';

interface ViewValue {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'user-rol-details-modal',
    templateUrl: './user-details-modal.component.html',
    styleUrls: ['./user-details-modal.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        FormsModule,
        MatIconModule,
        MatButtonModule,
    ],
})
export class ModalDetallesRoles {
    proyectosForm: FormGroup;
    personas: ViewValue[] = [];
    usuarioLoggeado: any;
    archivos: File[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    asignado: string | null = null;
    estatus: number | null = null;
    usuariosAsignados: any[] = [];

    constructor(
        public dialogRef: MatDialogRef<ModalDetallesRoles>,
        private fb: FormBuilder,
        private ticketService: TicketsService,
        private alertService: AlertService,
        private _userService: UserService,
        private rolService: RolesService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.estatus = this.data.usuario.estatus.toString();
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.usuarioLoggeado = user.id;
            });

            console.log(this.data.usuario)

        this.proyectosForm = this.fb.group({
            nombre: ['', Validators.required],
            descripcion: ['', Validators.required],
            idResponsableProyecto: ['', Validators.required],
        });
    }

    get descripcion() {
        return this.proyectosForm.get('descripcion');
    }

    onClose(): void {
        this.dialogRef.close();
    }

    formatUserId(id: number): string {
        return id.toString().padStart(7, '0') + '-IUS';
    }

    cambiarEstatus() {
        let usuario: any = {
            idUsuario: this.data.usuario.idUsuario,
            estatus: this.estatus
        };

        this.ticketService.updateUserEstatus(usuario).subscribe({
            next: (respuesta: any) => {
                if (respuesta.estatus === 'OK') {
                    this.alertService.success(
                        'Estatus actualizado',
                        'El estatus del usuario se ha actualizado correctamente'
                    );

                    this.data.usuario.estatus = this.estatus;
                } else {
                    this.alertService.error(
                        'Error',
                        'Error al actualizar el estatus del usuario'
                    );
                }

                // console.log('Respuesta completa: ', respuesta);
            },
            error: (error: Error) => {
                console.error(error);
                this.alertService.error(
                    'Error',
                    'Error al actualizar el estatus del proyecto'
                );
            },
        });
    }

    // getUsersByRole() {
    //     forkJoin([
    //         this.rolService.getUsersByRole(this.data.rol.idRol),
    //         this.ticketService.getAllUsers(),
    //     ]).subscribe(([response, users]) => {
    //         this.usuariosAsignados = response.lista;

    //         console.log('esta es la lista de usuarios',this.usuariosAsignados)

    //         // Si no hay usuarios asignados, se muestran todos los usuarios
    //         if (this.usuariosAsignados === null) {
    //             this.personas = users.lista.map((user: any) => {
    //                 //console.log('este es el usuarioooooooooooo ', user)
    //                 return {
    //                     value: user.idUsuario,
    //                     viewValue: `${user.nombre} (${user.idRol.nombreRol})`,
    //                 };
    //             });
    //         } else {
    //             // Se filtran los usuarios que no estén asignados
    //             this.personas = users.lista
    //                 .map((user: any) => {
    //                     //console.log('este es el usuarioooooooooooo 2', user)
    //                     if (
    //                         !this.usuariosAsignados.find(
    //                             (u) => u.idUsuario === user.idUsuario
    //                         )
    //                     ) {
    //                         return {
    //                             value: user.idUsuario,
    //                             viewValue: `${user.nombre} (${user.idRol.nombreRol})`,
    //                         };
    //                     }
    //                 })
    //                 .filter((user: any) => user !== undefined);
    //         }
    //     });
    // }



}
