import { Component, Inject, OnInit } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { QuillModule } from 'ngx-quill';
import { AlertService } from 'app/modules/services/alerts.service';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { AreaAtencionService } from 'app/modules/services/areaAtencion.service';
import { TicketsService } from 'app/modules/services/ticket.service';
import { MatIconModule } from '@angular/material/icon';

interface ViewValue {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'detalle-area-atencion',
    templateUrl: './detalle-area-atencion.modal.component.html',
    styleUrls: ['./detalle-area-atencion.modal.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        FormsModule,
        QuillModule,
        MatIconModule
    ],
})
export class ModalVerArea implements OnInit {
    usuarioLoggeado: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    personas: ViewValue[] = [];
    asignado: string | null = null;
    usuariosAsignados: any[] = [];
    constructor(
        public dialogRef: MatDialogRef<ModalVerArea>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private alertService: AlertService,
        private _userService: UserService,
        private areaAtencionService: AreaAtencionService,
        private ticketService: TicketsService,
    ) {

        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.usuarioLoggeado = user.id;
                //console.log('Usuario loggeado:', this.usuarioLoggeado);
            });
    }

    ngOnInit(): void { 
        // console.log(this.data);
        //console.log('esta es la data   ', this.data);
        this.getUsersByArea();
    }
    formatTicketId(id: number): string {
        return id.toString().padStart(7, '0') + '-AAT';
    }

    onClose(): void {
        this.dialogRef.close();
    }

    cambiarEstatus(id){
        this.areaAtencionService.cambiarEstatusArea(id).subscribe({
            next: (response) => {
                if (response.estatus === 'OK') {
                    this.alertService.success(
                        'Estatus actualizado',
                        'El estatus del area ha sido actualizado correctamente'
                    );

                    this.onClose();
                } else {
                    this.alertService.error(
                        'Error',
                        'Hubo un problema al actualizar el estatus del area'
                    );
                }
            },
            error: (error) => {
                this.alertService.error(
                    'Error',
                    'Hubo un problema al actualizar el estatus del area'
                );
                // console.error(error);
            },
        });
    }

   

    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
   

    formatDateTime(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
            idAreaAtencion: this.data.area.idAreaAtencion,
            idUsuario: this.asignado,
        };
        // console.log(personal);
        this.areaAtencionService.asignAreaToUser(personal).subscribe({
            next: (response) => {
                //console.log(response);
                if (response.estatus === 'OK') {
                    this.alertService.success(
                        'Persona asignada',
                        'La persona se ha asignado correctamente'
                    );

                    this.getUsersByArea();
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

    getUsersByArea() {
        this.usuariosAsignados = []
        forkJoin([
            this.areaAtencionService.getUsersByArea(this.data.area.idAreaAtencion),
            this.ticketService.getAllUsers(),
        ]).subscribe(([response, users]) => {
            this.usuariosAsignados = response.lista;
    
            console.log('esta es la lista de usuarios', this.usuariosAsignados);
    
            // Si no hay usuarios asignados, se muestran todos los usuarios
            if (this.usuariosAsignados === null) {
                this.personas = users.lista.map((user: any) => {
                    return {
                        value: user.idUsuario,
                        viewValue: `${user.nombre} (${user.idRol.nombreRol})`,
                    };
                });
            } else {
                // Se filtran los usuarios que no estén asignados
                console.log('esta es la lista ', users.lista)
                this.personas = users.lista
                    .map((user: any) => {
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
        // const idUsuario = {
        //     idUsuario: id,
        // };

        this.areaAtencionService.deleteAreaFromUser(id).subscribe({
            next: (respuesta: any) => {
                if (respuesta.estatus === 'OK') {
                    this.alertService.success(
                        'Persona eliminada',
                        'La persona se ha eliminado correctamente'
                    );
                    
                    this.getUsersByArea();
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
    

}
