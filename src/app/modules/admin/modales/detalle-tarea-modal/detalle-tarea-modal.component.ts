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
import { QuillModule, QuillModules } from 'ngx-quill';
import { TicketsService } from 'app/modules/services/ticket.service';
import { AlertService } from 'app/modules/services/alerts.service';
//import { User } from 'app/core/user/user.types';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { ProyectsService } from 'app/modules/services/proyec.service';
import { TareaService } from 'app/modules/services/tarea.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { ModalSubTarea } from '../subtarea-modal/subtarea-modal.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
//import { MatSliderChange } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import {MatListModule} from '@angular/material/list';

interface ViewValue {
    value: string;
    viewValue: string;
}
interface User {
    id: number;
    name: string;
    idUsuariosTarea?: number;
}

@Component({
    selector: 'app-detalle-tarea-modal',
    templateUrl: './detalle-tarea-modal.component.html',
    styleUrls: ['./detalle-tarea-modal.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        QuillModule,
        MatDatepickerModule,
        MatTabsModule,
        MatIconModule,
        MatSliderModule,
        MatTableModule,
        FormsModule,
        MatProgressBarModule,
        MatListModule,
        
    ],
})
export class ModalDetalleTarea implements OnInit {
    users: User[] = [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
        { id: 3, name: 'User 3' },
        { id: 4, name: 'User 4' },
    ];

    assignedUsers: User[] = [];

    tareaForm: FormGroup;
    tiposIncidencia: string[] = [
        'Error',
        'Solicitud de Característica',
        'Mejora',
        'Tarea',
    ];
    prioridades: ViewValue[] = [];
    usuarioLoggeado: any;
    tarea: any = {};
    archivos: File[] = [];
    archivosGuardar: any[] = [];
    //progreso: number = 0; // Inicializa el progreso
    subtarea: any[] = [];

    personas: User[] = [];

    idTarea = 5;

    disabled = false;
    max = 100;
    min = 0;
    showTicks = false;
    step = 1;
    thumbLabel = false;
    progreso = 0;

    idProyecto = 12;
    detallesTareas: any[] = [];
    nuevaTarea = '';

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    displayedColumns: string[] = ['position', 'name'];
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

    constructor(
        public dialogRef: MatDialogRef<ModalDetalleTarea>,
        private fb: FormBuilder,
        private tareaService: TareaService,
        private alertService: AlertService,
        private _userService: UserService,
        public dialog: MatDialog,
        private proyectService: ProyectsService,
        private sanitizer: DomSanitizer,
        private ticketService: TicketsService,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            idProyecto: string;
            idTarea: string;
        }
    ) { }

    ngOnInit(): void {
        // this._userService.user$
        //     .pipe((takeUntil(this._unsubscribeAll)))
        //     .subscribe((user: User) => {
        //         this.usuarioLoggeado = user.id;
        //     });

        this.tareaService.getPrioridades().subscribe((response) => {
            this.prioridades = response.lista.map((prioridad: any) => {
                return {
                    value: prioridad.idPrioridad,
                    viewValue: `${prioridad.nombre} (${prioridad.descripcion})`,
                };
            });
        });

        this.tareaForm = this.fb.group({
            titulo: ['', Validators.required],
            descripcion: ['', Validators.required],
            fechaEstimada: ['', Validators.required],
            fechaInicio: ['', Validators.required],
            //fechaFin: ['', Validators.required],
            idEstatusPlantilla: [''],
            idPrioridad: ['', Validators.required],
            idProyecto: [''],
            progreso: [''],
        });

        this.getUsersAssigned();
        this.traerTareaPorId(this.data.idTarea);
        this.traerArchivosTarea(this.data.idTarea);
        this.traerSubTarea(this.data.idTarea);
        this.obtieneDetallesTareas();
    }

    get availableUsers(): User[] {
        return this.personas.filter(
            (user) => !this.assignedUsers.includes(user)
        );
    }

    getUsersAssigned() {
        this.tareaService.getUserTasks(this.data.idTarea).subscribe({
            next: (response) => {
                if (response.estatus === 'OK') {
                    this.ticketService.getAllUsers().subscribe((users) => {

                        console.log(
                            'Respuesta de usuarios asignados: ',
                            response
                        );
                        // Usuarios asignados a la tarea
                        this.assignedUsers = response.lista.map((user: any) => {
                            return {
                                id: user.idUsuario.idUsuario,
                                name: `${user.idUsuario.nombre} (${user.idUsuario.puesto})`,
                                idUsuariosTarea: user.idUsuariosTarea,
                            };
                        });

                        // Todos los usuarios, pero eliminando los que ya están asignados a la tarea
                        this.personas = users.lista.map((user: any) => {
                            return {
                                id: user.idUsuario,
                                name: `${user.nombre} (${user.puesto})`,
                            };
                        }).filter((user) => {
                            return !this.assignedUsers.some(
                                (assignedUser) => assignedUser.id === user.id
                            )
                        });
                    });

                    console.log('Usuarios asignados: ', this.assignedUsers);
                } else {
                    this.alertService.error(
                        'Error',
                        'Error al obtener los usuarios asignados'
                    );
                }
            },
            error: (error) => {
                this.alertService.error(
                    'Error',
                    'Error al obtener los usuarios asignados'
                );
                console.error(error);
            },
        });
    }

    addUser(idUser: any): void {
        const request = {
            idTarea: this.data.idTarea,
            idUsuario: idUser,
        };

        this.tareaService.saveUserTask(request).subscribe({
            next: (response) => {
                if (response.estatus === 'OK') {
                    console.log(
                        'Respuesta de asignación de usuario: ',
                        response
                    );
                    //const user = this.personas.find((u) => u.id === idUser);
                    const user: User = {
                        id: response.dto.idUsuario.idUsuario,
                        name: `${response.dto.idUsuario.nombre} (${response.dto.idUsuario.puesto})`,
                        idUsuariosTarea: response.dto.idUsuariosTarea,
                    };

                    this.assignedUsers.push(user);
                    this.personas = this.personas.filter(
                        (u) => u.id !== idUser
                    );
                } else {
                    this.alertService.error(
                        'Error',
                        'Error al asignar el usuario'
                    );
                }
            },
            error: (error) => {
                this.alertService.error('Error', 'Error al asignar el usuario');
                console.error(error);
            },
        });
    }

    removeUser(user: User): void {
        console.log('Usuario a eliminar: ', user);

        this.tareaService.deleteUserTask(user.idUsuariosTarea).subscribe({
            next: (response) => {
                if (response.estatus === 'OK') {
                    this.assignedUsers = this.assignedUsers.filter(
                        (u) => u.id !== user.id
                    );
                    this.personas.push(user);
                } else {
                    this.alertService.error(
                        'Error',
                        'Error al eliminar el usuario'
                    );
                }
            },
            error: (error) => {
                this.alertService.error(
                    'Error',
                    'Error al eliminar el usuario'
                );
                console.error(error);
            },
        });
    }

    getInitials(name: string): string {
        const nombre = name.split('(')[0].trim();
        return nombre
            .split(' ')
            .map((n) => n[0])
            .join('');
    }

    getColor(user: any): string {
        // Puedes personalizar los colores según tu preferencia
        const colors = [
            '#FF5733',
            '#33FF57',
            '#3357FF',
            '#FF33A6',
            '#A633FF',
            '#FF8633',
        ];
        const index = this.assignedUsers.indexOf(user) % colors.length;
        return colors[index];
    }

    editarProgresoTarea(id, progreso) {
        this.tareaService.editarProgresoTarea(id, progreso).subscribe({
            next: (respuesta: any) => {
                //console.log('Respuesta completa: ', respuesta);
                // Accediendo a la lista de areas de atención dentro de la respuesta
                if (respuesta.estatus === 'OK') {
                    this.tarea = {};
                    this.traerTareaPorId(this.data.idTarea);
                    this.updateProgresoProyecto();
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
    }

    traerSubTarea(id) {
        this.tareaService.getSubtareaPorTarea(id).subscribe({
            next: (respuesta: any) => {
                console.log('Respuesta completa de subtarea: ', respuesta);
                // Accediendo a la lista de areas de atención dentro de la respuesta
                if (respuesta.estatus === 'OK') {
                    this.subtarea = respuesta.lista;
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
    }

    traerArchivosTarea(id) {
        this.tareaService.getArchivosPorIdTarea(id).subscribe({
            next: (respuesta: any) => {
                //console.log('Respuesta completa: ', respuesta);
                // Accediendo a la lista de areas de atención dentro de la respuesta
                if (respuesta.estatus === 'OK') {
                    this.archivosGuardar = respuesta.dto;
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
    }

    traerTareaPorId(id) {
        this.tareaService.getTareaPorId(id).subscribe({
            next: (respuesta: any) => {
                //console.log('Respuesta completa: ', respuesta);
                // Accediendo a la lista de areas de atención dentro de la respuesta
                if (respuesta.estatus === 'OK') {
                    this.tarea = respuesta.dto;
                    this.progreso = this.tarea.progreso;
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
    }

    isImage(extencionArchivo: string): boolean {
        const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'];
        return imageExtensions.includes(extencionArchivo.toLowerCase());
    }

    getBlobUrl(base64Data: string, contentType: string): SafeUrl {
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    onClose(): void {
        this.dialogRef.close();
    }

    onSubmit(): void {
        if (this.tareaForm.valid) {
            const tarea: any = {
                titulo: this.tareaForm.value.titulo,
                descripcion: this.tareaForm.value.descripcion,
                fechaEstimada: this.formatDate(
                    this.tareaForm.value.fechaEstimada
                ),
                fechaInicio: this.formatDate(this.tareaForm.value.fechaInicio),
                //fechaFin: this.formatDate(this.tareaForm.value.fechaFin),
                idEstatusPlantilla: 3, //este dato esta en duro
                idPrioridad: this.tareaForm.value.idPrioridad,
                idProyecto: this.data.idProyecto,
                progreso: 0,
            };

            this.tareaService.saveTarea(tarea).subscribe({
                next: (response) => {
                    //console.log(response);

                    if (response.estatus === 'OK') {
                        this.alertService.success(
                            'Tarea creada',
                            'La tarea se ha creado correctamente'
                        );
                        //this.uploadFiles(response.dto.idTicket);
                    } else {
                        this.alertService.error(
                            'Error',
                            'Error al guardar la tarea'
                        );
                    }
                },
                error: (error) => {
                    this.alertService.error(
                        'Error',
                        'Error al guardar la tarea'
                    );
                    console.error(error);
                },
            });

            this.dialogRef.close(this.tareaForm.value);
        } else {
            //this.tareaForm.markAllAsTouched();
        }
    }

    onFileChange(event: any): void {
        if (event.target.files.length > 0) {
            for (let i = 0; i < event.target.files.length; i++) {
                this.archivos.push(event.target.files[i]);
            }
            this.tareaForm.patchValue({
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
            this.tareaForm.patchValue({
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
        this.tareaForm.patchValue({
            evidencias: this.archivos,
        });
    }

    async uploadFiles(idTarea: number): Promise<void> {
        for (const file of this.archivos) {
            const base64 = await this.convertToBase64(file);
            const fileData = {
                blobArchivo: base64,
                descripcionArchivo: '', // Asigna la descripción si tienes alguna
                extencionArchivo: this.getFileExtension(file),
                fechaCreacion: this.formatDateTime(new Date()),
                idArchivoTarea: 0, // Asigna el id del archivo si tienes alguno
                idTarea: idTarea,
                // idUsuario: this.usuarioLoggeado,
                idUsuario: 1,
                nombreArchivo: file.name,
                tipoArchivo: file.type,
            };

            this.tareaService.uploadFile(fileData).subscribe({
                next: (response) => {
                    this.alertService.success(
                        'Archivo agregado',
                        'El archivo ha sido agregado correctamente'
                    );
                    this.archivos = [];
                    this.archivosGuardar = [];
                    this.traerArchivosTarea(this.data.idTarea);
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
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses son indexados desde 0
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    formatDate(dateString: string): string {
        // Crear un objeto Date a partir del string
        const date = new Date(dateString);

        // Obtener los componentes de la fecha
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Meses empiezan desde 0
        const day = ('0' + date.getDate()).slice(-2);

        // Formatear la fecha en el nuevo formato
        return `${year}-${month}-${day}`;
    }

    openSubtarea(): void {
        const dialogRef = this.dialog.open(ModalSubTarea, {
            width: '750px',
            data: {
                // idEstatusPlantilla: platilla.idEstatusPlantilla,
                idProyecto: this.data.idProyecto,
                idTarea: this.data.idTarea
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            //this.consultaProyectos();
            this.subtarea = [];
            this.traerSubTarea(this.data.idTarea);
        });
    }

    formatLabel(value: number): string {
        if (value >= 100) {
            return Math.round(value) + '%';
        }

        return `${value}`;
    }

    onSliderChange(progreso: any) {
        console.log('Slider soltado:', progreso);
        this.editarProgresoTarea(this.data.idTarea, progreso);
    }


    addItem() {
        if (this.nuevaTarea.trim()) {
            let subTarea = {
                idTarea: this.data.idTarea,
                descripcion: this.nuevaTarea
            };
            console.log('Subtarea:', subTarea);
            this.tareaService.crearDetalleTareas(subTarea).subscribe({
                next: (response) => {
                    if (response.estatus === 'OK') {
                        this.obtieneDetallesTareas();
                        this.nuevaTarea = '';
                    } else {
                        console.log(
                            'La respuesta no contiene una lista válida de detalles de tareas.'
                        );
                    }
                },
                error: (error) => {
                    console.error(error);
                },
            });
        }
    }

    removeItem(index: number) {
        let detalleTarea = this.detallesTareas[index];
        this.tareaService.eliminaDetalleTareas(detalleTarea.idDetallesTarea).subscribe({
            next: (response) => {
                if (response.estatus === 'OK') {
                    this.obtieneDetallesTareas();
                } else {
                    console.log(
                        'La respuesta no contiene una lista válida de detalles de tareas.'
                    );
                }
            },
            error: (error) => {
                console.error(error);
            },
        });

    }

    updateProgresoProyecto() {
        let proyectoActualizado = {
            idProyecto: this.data.idProyecto
        };
        this.proyectService.putProyectsProgreso(proyectoActualizado).subscribe({
            next: (response) => {
                console.log('Respuesta de actualización de progreso:', response);
                this.obtieneDetallesTareas();
            },
            error: (error) => {
                console.error('Error al actualizar el progreso:', error);
            },
        });
    }

    obtieneDetallesTareas() {
        this.tareaService.getDetalleTareas(this.data.idTarea).subscribe({
            next: (response) => {
                if (response.estatus === 'OK') {
                    this.detallesTareas = response.lista;
                } else {
                    console.log(
                        'La respuesta no contiene una lista válida de detalles de tareas.'
                    );
                }
            },
            error: (error) => {
                console.error(error);
            },
        });
    }

    
}
