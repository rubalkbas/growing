import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ExampleService } from 'app/modules/admin/tickets/tickets.service';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import {
    MatPaginator,
    MatPaginatorIntl,
    MatPaginatorModule,
} from '@angular/material/paginator';
import { ModalAltaProyectos } from './alta-proyectos-modal/alta-proyectos-modal.component';
import { ProyectsService } from 'app/modules/services/proyec.service';
import { ModalUsuariosProyectos } from './usuarios-proyectos-modal/usuarios-proyectos-modal.component';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { PlantillaService } from 'app/modules/services/plantilla.service';
import { Router } from '@angular/router';

export class CustomPaginatorIntl extends MatPaginatorIntl {
    itemsPerPageLabel = 'Elementos por página';
    nextPageLabel = 'Página siguiente';
    previousPageLabel = 'Página anterior';
    firstPageLabel = 'Primera página';
    lastPageLabel = 'Última página';
    ofLabel = 'de';

    getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
            return `0 de ${length}`;
        }
        const totalPages = Math.ceil(length / pageSize);
        const currentPage = page + 1;
        return `${currentPage} de ${totalPages}`;
    };
}

@Component({
    selector: 'proyectos',
    templateUrl: './proyectos.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
    imports: [
        MatButtonModule,
        MatPaginatorModule,
        MatIconModule,
        MatMenuModule,
        MatDividerModule,
        NgApexchartsModule,
        MatTableModule,
        MatSortModule,
        NgClass,
        MatProgressBarModule,
        CurrencyPipe,
        DatePipe,
    ],
})
export class ProyectosComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('recentTransactionsTable', { read: MatSort })
    recentTransactionsTableMatSort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    data: any;
    accountBalanceOptions: ApexOptions;
    recentTransactionsDataSource: MatTableDataSource<any> =
        new MatTableDataSource();
    recentTransactionsTableColumns: string[] = [
        'idProyecto',
        'nombre',
        // 'descripcion',
        'fecha',
        'estatus',
        'idResponsableProyecto',
        'progreso',
        'acciones',
        'tareas'
    ];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _unsubscribeAllUsuario: Subject<any> = new Subject<any>();
    usuarioLoggeado: any;
    proyectoDetails: any;
    personalProyectoDetails: any;

    /**
     * Constructor
     */
    constructor(
        private _financeService: ExampleService,
        public dialog: MatDialog,
        private proyectsService: ProyectsService,
        private _userService: UserService,
        private plantillaService: PlantillaService,
        private router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the data

        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAllUsuario))
            .subscribe((user: User) => {
                this.usuarioLoggeado = user.id;
                //console.log('Usuario loggeado:', this.usuarioLoggeado);
            });

        this._financeService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                // Store the data
                this.data = data;

                // Store the table data
                //this.recentTransactionsDataSource.data = finance.recentTransactions;

                // Prepare the chart data
            });

        this.consultaProyectos();
    }

    consultaProyectos() {
        // Unsubscribe from all subscriptions

        //id = 1;
        this.proyectsService.getProyects().subscribe({
            next: (respuesta: any) => {
                console.log('Respuesta completa: ', respuesta);

                this.recentTransactionsDataSource.data = respuesta.lista;
            },
            error: (error: Error) => {
                console.error(error);
            },
        });
    }

    editaTicket(element) {
        let proyecto: any = {};

        proyecto.descripcion = '';
        proyecto.estatus = '';
        proyecto.idProyecto = '';
        proyecto.idResponsableProyecto.idUsuario = '';
        proyecto.nombre = '';

        //===========================esta es la estructura del put ============================
        // "descripcion": "string",
        // "estatus": 1,
        // "idProyecto": 2,
        // "idResponsableProyecto": {
        //   "idUsuario": 1
        // },
        // "nombre": "string"

        this.proyectsService.updateProyecto(proyecto).subscribe({
            next: (respuesta: any) => {
                //console.log('Respuesta completa: ', respuesta);

                //agregar mas acciones necesarias
                this.consultaProyectos();
            },
            error: (error: Error) => {
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

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        // Make the data source sortable
        this.recentTransactionsDataSource.sort =
            this.recentTransactionsTableMatSort;
        this.recentTransactionsDataSource.paginator = this.paginator;
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Prepare the chart data from the data
     *
     * @private
     */

    openDialog(): void {

        this.plantillaService.getActiveTemplates().subscribe({

            next: (respuesta: any) => {
                if(respuesta.estatus === 'OK'){
                    const dialogRef = this.dialog.open(ModalAltaProyectos, {
                        width: '750px',
                        data: {
                            plantillas: respuesta.lista,
                        },
                    });
            
                    dialogRef.afterClosed().subscribe((result) => {
                        this.consultaProyectos();
                    });
                }
            },
            error: (error: Error) => {
                console.error(error);
            },

        });

    }

    openDialog2(): void {
        const dialogRef = this.dialog.open(ModalUsuariosProyectos, {
            width: '750px',
            data: {
                id: this.usuarioLoggeado,
                proyecto: this.proyectoDetails,
                personalProyectoDetails: this.personalProyectoDetails,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.consultaProyectos();
        });
    }

    consultaUnProyecto(id) {
        // Unsubscribe from all subscriptions

        //id = 1;
        this.proyectsService.consultaUnProyectoPorId(id).subscribe({
            next: (respuesta: any) => {
                this.proyectoDetails = respuesta;

                this.consultaPersonalProyecto(id);
            },
            error: (error: Error) => {
                console.error(error);
            },
        });
    }

    consultaPersonalProyecto(id) {
        this.proyectsService.consultaPersonasProyecto(id).subscribe({
            next: (respuesta: any) => {
                this.personalProyectoDetails = respuesta.lista;

                // console.log('Respuesta completa: ', respuesta);

                //agregar al form
                this.openDialog2();
            },
            error: (error: Error) => {
                console.error(error);
            },
        });
    }


    consultaTareas(idProyecto: string): void {
        this.router.navigate(['/scrumboard', idProyecto]);
    }
}
