import { Component, Inject, OnInit } from '@angular/core';
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
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RolesService } from 'app/modules/services/roles.service';
import { PerfilamientoService } from 'app/modules/services/perfilamientos.service';
import {
    MatCheckboxChange,
    MatCheckboxModule,
} from '@angular/material/checkbox';

interface ViewValue {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'app-rol-details-modal',
    templateUrl: './rol-details-modal.component.html',
    styleUrls: ['./rol-details-modal.component.scss'],
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
        MatCheckboxModule,
    ],
})
export class ModalDetallesRoles implements OnInit {
    proyectosForm: FormGroup;
    personas: ViewValue[] = [];
    usuarioLoggeado: any;
    archivos: File[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    asignado: string | null = null;
    estatus: number | null = null;
    usuariosAsignados: any[] = [];
    permisos: any[] = [];
    permisosSeleccionados: any[] = [];
    permisosSelec: any[] = [];
    permisosOriginales: any[] = [];
    // permisosSeleccionados: Set<number> = new Set<number>();

    constructor(
        public dialogRef: MatDialogRef<ModalDetallesRoles>,
        private fb: FormBuilder,
        private ticketService: TicketsService,
        private alertService: AlertService,
        private _userService: UserService,
        private rolService: RolesService,
        private perfilamientoService: PerfilamientoService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.estatus = this.data.rol.estatus.toString();
        this.permisos = this.data.permisos;
        this.permisosSeleccionados = this.data.permisosRol;
        this.permisosOriginales = this.data.permisosRol;

        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.usuarioLoggeado = user.id;
            });

        console.log('Todos los permisos: ', this.permisos);
        console.log('Permisos seleccionados: ', this.permisosSeleccionados);
        // Agregamos a permisosSelec los idPermiso de this.permisosSeleccionados
        this.permisosSeleccionados.forEach((permiso) => {
            this.permisosSelec.push(permiso.idPermiso.idPermiso);
        });
        console.log('Permisos selec: ', this.permisosSelec);

        this.getUsersByRole();

        this.proyectosForm = this.fb.group({
            nombre: ['', Validators.required],
            descripcion: ['', Validators.required],
            idResponsableProyecto: ['', Validators.required],
        });
    }

    get descripcion() {
        return this.proyectosForm.get('descripcion');
    }

    limpiarChecks(): void {
        this.permisos.forEach((permiso) => (permiso.seleccionado = false));
    }

    onClose(): void {
        this.dialogRef.close();
    }

    isPermisoSeleccionado(idPermiso: number): boolean {
        return this.permisosSeleccionados.some(
            (permiso: any) => permiso.idPermiso.idPermiso === idPermiso
        );
    }

    togglePermiso(event: MatCheckboxChange, permiso: any) {
        if (event.checked) {
            this.permisosSelec.push(permiso.idPermiso);
        } else {
            this.permisosSelec = this.permisosSelec.filter(
                (idPermiso) => idPermiso !== permiso.idPermiso
            );
        }
    }

    obtenerPermisosSeleccionados(): any[] {
        return this.permisosSeleccionados;
    }

    agregarPersonal() {
        if (this.asignado === null) {
            this.alertService.error(
                'Error',
                'Selecciona una persona para asignar al proyecto'
            );
            return;
        }
        const personal = {
            idRol: this.data.rol.idRol,
            idUsuario: this.asignado,
        };
        // console.log(personal);
        this.rolService.asignRoleToUser(personal).subscribe({
            next: (response) => {
                //console.log(response);
                if (response.estatus === 'OK') {
                    this.alertService.success(
                        'Persona asignada',
                        'La persona se ha asignado correctamente'
                    );

                    this.getUsersByRole();
                } else {
                    this.alertService.error(
                        'Error',
                        'Error al asignar la persona'
                    );
                }
            },
            error: (error) => {
                this.alertService.error('Error', 'Error al asignar la persona');
                console.error(error);
            },
        });
    }

    formatRolId(id: number): string {
        return id.toString().padStart(7, '0') + '-IRL';
    }

    cambiarEstatus() {
        let rol: any = {
            estatus: this.estatus,
            idRol: this.data.rol.idRol,
            nombreRol: this.data.rol.nombreRol,
        };

        this.rolService.updateRole(rol).subscribe({
            next: (respuesta: any) => {
                if (respuesta.estatus === 'OK') {
                    this.alertService.success(
                        'Estatus actualizado',
                        'El estatus del rol se ha actualizado correctamente'
                    );

                    this.data.rol.estatus = this.estatus;
                } else {
                    this.alertService.error(
                        'Error',
                        'Error al actualizar el estatus del rol'
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

    getUsersByRole() {
        forkJoin([
            this.rolService.getUsersByRole(this.data.rol.idRol),
            this.ticketService.getAllUsers(),
        ]).subscribe(([response, users]) => {
            this.usuariosAsignados = response.lista;

            console.log('esta es la lista de usuarios', this.usuariosAsignados);

            // Si no hay usuarios asignados, se muestran todos los usuarios
            if (this.usuariosAsignados === null) {
                this.personas = users.lista.map((user: any) => {
                    //console.log('este es el usuarioooooooooooo ', user)
                    return {
                        value: user.idUsuario,
                        viewValue: `${user.nombre} (${user.idRol.nombreRol})`,
                    };
                });
            } else {
                // Se filtran los usuarios que no estén asignados
                this.personas = users.lista
                    .map((user: any) => {
                        //console.log('este es el usuarioooooooooooo 2', user)
                        if (
                            !this.usuariosAsignados.find(
                                (u) => u.idUsuario === user.idUsuario
                            )
                        ) {
                            return {
                                value: user.idUsuario,
                                viewValue: `${user.nombre} (${user.idRol.nombreRol})`,
                            };
                        }
                    })
                    .filter((user: any) => user !== undefined);
            }
        });
    }

    borrarPersonal(id: any) {
        const idUsuario = {
            idUsuario: id,
        };

        this.rolService.deleteRoleFromUser(idUsuario).subscribe({
            next: (respuesta: any) => {
                if (respuesta.estatus === 'OK') {
                    this.alertService.success(
                        'Persona eliminada',
                        'La persona se ha eliminado correctamente'
                    );
                    this.asignaRolDefault(idUsuario);
                    this.getUsersByRole();
                } else {
                    this.alertService.error(
                        'Error',
                        'Error al eliminar la persona'
                    );
                }
            },
            error: (error: Error) => {
                console.error(error);
                this.alertService.error(
                    'Error',
                    'Error al eliminar la persona'
                );
            },
        });
    }

    guardarCambiosPermisos(): void {
        console.log('Permisos seleccionados:', this.permisosSelec);

        // Eliminamos todos los permisos
        if (this.permisosSelec.length === 0) {
            this.perfilamientoService
                .deletePerfilamientoByRolId(this.data.rol.idRol)
                .subscribe({
                    next: (response) => {
                        if (response.estatus === 'OK') {
                            this.alertService.success(
                                'Permisos actualizados',
                                'Los permisos se han actualizado correctamente'
                            );
                        } else {
                            console.error(
                                'Hubo un error al eliminar los permisos'
                            );
                        }
                    },
                    error: (error) => {
                        console.error(error);
                        this.alertService.error(
                            'Error',
                            'Hubo un error al eliminar los permisos'
                        );
                    },
                
                });
        } else {
            // Eliminamos todos los permisos
            this.perfilamientoService
                .deletePerfilamientoByRolId(this.data.rol.idRol)
                .subscribe({
                    next: (response) => {
                        if (response.estatus === 'OK') {
                            // Agregar los nuevos permisos
                            const agregarObservables = this.permisosSelec.map(
                                (permiso) =>
                                    this.perfilamientoService.createPerfilamiento(
                                        {
                                            idRol: this.data.rol.idRol,
                                            idPermiso: permiso,
                                        }
                                    )
                            );
                            forkJoin(agregarObservables).subscribe({
                                next: (responses) => {
                                    if (
                                        responses.every(
                                            (response) =>
                                                response.estatus === 'OK'
                                        )
                                    ) {
                                        this.alertService.success(
                                            'Permisos actualizados',
                                            'Los permisos se han actualizado correctamente'
                                        );
                                        this.obtenerPermisosSeleccionados();
                                    } else {
                                        console.error(
                                            'Hubo un error al actualizar los permisos'
                                        );
                                    }
                                },
                                error: (error) => {
                                    console.error(error);
                                    this.alertService.error(
                                        'Error',
                                        'Hubo un error al actualizar los permisos'
                                    );
                                },
                            });
                        } else {
                            console.error(
                                'Hubo un error al eliminar los permisos'
                            );
                        }
                    },
                    error: (error) => {
                        console.error(error);
                        this.alertService.error(
                            'Error',
                            'Hubo un error al eliminar los permisos'
                        );
                    },
                });
        }
    }

    // Función para comparar las listas de permisos
    sonListasIguales(lista1: any[], lista2: any[]): boolean {
        if (lista1.length !== lista2.length) {
            return false;
        }

        const ids1 = lista1.map((item) => item.idPermiso).sort();
        const ids2 = lista2.map((item) => item.idPermiso).sort();

        return ids1.every((id, index) => id === ids2[index]);
    }

    asignaRolDefault(idUser) {
        const personal = {
            idRol: 1,
            idUsuario: idUser.idUsuario,
        };
        // console.log(personal);
        this.rolService.asignRoleToUser(personal).subscribe({
            next: (response) => {
                //console.log(response);
                if (response.estatus === 'OK') {
                    // this.alertService.success(
                    //     'Persona asignada',
                    //     'La persona se ha asignado correctamente'
                    // );

                    this.getUsersByRole();
                } else {
                    this.alertService.error(
                        'Error',
                        'Error al asignar la persona'
                    );
                }
            },
            error: (error) => {
                this.alertService.error('Error', 'Error al asignar la persona');
                console.error(error);
            },
        });
    }
}
