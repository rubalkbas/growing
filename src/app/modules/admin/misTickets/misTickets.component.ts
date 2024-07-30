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
import { ModalNewTicket } from 'app/modules/modal-nvo-ticket/nvo-ticket-modal/nvo-ticket.modal.component';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import {
    MatPaginator,
    MatPaginatorIntl,
    MatPaginatorModule,
} from '@angular/material/paginator';
import { TicketsService } from 'app/modules/services/ticket.service';
import { ModalVerMiTicket } from './ver-mi-ticket-modal/ver-mi-ticket.modal.component';
import { UserService } from 'app/core/user/user.service';
import { ExampleService } from '../tickets/tickets.service';
import { AreaAtencionService } from 'app/modules/services/area-atencion.service';

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

export const finance = {
    recentTransactions: [
        {
            id: '1b6fd296-bc6a-4d45-bf4f-e45519a58cf5',
            transactionId: '528651571NT',
            name: 'Morgan Page',
            amount: +1358.75,
            status: 'completed',
            date: '2019-10-07T22:22:37.274Z',
        },
        {
            id: '2dec6074-98bd-4623-9526-6480e4776569',
            transactionId: '421436904YT',
            name: 'Nita Hebert',
            amount: -1042.82,
            status: 'completed',
            date: '2019-12-18T14:51:24.461Z',
        },
        {
            id: 'ae7c065f-4197-4021-a799-7a221822ad1d',
            transactionId: '685377421YT',
            name: 'Marsha Chambers',
            amount: +1828.16,
            status: 'pending',
            date: '2019-12-25T17:52:14.304Z',
        },
        {
            id: '0c43dd40-74f6-49d5-848a-57a4a45772ab',
            transactionId: '884960091RT',
            name: 'Charmaine Jackson',
            amount: +1647.55,
            status: 'completed',
            date: '2019-11-29T06:32:16.111Z',
        },
        {
            id: 'e5c9f0ed-a64c-4bfe-a113-29f80b4e162c',
            transactionId: '361402213NT',
            name: 'Maura Carey',
            amount: -927.43,
            status: 'completed',
            date: '2019-11-24T12:13:23.064Z',
        },
    ],
};

@Component({
    selector: 'tickets',
    templateUrl: './misTickets.component.html',
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
export class MisTicketsComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('recentTransactionsTable', { read: MatSort })
    recentTransactionsTableMatSort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    data: any;
    accountBalanceOptions: ApexOptions;
    recentTransactionsDataSource: MatTableDataSource<any> =
        new MatTableDataSource();
    recentTransactionsTableColumns: string[] = [
        'idTicket',
        'estatus',
        'usuarioSolicitante',
        'usuarioAsignado',
        'fechaCreacion',
        'categoria',
        'prioridad',
        'titulo',
        'proyecto',
        'acciones',
    ];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _unsubscribeAllUsuario: Subject<any> = new Subject<any>();
    ticketDetails: any;
    usuarioLoggeado: any;
    rol: any;
    archivos: any;
    areasAtencion: any[] = [];

    /**
     * Constructor
     */
    constructor(
        private _financeService: ExampleService,
        public dialog: MatDialog,
        private ticketService: TicketsService,
        private _userService: UserService,
        private areaAtencionService: AreaAtencionService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAllUsuario))
            .subscribe((user: any) => {
                console.log('este es el usuraio ', user);
                this.usuarioLoggeado = user.id;
                this.rol = user.idRol.idRol;
                console.log('Usuario rol:', this.rol);
                //console.log('Usuario loggeado:', this.usuarioLoggeado);
            });

        this.areaAtencionService.getAreasAtencionUsuarios().subscribe({
            next: (respuesta: any) => {
                console.log('Respuesta completa: ', respuesta);
                // Accediendo a la lista de areas de atención dentro de la respuesta
                if (respuesta.estatus === 'OK') {
                    this.areasAtencion = respuesta.lista;
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

        // Get the data
        this._financeService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                // Store the data
                this.data = data;

                // Store the table data
                //this.recentTransactionsDataSource.data = finance.recentTransactions;

                // Prepare the chart data
            });

        if (this.rol == 2) {
            this.consultaTodosTickets();
        } else {
            this.consultaTickets(this.usuarioLoggeado);
        }
    }

    consultaTickets(id) {
        // Unsubscribe from all subscriptions

        //id = 1;
        this.ticketService.consultaTicketsPropios(id).subscribe({
            next: (respuesta: any) => {
                //this.recentTransactionsDataSource.data = respuesta;
                //console.log('esta es la respuesta  '+ respuesta.lista.)
                // Log completo de la respuesta para inspeccionar la estructura
                //console.log('Respuesta completa: ', respuesta);
                // Accediendo a la lista de tickets dentro de la respuesta

                this.recentTransactionsDataSource.data = respuesta.lista;

                // if (respuesta.lista && Array.isArray(respuesta.lista)) {
                //     console.log('Lista de tickets: ', respuesta.lista);
                //     respuesta.lista.forEach(ticket => {
                //         console.log('Detalles del ticket: ', ticket);
                //     });
                // } else {
                //     console.log('La respuesta no contiene una lista válida de tickets.');
                // }
            },
            error: (error: Error) => {
                console.error(error);
            },
        });
    }
    consultaTodosTickets() {
        // Unsubscribe from all subscriptions

        //id = 1;
        this.ticketService.consultaTicketsAll().subscribe({
            next: (respuesta: any) => {
                //this.recentTransactionsDataSource.data = respuesta;
                //console.log('esta es la respuesta  '+ respuesta.lista.)
                // Log completo de la respuesta para inspeccionar la estructura
                //console.log('Respuesta completa: ', respuesta);
                // Accediendo a la lista de tickets dentro de la respuesta

                this.recentTransactionsDataSource.data = respuesta.lista;

                // if (respuesta.lista && Array.isArray(respuesta.lista)) {
                //     console.log('Lista de tickets: ', respuesta.lista);
                //     respuesta.lista.forEach(ticket => {
                //         console.log('Detalles del ticket: ', ticket);
                //     });
                // } else {
                //     console.log('La respuesta no contiene una lista válida de tickets.');
                // }
            },
            error: (error: Error) => {
                console.error(error);
            },
        });
    }

    consultaUnTicket(id) {
        // Unsubscribe from all subscriptions

        //id = 1;
        this.ticketService.consultaUnTicketPorId(id).subscribe({
            next: (respuesta: any) => {
                this.ticketDetails = respuesta.dto;
                this.archivos = respuesta.lista;
                //console.log('Respuesta completa: ', respuesta);

                //agregar al form
                this.openDialog2();
            },
            error: (error: Error) => {
                console.error(error);
            },
        });
    }

    formatIdTicket(id: number): string {
        let idStr = id.toString();
        const zerosNeeded = 7 - idStr.length;
        const zeros = '0'.repeat(zerosNeeded);
        return `${zeros}${idStr}-ITV`;
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
        const dialogRef = this.dialog.open(ModalNewTicket, {
            width: '900px',
            // height: '700px'
            data: {
                areasAtencion: this.areasAtencion,
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                //console.log('Datos del nuevo ticket:', result);
            }
        });
    }

    openDialog2(): void {
        const dialogRef = this.dialog.open(ModalVerMiTicket, {
            width: '900px',
            data: {
                id: this.usuarioLoggeado,
                ticket: this.ticketDetails,
                archivos: this.archivos,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                //console.log('Datos del nuevo ticket:', result);
            }
        });
    }
}
