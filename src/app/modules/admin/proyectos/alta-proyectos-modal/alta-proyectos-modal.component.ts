import { Component, Inject, OnInit } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
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
import { TicketsService } from 'app/modules/services/ticket.service';
import { AlertService } from 'app/modules/services/alerts.service';
import { User } from 'app/core/user/user.types';
import { Subject, takeUntil, filter } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { ProyectsService } from 'app/modules/services/proyec.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ModalPlantillasProyectos } from '../plantilla-proyecto-modal/plantilla-proyecto-modal.component';

interface ViewValue {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'app-alta-proyectos-modal',
    templateUrl: './alta-proyectos-modal.component.html',
    styleUrls: ['./alta-proyectos-modal.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatIconModule,
        MatDatepickerModule,
    ],
})
export class ModalAltaProyectos implements OnInit {
    proyectosForm: FormGroup;
    personas: ViewValue[] = [];
    usuarioLoggeado: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    plantillas: any[] = [];

    constructor(
        public dialogRef: MatDialogRef<ModalAltaProyectos>,
        private fb: FormBuilder,
        public dialog: MatDialog,
        private ticketService: TicketsService,
        private alertService: AlertService,
        private _userService: UserService,
        private proyectService: ProyectsService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        console.log(this.data);
        this.plantillas = this.data.plantillas;
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.usuarioLoggeado = user.id;
            });

        this.ticketService.getAllUsers().subscribe((response) => {
            this.personas = response.lista.map((user: any) => {
                return {
                    value: user.idUsuario,
                    viewValue: `${user.nombre} (${user.puesto})`,
                };
            });
        });

        this.proyectosForm = this.fb.group({
            nombre: ['', Validators.required],
            descripcion: ['', Validators.required],
            fechaInicio: ['', Validators.required],
            fechaFinEstimada: ['', Validators.required],
            idResponsableProyecto: ['', Validators.required],
            plantilla: ['', Validators.required],
        });
    }

    get descripcion() {
        return this.proyectosForm.get('descripcion');
    }

    openCrearPlantilla(): void {
        const dialogRef = this.dialog.open(ModalPlantillasProyectos, {
            width: '750px',
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result: any[]) => {
            if (result) {
                // Limpiamos this.plantillas
                this.plantillas = [];
                // Volvemos a cargar las plantillas

                this.plantillas = result.map((plantilla: any) => {
                    return {
                        idPlantilla: plantilla.value,
                        nombre: plantilla.viewValue,
                    };
                });

                this.proyectosForm
                    .get('plantilla')
                    ?.setValue(
                        this.plantillas[this.plantillas.length - 1].value
                    );
            }
        });
    }

    onClose(): void {
        this.dialogRef.close();
    }

    onSubmit(): void {
        if (this.proyectosForm.valid) {

            // Revisamos que la fecha de inicio sea menor o igual a la fecha de fin estimada
            if (new Date(this.proyectosForm.value.fechaInicio) > new Date(this.proyectosForm.value.fechaFinEstimada)) {
                this.alertService.error(
                    'Error',
                    'La fecha de inicio no puede ser mayor a la fecha de fin estimada'
                );
                return;
            } else {
                
                const proyecto: any = {
                    nombre: this.proyectosForm.value.nombre,
                    descripcion: this.proyectosForm.value.descripcion,
                    idResponsableProyecto: {
                        idUsuario: this.proyectosForm.value.idResponsableProyecto,
                    },
                    idPlantilla: {
                        idPlantilla: this.proyectosForm.value.plantilla,
                    },
                    fecha: this.formatDateTime(new Date()),
                    fechaInicio: this.formatDateTime(new Date(this.proyectosForm.value.fechaInicio)),
                    fechaEstimada: this.formatDateTime(new Date(this.proyectosForm.value.fechaFinEstimada)),
                    progreso: 0,
                    estatus: 1,
                };
    
                this.proyectService.createProyecto(proyecto).subscribe({
                    next: (response) => {
                        //console.log(response);
    
                        if (response.estatus === 'OK') {
                            this.alertService.success(
                                'Proyecto creado',
                                'El Proyecto se ha creado correctamente'
                            );
                            //this.uploadFiles(response.dto.idTicket);
                        } else {
                            this.alertService.error(
                                'Error',
                                'Error al guardar el proyecto'
                            );
                        }
                    },
                    error: (error) => {
                        this.alertService.error(
                            'Error',
                            'Error al guardar el proyecto'
                        );
                        console.error(error);
                    },
                });
            }

            this.dialogRef.close(this.proyectosForm.value);
        } else {
            this.proyectosForm.markAllAsTouched();
        }
    }

    formatDateTime(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses son indexados desde 0
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses son indexados desde 0
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
}
