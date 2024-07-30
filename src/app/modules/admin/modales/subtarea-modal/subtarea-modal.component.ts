import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
import { User } from 'app/core/user/user.types';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { ProyectsService } from 'app/modules/services/proyec.service';
import { TareaService } from 'app/modules/services/tarea.service';
import { MatDatepickerModule } from '@angular/material/datepicker';


interface ViewValue {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'app-subtarea-modal',
    templateUrl: './subtarea-modal.component.html',
    styleUrls: ['./subtarea-modal.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        QuillModule,
        MatDatepickerModule
    ],
})
export class ModalSubTarea {
    
    subTareaForm: FormGroup;
    tiposIncidencia: string[] = [
        'Error',
        'Solicitud de Característica',
        'Mejora',
        'Tarea',
    ];
    prioridades: ViewValue[] = [];
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

    constructor(
        public dialogRef: MatDialogRef<ModalSubTarea>,
        private fb: FormBuilder,
        private ticketService: TicketsService,
        private alertService: AlertService,
        private _userService: UserService,
        private proyectService: ProyectsService,
        private tareaService: TareaService,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            idProyecto: string;
            idTarea: string;
        }

    ) {
        this._userService.user$
        .pipe((takeUntil(this._unsubscribeAll)))
        .subscribe((user: User) => {
            this.usuarioLoggeado = user.id;
        });

       
        this.tareaService.getPrioridades().subscribe(response => {
            this.prioridades = response.lista.map((prioridad: any) => {
                return {
                    value: prioridad.idPrioridad,
                    viewValue: `${prioridad.nombre} (${prioridad.descripcion})`,
                };
            });
        });
        
        

        this.subTareaForm = this.fb.group({
            titulo: ['', Validators.required],
            descripcion: ['', Validators.required],
            fechaEstimada: ['', Validators.required],
            fechaInicio: ['', Validators.required],
            //fechaFin: ['', Validators.required],
            idEstatusPlantilla: [''],
            idPrioridad: ['', Validators.required],
            idTarea: [''],
            progreso: [''],
        });
    }

  

    onClose(): void {
        this.dialogRef.close();
    }

    onSubmit(): void {
        if (this.subTareaForm.valid) {

            const subTarea: any = {

                titulo: this.subTareaForm.value.titulo ,
                descripcion: this.subTareaForm.value.descripcion,
                fechaEstimada: this.formatDate(this.subTareaForm.value.fechaEstimada),
                fechaInicio: this.formatDate(this.subTareaForm.value.fechaInicio),
                //fechaFin: this.formatDate(this.subTareaForm.value.fechaFin),
                idEstatusPlantilla: 3, //este dato esta en duro
                idPrioridad: this.subTareaForm.value.idPrioridad,
                idTarea: this.data.idTarea, //este dato esta en duro
                progreso: 0,

            };

            this.tareaService.saveSubTarea(subTarea).subscribe({
                next: (response) => {
                    //console.log(response);
                    
                    if(response.estatus === 'OK'){
                        this.alertService.success('Sub-tarea creada', 'La sub-tarea se ha creado correctamente');
                        //this.uploadFiles(response.dto.idTicket);
                    } else {
                        this.alertService.error('Error', 'Error al guardar la sub-tarea');
                    }
                },
                error: (error) => {
                    this.alertService.error('Error', 'Error al guardar la sub-tarea');
                    console.error(error);
                },
            });

            this.dialogRef.close(this.subTareaForm.value);
        } else {
            this.subTareaForm.markAllAsTouched();
        }
    }

    onFileChange(event: any): void {
        if (event.target.files.length > 0) {
            for (let i = 0; i < event.target.files.length; i++) {
                this.archivos.push(event.target.files[i]);
            }
            this.subTareaForm.patchValue({
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
            this.subTareaForm.patchValue({
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
        this.subTareaForm.patchValue({
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
                }
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
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = error => reject(error);
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
}
