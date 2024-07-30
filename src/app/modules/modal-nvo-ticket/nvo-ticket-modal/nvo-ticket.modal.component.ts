import { AreaAtencionUsuariosService } from './../../services/area-atencion-usuarios.service';
import { Component, Inject, OnInit } from '@angular/core';
import {
    MAT_DIALOG_DATA,
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
import { QuillModule, QuillModules } from 'ngx-quill';
import { TicketsService } from 'app/modules/services/ticket.service';
import { AlertService } from 'app/modules/services/alerts.service';
import { Ticket } from 'app/mock-api/common/interfaces/ticket.interface';
import { User } from 'app/core/user/user.types';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { ProyectsService } from 'app/modules/services/proyec.service';

interface ViewValue {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'app-modal-ticket',
    templateUrl: './nvo-ticket.modal.component.html',
    styleUrls: ['./nvo-ticket.modal.component.scss'],
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
export class ModalNewTicket implements OnInit {
    ticketForm: FormGroup;
    tiposIncidencia: string[] = [
        'Error',
        'Solicitud de Característica',
        'Mejora',
        'Tarea',
    ];
    personas: ViewValue[] = [];
    proyectos: ViewValue[] = [];
    prioridades: string[] = ['Baja', 'Media', 'Alta'];
    usuarioLoggeado: any;
    archivos: File[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    quillConfig: QuillModules = {
        toolbar: {
            container: [
                ['bold', 'italic', 'underline', 'strike'],
                ['code-block'],
                [{ header: 1 }, { header: 2 }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ script: 'sub' }, { script: 'super' }],
                [{ indent: '-1' }, { indent: '+1' }],
                [{ direction: 'rtl' }],
                [{ size: [] }],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ color: [] }, { background: [] }],
                [{ font: [] }],
                [{ align: [] }],
                ['clean'],
                ['link', 'image', 'video'],
            ],
        },
    };
    newTicket: any;
    times: { value: any; viewValue: any }[];

    constructor(
        public dialogRef: MatDialogRef<ModalNewTicket>,
        private fb: FormBuilder,
        private ticketService: TicketsService,
        private alertService: AlertService,
        private _userService: UserService,
        private proyectService: ProyectsService,
        private areaAtencionUsuariosService: AreaAtencionUsuariosService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        console.log('Data:', this.data);

        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.usuarioLoggeado = user.id;
                //console.log('Usuario loggeado:', this.usuarioLoggeado);
            });

        // this.proyectService.getProyects().subscribe({
        //     next: (response) => {
        //         this.proyectos = response.lista.map((proyect: any) => {
        //             return {
        //                 value: proyect.idProyecto,
        //                 viewValue: proyect.nombre,
        //             };
        //         });
        //     },
        //     error: (error) => {
        //         console.error('Error al cargar los proyectos:', error);
        //     },
        // });

        forkJoin([
            this.ticketService.getAttentionTime(),
            this.proyectService.getProyects(),
        ]).subscribe(([response, proyects]) => {
            this.times = response.lista.map((time: any) => {
                return {
                    value: time.idTiempoAtencionSla,
                    viewValue: time.diasTiempoAtencion,
                };
            });

            this.proyectos = proyects.lista.map((proyect: any) => {
                return {
                    value: proyect.idProyecto,
                    viewValue: proyect.nombre,
                };
            });
        });

        this.ticketForm = this.fb.group({
            proyecto: ['', Validators.required],
            tipoIncidencia: ['', Validators.required],
            titulo: ['', Validators.required],
            descripcion: ['', Validators.required],
            asignado: [{ value: '', disabled: true }, Validators.required],
            areaAtencion: ['', Validators.required],
            tiemposAtencion: ['', Validators.required],
            evidencias: [null],
        });
    }

    get descripcion() {
        return this.ticketForm.get('descripcion');
    }

    onAreaAtencionChange(event: any): void {
        const idAreaAtencion = event.value;
        console.log(
            'El valor de área de atención ha cambiado:',
            idAreaAtencion
        );
        this.cargarPersonas(idAreaAtencion);

        const asignadoControl = this.ticketForm.get('asignado');

        if (idAreaAtencion) {
            asignadoControl.enable();
        } else {
            asignadoControl.disable();
        }
    }

    cargarPersonas(idAreaAtencion: number): void {
        this.areaAtencionUsuariosService
            .getAreaAtencionUsuarioById(idAreaAtencion)
            .subscribe({
                next: (response) => {
                    this.personas = response.lista.map((user: any) => {
                        return {
                            value: user.idUsuario.idUsuario,
                            viewValue: `${user.idUsuario.nombre} (${user.idUsuario.idRol.nombreRol})`,
                        };
                    });
                },
                error: (error) => {
                    console.error('Error al cargar las personas:', error);
                },
            });
    }

    onClose(): void {
        this.dialogRef.close(this.newTicket);
    }

    onSubmit(): void {
        if (this.ticketForm.valid) {
            const ticket: Ticket = {
                idProyecto: this.ticketForm.get('proyecto')?.value,
                titulo: this.ticketForm.get('titulo')?.value,
                descripcion: this.ticketForm.get('descripcion')?.value,
                idUsuarioAsignado: this.ticketForm.get('asignado')?.value,
                idUsuarioSolicitante: this.usuarioLoggeado,
                idEstatusTicket: 1,
                fechaCreacion: this.formatDate(new Date()),
                categoria: this.ticketForm.get('tipoIncidencia')?.value,
                idTiempoAtencion: this.ticketForm.get('tiemposAtencion')?.value,
                idAreaAtencion: this.ticketForm.get('areaAtencion')?.value,
                // prioridad: this.ticketForm.get('prioridad')?.value,
            };

            this.ticketService.createTicket(ticket).subscribe({
                next: (response) => {
                    //console.log(response);

                    if (response.estatus === 'OK') {
                        this.alertService.success(
                            'Ticket creado',
                            'El ticket se ha creado correctamente'
                        );
                        this.uploadFiles(response.dto.idTicket);
                        this.ticketForm.reset();
                        this.archivos = [];
                        //console.log('Ticket creado:', response.dto);
                        this.newTicket = response.dto;
                    } else {
                        this.alertService.error(
                            'Error',
                            'Error al guardar el ticket'
                        );
                    }
                },
                error: (error) => {
                    this.alertService.error(
                        'Error',
                        'Error al guardar el ticket'
                    );
                    console.error(error);
                },
            });

            this.dialogRef.close(this.ticketForm.value);
        } else {
            this.ticketForm.markAllAsTouched();
        }
    }

    onFileChange(event: any): void {
        if (event.target.files.length > 0) {
            for (let i = 0; i < event.target.files.length; i++) {
                this.archivos.push(event.target.files[i]);
            }
            this.ticketForm.patchValue({
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
            this.ticketForm.patchValue({
                evidencias: this.archivos,
            });
            this.mostrarArchivos();
        }
    }

    mostrarArchivos(): void {
        //console.log('Archivos cargados:', this.archivos);
    }

    eliminarArchivo(index: number, event: Event): void {
        event.stopPropagation();
        this.archivos.splice(index, 1);
        this.ticketForm.patchValue({
            evidencias: this.archivos,
        });
    }

    async uploadFiles(idTicket: number): Promise<void> {
        for (const file of this.archivos) {
            const base64 = await this.convertToBase64(file);
            const fileData = {
                blobArchivo: base64,
                descripcionArchivo: '',
                extencionArchivo: this.getFileExtension(file),
                fechaCreacion: this.formatDateTime(new Date()),
                idArchivo: 0,
                idTicket: idTicket,
                idUsuario: this.usuarioLoggeado,
                nombreArchivo: file.name,
                tipoArchivo: file.type,
            };

            this.ticketService.uploadFile(fileData).subscribe({
                next: (response) => {
                    //console.log('Archivo subido:', response);
                },
                error: (error) => {
                    console.error('Error al subir el archivo:', error);
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
