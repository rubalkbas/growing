import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { TicketsService } from 'app/modules/services/ticket.service';
import { ModalTarea } from './tarea-modal/tarea-modal.component';
import { ProyectsService } from 'app/modules/services/proyec.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { ModalSubTarea } from './subtarea-modal/subtarea-modal.component';
import { ModalDetalleTarea } from './detalle-tarea-modal/detalle-tarea-modal.component';

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
  }
}


@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ],
  imports: [MatButtonModule, MatPaginatorModule, MatIconModule, MatMenuModule, MatDividerModule, NgApexchartsModule, MatTableModule, MatSortModule, NgClass, MatProgressBarModule, CurrencyPipe, DatePipe],
})
export class ModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('recentTransactionsTable', { read: MatSort }) recentTransactionsTableMatSort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  data: any;
  accountBalanceOptions: ApexOptions;
  recentTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
  recentTransactionsTableColumns: string[] = ['idProyecto', 'nombre', 'descripcion', 'fecha', 'estatus', 'idResponsableProyecto', 'acciones'];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _unsubscribeAllUsuario: Subject<any> = new Subject<any>();
  usuarioLoggeado: any;
  proyectoDetails: any;
  personalProyectoDetails: any;

  /**
   * Constructor
   */
  constructor(private _financeService: ExampleService, public dialog: MatDialog,
    private ticketService: TicketsService,
    private proyectsService: ProyectsService,
    private _userService: UserService,

  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Get the data

    this._userService.user$
      .pipe((takeUntil(this._unsubscribeAllUsuario)))
      .subscribe((user: User) => {
        this.usuarioLoggeado = user.id;
        //console.log('Usuario loggeado:', this.usuarioLoggeado);
      });

    this._financeService.data$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        // Store the data
        this.data = data;

      });

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
   * After view init
   */
  ngAfterViewInit(): void {
    // Make the data source sortable

  }

  /**
   * Prepare the chart data from the data
   *
   * @private
   */

  openTarea(): void {
    const dialogRef = this.dialog.open(ModalTarea, {
      width: '750px',
    });

    dialogRef.afterClosed().subscribe(result => {
      //this.consultaProyectos();
    });
  }

  openSubtarea(): void {
    const dialogRef = this.dialog.open(ModalSubTarea, {
      width: '750px',
    });

    dialogRef.afterClosed().subscribe(result => {
      //this.consultaProyectos();
    });
  }


  openDetalleTarea(): void {
    const dialogRef = this.dialog.open(ModalDetalleTarea, {
      width: '80%',
      height: '90%'
    });

    dialogRef.afterClosed().subscribe(result => {
      //this.consultaProyectos();
    });
  }



}

