import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AlertService } from 'app/modules/services/alerts.service';
import { PlantillaService } from 'app/modules/services/plantilla.service';
import { MatIconModule } from '@angular/material/icon';
import {
    CdkDragDrop,
    DragDropModule,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ThemePalette } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';

interface ViewValue {
    value: string;
    viewValue: string;
}

interface Estado {
    nombre: string;
    fase: string;
    color: string;
    idPlantilla: number;
    idEstatusPlantilla?: number;
    plantilla?: any;
}

@Component({
    selector: 'app-plantilla-proyecto-modal',
    templateUrl: './plantilla-proyecto-modal.component.html',
    styleUrls: ['./plantilla-proyecto-modal.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatIconModule,
        DragDropModule,
        MatMenuModule,
    ],
})
export class ModalPlantillasProyectos implements OnInit, AfterViewInit {
    @ViewChildren('estadoNombreInput')
    estadoNombreInputs: QueryList<ElementRef>;
    proyectosForm: FormGroup;
    plantillas: ViewValue[] = [];
    estados: any[] = [];
    estadosEnProceso = [];
    estadosCompletadas = [];
    estadosFinalizado = [];
    isAddingEstadoEnProceso = false;
    isAddingEstadoCompletadas = false;
    isAddingEstadoFinalizado = false;
    newEstadoEnProceso = '';
    newEstadoCompletadas = '';
    newEstadoFinalizado = '';
    selectedPlantilla: any;
    colorSeleccionado: string;
    mostrarSelectorColorCompleto = false;
    colorCtr: AbstractControl = new FormControl(null);
    public disabled = false;
    public color: ThemePalette = 'primary';
    public touchUi = false;
    selectedColor: string = '#FFFFFF';
    tempColor: string = this.selectedColor;
    nuevoNombre = '';
    editarNombre = false;
    editarNombre2 = false;
    editarNombre3 = false;

    colores = [
        '#FF6F61', // Soft Red
        '#F7CAC9', // Light Pink
        '#92A8D1', // Light Blue
        '#034F84', // Dark Blue
        '#F7786B', // Coral
        '#DE7A22', // Orange
        '#4A4A4A', // Dark Gray
        '#6B5B95', // Purple
        '#88B04B', // Green
        '#FFA07A', // Light Salmon
        '#FFD700', // Gold
        '#20B2AA', // Light Sea Green
        '#FF69B4', // Hot Pink
        '#8A2BE2', // Blue Violet
        '#FFFFFF', // White
    ];

    estadoActual: any;
    mostrarSelector = false;

    public options = [
        { value: true, label: 'True' },
        { value: false, label: 'False' },
    ];

    constructor(
        public dialogRef: MatDialogRef<ModalPlantillasProyectos>,
        private fb: FormBuilder,
        private alertService: AlertService,
        private plantillaService: PlantillaService
    ) {}

    ngAfterViewInit(): void { }

    ngOnInit(): void {
        this.plantillaService.getActiveTemplates().subscribe((response) => {
            // console.log(response);

            if (response.estatus === 'OK') {
                this.plantillas = response.lista.map((plantilla: any) => {
                    return {
                        value: plantilla.idPlantilla,
                        viewValue: plantilla.nombre,
                    };
                });
            } else {
                this.alertService.error(
                    'Error',
                    'Error al cargar las plantillas'
                );
            }
        });

        this.proyectosForm = this.fb.group({
            nombre: ['', Validators.required],
            descripcion: ['', Validators.required],
            idResponsableProyecto: ['', Validators.required],
        });
    }

    cambiarEditarNombre(index: number) {
        setTimeout(() => {
            const inputArray = this.estadoNombreInputs.toArray();
            if (index >= 0 && index < inputArray.length) {
                const inputElement = inputArray[index];
                inputElement.nativeElement.focus();
            } else {
                console.error(`Index out of bounds: ${index}`);
            }
        }, 0);
    }

    async crearNuevaPlantilla() {
        const nombre = await this.alertService.prompt('Nueva Plantilla', 'Nombre de la nueva plantilla', 'Ingrese el nombre de la nueva plantilla');
        if (nombre) {
            const nuevaPlantilla = {
                nombre: nombre,
                estatus: 1,
            };

            this.plantillaService.saveTemplate(nuevaPlantilla).subscribe({

                next: (response) => {
                    // console.log(response);
                    if (response.estatus === 'OK') {
                        this.plantillas.push({
                            value: response.dto.idPlantilla,
                            viewValue: nombre,
                        });

                        // Creamos estados por defecto
                        const estados = [
                            {
                                nombre: 'En proceso',
                                fase: 'En proceso',
                                color: '#FFD700',
                                idPlantilla: response.dto.idPlantilla,
                            },
                            {
                                nombre: 'Completadas',
                                fase: 'Completadas',
                                color: '#008000',
                                idPlantilla: response.dto.idPlantilla,
                            },
                            {
                                nombre: 'Finalizado',
                                fase: 'Finalizado',
                                color: '#008844',
                                idPlantilla: response.dto.idPlantilla,
                            },
                        ];

                        estados.forEach((estado) => {
                            this.plantillaService.saveTemplateState(estado).subscribe({
                                next: (response) => {
                                    // console.log(response);
                                    if (response.estatus === 'OK') {
                                        // estado.idEstatusPlantilla = response.dto.idEstatusPlantilla;
                                        // estado.plantilla = response.dto.plantilla
                                        // this.estados.push(estado);
                                        // this.estadosEnProceso.push(estado);
                                    } else {
                                        this.alertService.error('Error', 'Error al guardar la plantilla');
                                    }
                                },
                                error: (error) => {
                                    this.alertService.error('Error', 'Error al guardar la plantilla');
                                    console.error(error);
                                },

                            });
                        });

                    } else {
                        this.alertService.error('Error', 'Error al guardar la plantilla');
                    }
                },
                error: (error) => {
                    this.alertService.error('Error', 'Error al guardar la plantilla');
                    console.error(error);
                },

            });
            
        }
    }

    guardarNombre(estado: any) {

        // console.log(estado);

        const updated: Estado = {
            idEstatusPlantilla: estado.idEstatusPlantilla,
            nombre: estado.nombre,
            fase: estado.fase,
            color: estado.color,
            idPlantilla: estado.plantilla.idPlantilla,
        };

        // console.log(updated);

        this.updateEstado(updated);
    }

    guardarNombrePlantilla(plantilla: any){
        const updated = {
            idPlantilla: plantilla.value,
            nombre: plantilla.viewValue,
            estatus: 1,
        }

        this.plantillaService.editTemplate(updated).subscribe({
            next: (response) => {
                // console.log(response);
                if (response.estatus !== 'OK') {
                    this.alertService.error(
                        'Error',
                        'Error al actualizar el nombre de la plantilla'
                    );
                }
            },
            error: (error) => {
                this.alertService.error(
                    'Error',
                    'Error al actualizar el nombre de la plantilla'
                );
                console.error(error);
            },
        });

    }

    selectPlantilla(plantilla: any): void {
        this.selectedPlantilla = plantilla;
        this.plantillaService
            .getTemplateStates(plantilla.value)
            .subscribe((response) => {
                this.estados = response.lista;
                // Limpiamos las listas
                this.estadosEnProceso = [];
                this.estadosCompletadas = [];
                this.estadosFinalizado = [];
                this.filterEstadosByFase(this.estados);
            });
    }

    changeTempColor(color: any) {
        this.tempColor = color;
    }

    abrirSelectorColor() {
        const inputColor = document.getElementById(
            'hs-color-input'
        ) as HTMLInputElement;
        if (inputColor) {
            inputColor.click();
        }
    }

    mostrarSelectorColor(estado: any) {
        this.estadoActual = estado;
        this.tempColor = estado.color;
        this.mostrarSelector = true;
    }

    confirmarColor() {
        this.selectedColor = this.tempColor;
        this.mostrarSelector = false;
        this.seleccionarColor();
    }

    seleccionarColor() {
        if (this.estadoActual) {
            this.estadoActual.color = this.tempColor;

            const updated: Estado = {
                idEstatusPlantilla: this.estadoActual.idEstatusPlantilla,
                nombre: this.estadoActual.nombre,
                fase: this.estadoActual.fase,
                color: this.tempColor,
                idPlantilla: this.estadoActual.plantilla.idPlantilla,
            };
            this.updateEstado(updated);
        }
        this.mostrarSelector = false;
    }

    closeColorSelector() {
        this.mostrarSelector = false;
    }

    drop(event: CdkDragDrop<any[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        } else {
            // Evita mover elementos a la lista de finalizados
            if (event.container.id !== 'finalizado') {
                transferArrayItem(
                    event.previousContainer.data,
                    event.container.data,
                    event.previousIndex,
                    event.currentIndex
                );

                // Actualizar el estado en la base de datos

                const estado = event.container.data[event.currentIndex];

                const updated: Estado = {
                    idEstatusPlantilla: estado.idEstatusPlantilla,
                    nombre: estado.nombre,
                    fase:
                        event.container.id === 'enProceso'
                            ? 'En proceso'
                            : event.container.id === 'completadas'
                            ? 'Completadas'
                            : 'Finalizado',
                    color: estado.color,
                    idPlantilla: estado.plantilla.idPlantilla,
                };
                this.updateEstado(updated);
            }
        }
    }

    deleteEstado(estado: Estado): void {
        // console.log(estado);

        this.plantillaService
            .deleteTemplateState(estado.idEstatusPlantilla)
            .subscribe({
                next: (response) => {
                    // console.log(response);
                    if (response.estatus === 'OK') {
                        this.estados = this.estados.filter(
                            (e) =>
                                e.idEstatusPlantilla !==
                                estado.idEstatusPlantilla
                        );
                        this.estadosEnProceso = this.estadosEnProceso.filter(
                            (e) =>
                                e.idEstatusPlantilla !==
                                estado.idEstatusPlantilla
                        );
                        this.estadosCompletadas =
                            this.estadosCompletadas.filter(
                                (e) =>
                                    e.idEstatusPlantilla !==
                                    estado.idEstatusPlantilla
                            );
                        this.estadosFinalizado = this.estadosFinalizado.filter(
                            (e) =>
                                e.idEstatusPlantilla !==
                                estado.idEstatusPlantilla
                        );
                    } else {
                        this.alertService.error(
                            'Error',
                            'Error no es posible eliminar el estado en este momento'
                        );
                    }
                },
                error: (error) => {
                    this.alertService.error(
                        'No se puede eliminar el estado',
                        'Es posible que el estado esté vinculado con alguna tarea'
                    );
                    console.error(error);
                },
            });
    }

    updateEstado(estado: Estado): void {
        this.plantillaService.editTemplateState(estado).subscribe({
            next: (response) => {
                // // console.log(response);
                if (response.estatus !== 'OK') {
                    this.alertService.error(
                        'Error',
                        'Error al actualizar el estado'
                    );
                }
            },
            error: (error) => {
                this.alertService.error(
                    'Error',
                    'Error al actualizar el estado'
                );
                console.error(error);
            },
        });
    }

    filterEstadosByFase(estados: any): void {
        this.estadosEnProceso = estados.filter(
            (estado) => estado.fase === 'En proceso'
        );
        this.estadosCompletadas = estados.filter(
            (estado) => estado.fase === 'Completadas'
        );
        this.estadosFinalizado = estados.filter(
            (estado) => estado.fase === 'Finalizado'
        );
    }

    addEstado(fase: string): void {
        if (fase === 'En proceso') {
            this.isAddingEstadoEnProceso = true;
        } else if (fase === 'Completadas') {
            this.isAddingEstadoCompletadas = true;
        } else if (fase === 'Finalizado') {
            this.isAddingEstadoFinalizado = true;
        }
    }

    saveEstado(fase: string): void {
        if (fase === 'En proceso') {
            if (this.newEstadoEnProceso.trim() === '') {
                return;
            } else {
                const nuevoEstado: Estado = {
                    nombre: this.newEstadoEnProceso,
                    fase: fase,
                    color: '#FFD700',
                    idPlantilla: this.selectedPlantilla.value,
                };

                // // console.log(nuevoEstado);

                this.plantillaService.saveTemplateState(nuevoEstado).subscribe({
                    next: (response) => {

                        if (response.estatus === 'OK') {
                            nuevoEstado.idEstatusPlantilla = response.dto.idEstatusPlantilla;
                            nuevoEstado.plantilla = response.dto.plantilla
                            this.estadosEnProceso.push(nuevoEstado);
                            this.newEstadoEnProceso = '';
                            this.isAddingEstadoEnProceso = false;
                            this.estados.push(nuevoEstado);
                        } else {
                            this.alertService.error(
                                'Error',
                                'Error al guardar el estado'
                            );
                        }
                    },
                    error: (error) => {
                        this.alertService.error(
                            'Error',
                            'Error al guardar el estado'
                        );
                        console.error(error);
                    },
                });
            }
        } else if (fase === 'Completadas') {
            if (this.newEstadoCompletadas.trim() === '') {
                return;
            } else {
                const nuevoEstado: Estado = {
                    nombre: this.newEstadoCompletadas,
                    fase: fase,
                    color: '#008000',
                    idPlantilla: this.selectedPlantilla.value,
                };

                this.plantillaService.saveTemplateState(nuevoEstado).subscribe({
                    next: (response) => {
                        // console.log(response);
                        if (response.estatus === 'OK') {
                            nuevoEstado.idEstatusPlantilla = response.dto.idEstatusPlantilla;
                            nuevoEstado.plantilla = response.dto.plantilla
                            this.estadosCompletadas.push(nuevoEstado);
                            this.newEstadoCompletadas = '';
                            this.isAddingEstadoCompletadas = false;
                            this.estados.push(nuevoEstado);
                        } else {
                            this.alertService.error(
                                'Error',
                                'Error al guardar el estado'
                            );
                        }
                    },
                    error: (error) => {
                        this.alertService.error(
                            'Error',
                            'Error al guardar el estado'
                        );
                        console.error(error);
                    },
                });
            }
        }
    }

    onClose(): void {
        this.dialogRef.close(this.plantillas);
    }
}
