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
import { forkJoin, Subject, takeUntil } from 'rxjs';
import {
    MatPaginator,
    MatPaginatorIntl,
    MatPaginatorModule,
} from '@angular/material/paginator';

import { TicketsService } from 'app/modules/services/ticket.service';
import { ResponseDTO } from 'app/mock-api/common/interfaces/response.interface';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { RolesService } from 'app/modules/services/roles.service';
import { AlertService } from 'app/modules/services/alerts.service';
import { ModalNewRol } from './new-rol-modal/new-rol-modal.component';
import { ModalDetallesRoles } from './rol-details-modal/rol-details-modal.component';
import { PerfilamientoService } from 'app/modules/services/perfilamientos.service';

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
    selector: 'roles',
    templateUrl: './roles.component.html',
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
export class RolesComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('recentTransactionsTable', { read: MatSort })
    recentTransactionsTableMatSort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    data: any;
    accountBalanceOptions: ApexOptions;
    recentTransactionsDataSource: MatTableDataSource<any> =
        new MatTableDataSource();
    recentTransactionsTableColumns: string[] = [
        'idRol',
        'nombre',
        'estatus',
        'fechaCreacion',
        'fechaActivacion',
        'acciones',
    ];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _unsubscribeAllUsuario: Subject<any> = new Subject<any>();
    rolDetails: any;
    usuarioLoggeado: any;
    rol: any;
    archivos: any;
    permisos: any[];

    /**
     * Constructor
     */
    constructor(
        private _financeService: ExampleService,
        public dialog: MatDialog,
        private rolesService: RolesService,
        private _userService: UserService,
        private alertService: AlertService,
        private perfilamientoService: PerfilamientoService
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
            .subscribe((user: User) => {
                //console.log("este es el usuraio ",user);
                this.usuarioLoggeado = user.id;
                this.rol = user.rol;
                //console.log('Usuario loggeado:', this.usuarioLoggeado);
            });

        forkJoin([
            this.rolesService.getRoles(),
            this.perfilamientoService.getPermisos(),
        ]).subscribe(([response, permisos]) => {
            if (response.estatus === 'OK') {
                if (response.estatus === 'OK') {
                    this.data = response.lista;
                    this.recentTransactionsDataSource.data = this.data;
                } else {
                    this.alertService.error(
                        'Error',
                        'Hubo un problema al obtener los roles'
                    );
                }
            } else {
                this.alertService.error(
                    'Error',
                    'Hubo un problema al obtener los roles'
                );
            }

            if (permisos.estatus === 'OK') {
                this.permisos = permisos.lista;
            }
        });
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

    openDialog(): void {
        const dialogRef = this.dialog.open(ModalNewRol, {
            width: '500px',
            data: { usuario: this.usuarioLoggeado, permisos: this.permisos },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            this.rolDetails = result;
            console.log(this.rolDetails);

            // Agregamos el nuevo rol a la tabla
            if (this.rolDetails) {
                this.data.push(this.rolDetails);
                this.recentTransactionsDataSource.data = this.data;
            }
        });
    }

    consultaDetalleRol(rol: any): void {
        console.log('Rol seleccionado:', rol);
        this.perfilamientoService.getPermisosByRol(rol.idRol).subscribe({
            next: (response: ResponseDTO<any>) => {
                if (response.estatus === 'OK') {

                    const dialogRef = this.dialog.open(ModalDetallesRoles, {
                        width: '750px',
                        data: { rol: rol, permisos: this.permisos, permisosRol: response.lista},
                    });
            
                    dialogRef.afterClosed().subscribe((result) => {
                        console.log('The dialog was closed');
                        this.rolDetails = result;
                        console.log(this.rolDetails);
                    });

                } else {
                    this.alertService.error(
                        'Error',
                        'Hubo un problema al obtener los permisos del rol'
                    );
                }
            },
            error: (error) => {
                this.alertService.error(
                    'Error',
                    'Hubo un problema al obtener los permisos del rol'
                );
            },
        });



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

    formatRoltId(id: number): string {
        return id.toString().padStart(7, '0') + '-IRL';
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------
}
