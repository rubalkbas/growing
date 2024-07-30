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
import { ModalNewTicket } from 'app/modules/modal-nvo-ticket/nvo-ticket-modal/nvo-ticket.modal.component';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { ResponseDTO } from 'app/mock-api/common/interfaces/response.interface';
import { ModalVerArea } from './detalle-area-atencion-modal/detalle-area-atencion.modal.component';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';

import { AreaAtencionService } from 'app/modules/services/areaAtencion.service';

import { ModalNewAreaAtencion } from './nvo-area-atencion/nvo-area-atencion.modal.component';


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
  selector: 'area-atencion',
  templateUrl: './area-atencion.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ],
  imports: [MatButtonModule, MatPaginatorModule, MatIconModule, MatMenuModule, MatDividerModule, NgApexchartsModule, MatTableModule, MatSortModule, NgClass, MatProgressBarModule, CurrencyPipe, DatePipe],
})
export class AreaAtencionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('recentTransactionsTable', { read: MatSort }) recentTransactionsTableMatSort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  data: any;
  accountBalanceOptions: ApexOptions;
  recentTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
  recentTransactionsTableColumns: string[] = ['idAreaAtencion', 'estatus', 'nombreAreaAtencion', 'descripcionAreaAtencion', 'fechaCreacion', 'correoAreaAtencion', 'nombreResponsable', 'acciones'];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _unsubscribeAllUsuario: Subject<any> = new Subject<any>();
  areaDetails: any;
  usuarioLoggeado: any;
  rol: any;
  archivos: any;

  /**
   * Constructor
   */
  constructor(private _financeService: ExampleService, public dialog: MatDialog,
    private areaAtencionService: AreaAtencionService,
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

    this._userService.user$
      .pipe((takeUntil(this._unsubscribeAllUsuario)))
      .subscribe((user: any) => {
        //console.log("este es el usuraio ", user);
        this.usuarioLoggeado = user.id;
        this.rol = user.idRol.idRol;
        //console.log('Usuario rol:', this.rol);
        //console.log('Usuario loggeado:', this.usuarioLoggeado);
      });

    // Get the data
    this._financeService.data$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        // Store the data
        this.data = data;
        

      });
    this.consultaArea();
  }

  consultaArea() {

    this.areaAtencionService.getAllAreas().subscribe({
      next: (respuesta: any) => {

        this.recentTransactionsDataSource.data = respuesta.lista;

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
    return `${zeros}${idStr}-AAT`;
  }

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    // Make the data source sortable
    this.recentTransactionsDataSource.sort = this.recentTransactionsTableMatSort;
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

  consultaUnArea(id){
    // Unsubscribe from all subscriptions

    //id = 1;
    this.areaAtencionService.consultaAreaPorId(id).subscribe({
        next: (respuesta: any ) => {
        
        this.areaDetails = respuesta.dto;
        //this.archivos = respuesta.lista;
        //console.log('Respuesta completa: ', respuesta);

        //agregar al form
        this.openDialog2();
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
}


  openDialog2(): void {
    const dialogRef = this.dialog.open(ModalVerArea, {
      width: '600px',
      height: '700px',
      data: {
        id: this.usuarioLoggeado,
        area: this.areaDetails,
        //archivos: this.archivos,
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      this.consultaArea();
      if (result) {
        //console.log('Datos del nuevo ticket:', result);
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalNewAreaAtencion, {
      width: '900px',
    });

    dialogRef.afterClosed().subscribe(result => {
       
      if (result) {
        //console.log('Datos del nuevo ticket:', result);
      }
    });
  }


}

