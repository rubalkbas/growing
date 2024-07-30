import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { DateTime } from 'luxon';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { AlertService } from 'app/modules/services/alerts.service';
import { ScrumboardBoardService } from 'app/modules/services/scrumboard.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalTarea } from '../../modales/tarea-modal/tarea-modal.component';
import { ProyectsService } from 'app/modules/services/proyec.service';
import { ModalDetalleTarea } from '../../modales/detalle-tarea-modal/detalle-tarea-modal.component';

@Component({
    selector: 'scrumboard-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatButtonModule, RouterLink, MatIconModule, CdkScrollable, CdkDropList, CdkDropListGroup, NgFor, CdkDrag, CdkDragHandle, MatMenuModule, NgIf, NgClass, RouterOutlet, DatePipe],
})
export class ScrumboardBoardComponent implements OnInit, OnDestroy {
    listTitleForm: UntypedFormGroup;
    tareas: any[] = [];
    plantilla: any[] = [];
    idProyecto: any;
    idPlantilla: any;
    idTarea: any;

    private readonly _positionStep: number = 65536;
    private readonly _maxPosition: number = this._positionStep * 500;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: UntypedFormBuilder,
        private alertService: AlertService,
        private scrumboardBoardService: ScrumboardBoardService,
        private proyectsService: ProyectsService,
        public dialog: MatDialog,
        private route: ActivatedRoute

    ) { }

    ngOnInit(): void {
        this.listTitleForm = this._formBuilder.group({
            title: [''],
        });
    
        // Suscríbete a los cambios en los parámetros de la ruta
        this.route.paramMap.subscribe(params => {
            const boardId = params.get('boardId');
            this.idProyecto = boardId;
    
            // Llama a obtenerProyecto con el nuevo id
            this.obtenerProyecto();
        });
    }
    

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    renameList(listTitleInput: HTMLElement): void {
        setTimeout(() => {
            listTitleInput.focus();
        });
    }

    addList(title: string): void {
        // Your logic to add a new list goes here
    }

    updateListTitle(event: any, list: any): void {
        const element: HTMLInputElement = event.target;
        const newTitle = element.value;

        if (!newTitle || newTitle.trim() === '') {
            element.value = list.nombre;
            return;
        }

        list.nombre = element.value = newTitle.trim();

        // Update the list on the backend if necessary
    }

    deleteList(id: number): void {
        // Your logic to delete a list goes here
    }

    addCard(): void {
        // console.log(platilla.idEstatusPlantilla);
        const dialogRef = this.dialog.open(ModalTarea, {
            width: '750px',
            data: {
                // idEstatusPlantilla: platilla.idEstatusPlantilla,
                idProyecto: this.idProyecto,
                //archivos: this.archivos,
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            //this.consultaProyectos();
            this.obtenerPlantillasTareas();
        });
    }

    listDropped(event: CdkDragDrop<any[]>): void {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        const updated = this._calculatePositions(event);
        // Update the lists on the backend if necessary
    }

    cardDropped(event: CdkDragDrop<any[]>): void {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
            event.container.data[event.currentIndex].idEstatusPlantilla = +event.container.id;
            this.updateCardStatus(event.container.data[event.currentIndex]);
        }
    }

    updateCardStatus(card: any): void {

        const newCard = {
            idEstatusPlantilla: {
                idEstatusPlantilla: card.idEstatusPlantilla
            },
            titulo: card.titulo,
            idTarea: card.idTarea,
            fechaEstimada: card.fechaEstimada
        }

        this.actualizarTarea(newCard);

        this.scrumboardBoardService.updateEstatusPlantilla(card.idTarea, card.idEstatusPlantilla)
            .subscribe({
                next: (response) => {
                    this.obtenerPlantillasTareas();
                    // console.log("response.dto");
                    // console.log(response.dto);
                },
                error: (error) => {
                    this.alertService.error('Error', 'Error al actualizar tarea');
                    console.error(error);
                },
            });
    }

    actualizarTarea(tareaActualizada: any): void {
        // Encuentra el índice de la tarea actualizada en la lista de tareas
        const index = this.tareas.findIndex(t => t.idTarea === tareaActualizada.idTarea);

        // Si se encuentra la tarea, actualiza la información
        if (index !== -1) {
            this.tareas[index] = tareaActualizada;
        } else {
            console.warn(`Tarea con id ${tareaActualizada.idTarea} no encontrada en la lista de tareas`);
        }

        // Marca los cambios para la detección de cambios
        this._changeDetectorRef.markForCheck();
    }

    isOverdue(date: string): boolean {
        return DateTime.fromISO(date).startOf('day') < DateTime.now().startOf('day');
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    private _calculatePositions(event: CdkDragDrop<any[]>): any[] {
        let items = event.container.data;
        const currentItem = items[event.currentIndex];
        const prevItem = items[event.currentIndex - 1] || null;
        const nextItem = items[event.currentIndex + 1] || null;

        if (!prevItem) {
            if (!nextItem) {
                currentItem.idEstatusPlantilla = this._positionStep;
            } else {
                currentItem.position = nextItem.position / 2;
            }
        } else if (!nextItem) {
            currentItem.position = prevItem.position + this._positionStep;
        } else {
            currentItem.position = (prevItem.position + nextItem.position) / 2;
        }

        if (!Number.isInteger(currentItem.position) || currentItem.position >= this._maxPosition) {
            items = items.map((value, index) => {
                value.position = (index + 1) * this._positionStep;
                return value;
            });
            return items;
        }

        return [currentItem];
    }

    getTasks(listId: number): any[] {
        return this.tareas.filter(tarea => tarea.idEstatusPlantilla.idEstatusPlantilla === listId);
    }

    getTaskCount(listId: number): number {
        return this.getTasks(listId).length;
    }

    obtenerPlantillasTareas() {
        forkJoin([
            this.scrumboardBoardService.getPlantillaId(this.idPlantilla),
            this.scrumboardBoardService.getTareasProyecto(this.idProyecto),
        ]).subscribe(([plantilla, tareas]) => {
            this.plantilla = plantilla.lista;
            this.tareas = tareas.lista;
            // console.log('Plantilla:', this.plantilla);
            // console.log('Tareas:', this.tareas);
            this._changeDetectorRef.markForCheck();
        });
    }

    private obtenerProyecto(): void {
        this.proyectsService.consultaUnProyectoPorId(this.idProyecto).subscribe({
            next: (respuesta: any) => {
                this.idPlantilla = respuesta.dto.idPlantilla.idPlantilla;
                this.obtenerPlantillasTareas();
            },
            error: (error: Error) => {
                console.error(error);
            },
        });
    }
    

    openDetalleTarea(tarea): void {
        console.log('tarea:', tarea.idTarea);
        console.log('idProyecto:', this.idProyecto);
        const dialogRef = this.dialog.open(ModalDetalleTarea, {
            width: '80%',
            height: '90%',
            data: {
                // idEstatusPlantilla: platilla.idEstatusPlantilla,
                idProyecto: this.idProyecto,
                idTarea: tarea.idTarea
            }
        },
        );
        dialogRef.afterClosed().subscribe(result => {
            //this.consultaProyectos();
            this.obtenerPlantillasTareas();
          });
    }
}
