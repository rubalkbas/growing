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
import { QuillModule } from 'ngx-quill';
import { TicketsService } from 'app/modules/services/ticket.service';
import { AlertService } from 'app/modules/services/alerts.service';
import { User } from 'app/core/user/user.types';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { ProyectsService } from 'app/modules/services/proyec.service';
import { Proyecto } from 'app/mock-api/common/interfaces/proyects.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface ViewValue {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'app-usuarios-proyectos-modal.',
    templateUrl: './usuarios-proyectos-modal.component.html',
    styleUrls: ['./usuarios-proyectos-modal.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        QuillModule,
        FormsModule,
        MatIconModule,
        MatButtonModule,
    ],
})
export class ModalUsuariosProyectos implements OnInit {
    proyectosForm: FormGroup;
    tiposIncidencia: string[] = [
        'Error',
        'Solicitud de Característica',
        'Mejora',
        'Tarea',
    ];
    personas: ViewValue[] = [];
    prioridades: string[] = ['Baja', 'Media', 'Alta'];
    usuarioLoggeado: any;
    archivos: File[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    asignado: string | null = null;
    estatus: number | null = null;

    constructor(
        public dialogRef: MatDialogRef<ModalUsuariosProyectos>,
        private fb: FormBuilder,
        private ticketService: TicketsService,
        private alertService: AlertService,
        private _userService: UserService,
        private proyectService: ProyectsService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {

        console.log(this.data);

        this.estatus = this.data.proyecto.dto.estatus.toString();
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
            idResponsableProyecto: ['', Validators.required],
        });
    }

    get descripcion() {
        return this.proyectosForm.get('descripcion');
    }

    onClose(): void {
        this.dialogRef.close();
    }

    onSubmit(): void {
        if (this.proyectosForm.valid) {
            const proyecto: Proyecto = {
                nombre: this.proyectosForm.value.nombre,
                descripcion: this.proyectosForm.value.descripcion,
                idResponsableProyecto:
                    this.proyectosForm.value.idResponsableProyecto,
                fecha: this.formatDateTime(new Date()),
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
                        this.uploadFiles(response.dto.idTicket);
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

            this.dialogRef.close(this.proyectosForm.value);
        } else {
            this.proyectosForm.markAllAsTouched();
        }
    }

    onFileChange(event: any): void {
        if (event.target.files.length > 0) {
            for (let i = 0; i < event.target.files.length; i++) {
                this.archivos.push(event.target.files[i]);
            }
            this.proyectosForm.patchValue({
                evidencias: this.archivos,
            });
            this.mostrarArchivos();
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer!.dropEffect = 'copy';
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();

        if (event.dataTransfer!.files.length > 0) {
            for (let i = 0; i < event.dataTransfer!.files.length; i++) {
                this.archivos.push(event.dataTransfer!.files[i]);
            }
            this.proyectosForm.patchValue({
                evidencias: this.archivos,
            });
            this.mostrarArchivos();
        }
    }

    mostrarArchivos(): void {
        //console.log('Archivos cargados:', this.archivos);
    }

    eliminarArchivo(index: number, event: Event): void {
        event.stopPropagation(); // Evitar la propagación del evento
        this.archivos.splice(index, 1);
        this.proyectosForm.patchValue({
            evidencias: this.archivos,
        });
    }

    async uploadFiles(idTicket: number): Promise<void> {
        for (const file of this.archivos) {
            const base64 = await this.convertToBase64(file);
            const fileData = {
                blobArchivo: base64,
                descripcionArchivo: '', // Asigna la descripción si tienes alguna
                extencionArchivo: this.getFileExtension(file),
                fechaCreacion: this.formatDateTime(new Date()),
                idArchivo: 0, // Asigna el id del archivo si tienes alguno
                idTicket: idTicket,
                // idUsuario: this.usuarioLoggeado,
                idUsuario: 1,
                nombreArchivo: file.name,
                tipoArchivo: file.type,
            };

            this.ticketService.uploadFile(fileData).subscribe({
                next: (response) => {
                    //console.log('Archivo subido:', response);
                },
                error: (error) => {
                    //console.error('Error al subir el archivo:', error);
                },
            });
        }
    }

    getFileExtension(file: File): string {
        return file.name.split('.').pop() || '';
    }

    convertToBase64(file: File): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () =>
                resolve((reader.result as string).split(',')[1]);
            reader.onerror = (error) => reject(error);
        });
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

    agregarPersonal() {
        if (this.asignado === null) {
            this.alertService.error(
                'Error',
                'Selecciona una persona para asignar al proyecto'
            );
            return;
        }
        const personal = {
            idProyecto: this.data.proyecto.dto.idProyecto,
            idUsuario: this.asignado,
        };
        // console.log(personal);
        this.proyectService.asignarPersonaProyecto(personal).subscribe({
            next: (response) => {
                //console.log(response);
                if (response.estatus === 'OK') {
                    this.alertService.success(
                        'Persona asignada',
                        'La persona se ha asignado correctamente'
                    );
                    this.consultaPersonalProyecto(
                        this.data.proyecto.dto.idProyecto
                    );
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

    formatIdProyecto(id: number): string {
        let idStr = id.toString();
        const zerosNeeded = 7 - idStr.length;
        const zeros = '0'.repeat(zerosNeeded);
        return `${zeros}${idStr}-IPR`;
    }

    cambiarEstatus() {
        let proyecto: any = {
            descripcion: this.data.proyecto.dto.descripcion,
            estatus: this.estatus,
            idProyecto: this.data.proyecto.dto.idProyecto,
            idResponsableProyecto: {
                idUsuario: this.data.proyecto.dto.idResponsableProyecto.idUsuario,
            },
            nombre: this.data.proyecto.dto.nombre,
        };

        this.proyectService.updateProyecto(proyecto).subscribe({
            next: (respuesta: any) => {
                this.consultaUnProyecto(this.data.proyecto.dto.idProyecto);
                this.alertService.success(
                    'Estatus actualizado',
                    'El estatus del proyecto se ha actualizado correctamente'
                );
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

    consultaPersonalProyecto(id) {
        this.proyectService.consultaPersonasProyecto(id).subscribe({
            next: (respuesta: any) => {
                this.data.personalProyectoDetails = respuesta.lista;
            },
            error: (error: Error) => {
                console.error(error);
            },
        });
    }

    consultaUnProyecto(id) {
        // Unsubscribe from all subscriptions

        //id = 1;
        this.proyectService.consultaUnProyectoPorId(id).subscribe({
            next: (respuesta: any) => {
                this.data.proyecto.dto = respuesta.dto;

                this.consultaPersonalProyecto(id);
            },
            error: (error: Error) => {
                console.error(error);
            },
        });
    }

    borrarPersonal(id) {
        this.proyectService.borrarPersonaProyecto(id).subscribe({
            next: (respuesta: any) => {
                this.consultaPersonalProyecto(this.data.proyecto.dto.idProyecto);
                this.alertService.success(
                    'Persona eliminada',
                    'La persona se ha eliminado correctamente'
                );
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
