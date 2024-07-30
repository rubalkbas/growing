import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { QuillModule, QuillModules } from 'ngx-quill';
import { TicketsService } from 'app/modules/services/ticket.service';
import { AlertService } from 'app/modules/services/alerts.service';
import { Ticket } from 'app/mock-api/common/interfaces/ticket.interface';
import { User } from 'app/core/user/user.types';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { ProyectsService } from 'app/modules/services/proyec.service';
import { AreaAtencionService } from 'app/modules/services/areaAtencion.service';

interface ViewValue {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'app-nvo-area-atencion',
    templateUrl: './nvo-area-atencion.modal.component.html',
    styleUrls: ['./nvo-area-atencion.modal.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        QuillModule,
    ],
})
export class ModalNewAreaAtencion {
    areaAtencionForm: FormGroup;
    tiposIncidencia: string[] = [
        'Error',
        'Solicitud de Característica',
        'Mejora',
        'Tarea',
    ];
    usuarios: ViewValue[] = [];
    prioridades: string[] = ['Baja', 'Media', 'Alta'];
    usuarioLoggeado: any;
    archivos: File[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    newTicket: any;

    constructor(
        public dialogRef: MatDialogRef<ModalNewAreaAtencion>,
        private fb: FormBuilder,
        private areaAtencionService: AreaAtencionService,
        private alertService: AlertService,
        private _userService: UserService,
        private ticketsService: TicketsService
    ) {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.usuarioLoggeado = user.id;
                //console.log('Usuario loggeado:', this.usuarioLoggeado);
            });

        forkJoin([
            this.ticketsService.getAllUsers(),
        ]).subscribe(([usuarios]) => {

            this.usuarios = usuarios.lista.map((usuario: any) => {
                return {
                    value: usuario.idUsuario,
                    viewValue: usuario.nombre,
                };
            });

        });


        this.areaAtencionForm = this.fb.group({
            nombreAreaAtencion: ['', Validators.required],
            descripcionAreaAtencion: ['', Validators.required],
            idUsuarioResponsable: ['', Validators.required],
            correoAreaAtencion: ['', [Validators.required, Validators.email]],
        });
    }

    onClose(): void {
        this.dialogRef.close(this.newTicket);
    }

    onSubmit(): void {
        if (this.areaAtencionForm.valid) {
            const areaNueva = {
                nombreAreaAtencion: this.areaAtencionForm.get('nombreAreaAtencion')?.value,
                descripcionAreaAtencion: this.areaAtencionForm.get('descripcionAreaAtencion')?.value,
                estatus: 1,
                fechaCreacion: this.formatDate(new Date()),
                idUsuarioResponsable: this.areaAtencionForm.get('idUsuarioResponsable')?.value,
                correoAreaAtencion: this.areaAtencionForm.get('correoAreaAtencion')?.value,
            };

            this.areaAtencionService.createAreaAtencion(areaNueva).subscribe({
                next: (response) => {
                    //console.log(response);

                    if (response.estatus === 'OK') {
                        this.alertService.success(
                            'Area de Atención Creada',
                            'Area de Atención se ha creado correctamente'
                        );
                        this.areaAtencionForm.reset();
                        //console.log('Ticket creado:', response.dto);
                        this.newTicket = response.dto;
                    } else {
                        this.alertService.error(
                            'Error',
                            'Error al guardar el Area de Atención'
                        );
                    }
                },
                error: (error) => {
                    this.alertService.error(
                        'Error',
                        'Error al guardar el Area de Atención'
                    );
                    console.error(error);
                },
            });

            this.dialogRef.close(this.areaAtencionForm.value);
        } else {
            this.areaAtencionForm.markAllAsTouched();
        }
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

    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
}
