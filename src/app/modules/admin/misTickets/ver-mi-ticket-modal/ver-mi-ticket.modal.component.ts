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
import { TicketsService } from 'app/modules/services/ticket.service';
import { AlertService } from 'app/modules/services/alerts.service';
import { Ticket } from 'app/mock-api/common/interfaces/ticket.interface';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RespuestaTicket } from 'app/mock-api/common/interfaces/comments.interface';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';

interface ViewValue {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'app-modal-ver-ticket',
    templateUrl: './ver-mi-ticket.modal.component.html',
    styleUrls: ['./ver-mi-ticket.modal.component.scss'],
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
    ],
})
export class ModalVerMiTicket implements OnInit {
    estatusDisponibles: ViewValue[] = [];
    selectedEstatus: string;
    nuevoComentario: RespuestaTicket = {
        descripcion: '',
        fechaCreacion: '',
        idRespuestaTicket: 0,
        idTicket: this.data.ticket.idTicket,
        idUsuario: this.data.id,
    };
    comments: any[] = [];
    archivos: File[] = [];
    ticketForm: FormGroup;
    usuarioLoggeado: any;
    archivosFiltrados: any[] = [];
    archivosNoFiltrados: any[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        public dialogRef: MatDialogRef<ModalVerMiTicket>,
        private ticketService: TicketsService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private alertService: AlertService,
        private sanitizer: DomSanitizer,
        private fb: FormBuilder,
        private _userService: UserService,
    ) {

        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.usuarioLoggeado = user.id;
                //console.log('Usuario loggeado:', this.usuarioLoggeado);
            });
    }
    

    ngOnInit(): void {

        this.ticketForm = this.fb.group({
            
            evidencias: [null],
        });
        // console.log(this.data);
        this.filtrarArchivosPorUsuario(this.data.id);
        forkJoin([
            this.ticketService.getStatus(),
            this.ticketService.getTicketCommentsByTicketId(
                this.data.ticket.idTicket
            ),
        ]).subscribe(([response, comments]) => {
            if (response.estatus === 'OK') {
                // console.log(response.lista);
                this.estatusDisponibles = response.lista.map((estatus: any) => {
                    return {
                        value: estatus.id_estatus_ticket,
                        viewValue: estatus.estatus,
                    };
                });

                // console.log(this.data.ticket.idEstatusTicket.estatus);

                this.selectedEstatus = this.data.ticket.idEstatusTicket.id_estatus_ticket;
            } else {
                this.alertService.error(
                    'Error',
                    'Hubo un problema al obtener los estatus'
                );
            }

            if (comments.estatus === 'OK') {
                this.comments = comments.lista;
            } else {
                this.alertService.error(
                    'Error',
                    'Hubo un problema al obtener los comentarios'
                );
            }
        });
    }

    filtrarArchivosPorUsuario(idUsuario: number) {
        this.archivosFiltrados = this.data.archivos.filter((archivo: any) => archivo.idUsuario === idUsuario);
        this.archivosNoFiltrados = this.data.archivos.filter((archivo: any) => archivo.idUsuario !== idUsuario);
      }

    formatTicketId(id: number): string {
        return id.toString().padStart(7, '0') + '-ITV';
    }

    onClose(): void {
        this.dialogRef.close(this.data.ticket.idEstatusTicket.estatus);
    }

    cambiarEstatus(nuevoEstatus: any): void {

        // console.log(nuevoEstatus);

        const updatedTicket: Ticket = {
            idTicket: this.data.ticket.idTicket,
            idProyecto: this.data.ticket.idProyecto.idProyecto,
            titulo: this.data.ticket.titulo,
            descripcion: this.data.ticket.descripcion,
            idUsuarioAsignado: this.data.ticket.idUsuarioAsignado.idUsuario,
            idUsuarioSolicitante: this.data.ticket.idUsuarioSolicitante.idUsuario,
            idEstatusTicket: nuevoEstatus.value,
            fechaCreacion: this.data.ticket.fechaCreacion,
            categoria: this.data.ticket.categoria,
            prioridad: this.data.ticket.prioridad,
        };

        // console.log(updatedTicket);

        this.ticketService.updateTicket(updatedTicket).subscribe({
            next: (response) => {
                if (response.estatus === 'OK') {
                    this.alertService.success(
                        'Estatus actualizado',
                        'El estatus del ticket ha sido actualizado correctamente'
                    );

                    const estatusSeleccionado = this.estatusDisponibles.find(
                        (estatus) => estatus.value === nuevoEstatus.value
                    );

                    this.data.ticket.idEstatusTicket.estatus = estatusSeleccionado.viewValue;
                    this.selectedEstatus = nuevoEstatus.value; 
                    // console.log(this.selectedEstatus);
                } else {
                    this.alertService.error(
                        'Error',
                        'Hubo un problema al actualizar el estatus del ticket'
                    );
                }
            },
            error: (error) => {
                this.alertService.error(
                    'Error',
                    'Hubo un problema al actualizar el estatus del ticket'
                );
                // console.error(error);
            },
        });
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

    isImage(extencionArchivo: string): boolean {
        const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'];
        return imageExtensions.includes(extencionArchivo.toLowerCase());
    }

    agregarComentario(): void {
        this.nuevoComentario.fechaCreacion = this.formatDate(new Date());
        this.ticketService.createComment(this.nuevoComentario).subscribe({
            next: (response) => {
                // console.log(response);
                if (response.estatus === 'OK') {
                    this.comments.push(response.dto);
                    this.nuevoComentario.descripcion = '';
                    this.alertService.success(
                        'Comentario agregado',
                        'El comentario ha sido agregado correctamente'
                    );
                } else {
                    this.alertService.error(
                        'Error',
                        'Hubo un problema al agregar el comentario'
                    );
                }
            },
            error: (error) => {
                this.alertService.error(
                    'Error',
                    'Hubo un problema al agregar el comentario'
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
                    this.alertService.success(
                        'Archivo agregado',
                        'El archivo ha sido agregado correctamente'
                    );
                    this.ticketForm.reset();
                    this.archivos = [];
                    
                },
                error: (error) => {
                    console.error('Error al subir el archivo:', error);
                },
            });
        }
    }
    eliminarArchivo(index: number, event: Event): void {
        event.stopPropagation();
        this.archivos.splice(index, 1);
        this.ticketForm.patchValue({
            evidencias: this.archivos,
        });
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

    formatDateTime(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}
