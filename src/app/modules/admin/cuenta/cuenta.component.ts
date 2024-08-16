import { CommonModule, CurrencyPipe, DatePipe, NgClass, NgFor, getCurrencySymbol } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { BehaviorSubject, Subject, Subscription, takeUntil } from 'rxjs';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';

import { MatCardModule } from '@angular/material/card';
import { ITradingViewWidget, TradingviewWidgetModule } from 'angular-tradingview-widget';
import { WebSocketRxjsService } from '@ittiva/services/websoctekt.service';
import { CuentaModalComponent } from './cuenta-modal/cuenta.component';
import { TradingViewWidgetComponent } from '../tradingViewWidget/trading-view-widget.component';
import { TradingViewWidgetService } from '../tradingViewWidget/trading-view-widget.service';
import { WebSocketService } from '@ittiva/services/webSockete';
import { ClienteService } from '../clientes/clientes.service';
import Swal from 'sweetalert2';

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

export interface CurrencyMoneda {
  position: number;
  instrumento: string;
  variacion: string;
  vender: string;
  comprar: string;
  change: string;
}

interface CurrencyData {
  value: number;
  change: string;  // Positivo, negativo o sin cambio
  position: number;
  instrumento: string;
  variacion: string;
  vender: string;
  comprar: string;
}

@Component({
  selector: 'cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ],
  imports: [CommonModule, MatButtonModule, MatPaginatorModule, MatIconModule, MatMenuModule, MatDividerModule, NgApexchartsModule, MatTableModule, MatSortModule, NgClass, MatProgressBarModule, CurrencyPipe, DatePipe, MatCardModule, NgFor, TradingViewWidgetComponent],
})
export class CuentaComponent implements OnInit {
  displayedColumns: string[] = ['position', 'instrumento', 'variacion', 'vender', 'comprar'];
  selectedSymbol: string = 'AAPL';


  public messages: any;
  private subscription: Subscription;
  posicion = 0;
  balance = 1300;
  margenLibre = 300;
  margen = 1000;
  listaDatos: CurrencyMoneda[];
  data: any;
  totalCreditos = 0;
  idUser: string;
  totalGanPerd = 1;
  totalRetirosSolicitados = 0;
  totalRetirosEfectuados = 0;
  retiroBool = false;

  /**
   * Constructor
   */
  constructor(private websocketService: WebSocketRxjsService,
    public dialog: MatDialog,
    private clienteService: ClienteService,
    private webSocketService: WebSocketService
  ) {
    this.idUser = localStorage.getItem('idUserWrog');
    console.log('idUserWrog', this.idUser);
  }

  public messages2: string[] = [];

  ngOnInit(): void {
    this.messages = [];
    this.listaDatos = [];

    this.subscription = this.webSocketService.messages$.subscribe(
      message => {
        this.messages.push(message);
        console.log('Received message:', message);
      }
    );

    this.cargaIngreso();
    this.cargaRetiros();
  }

  cargaIngreso(): void {

    let request = {
      "accion": "string",
      "dinero": 0,
      "estatusRetiro": 0,
      "fechaCreacion": "2024-08-12T05:15:57.772Z",
      "idDinero": 0,
      "idUsuario": this.idUser,
      "tipo": "string"
    }
    this.clienteService.getCredito(request).subscribe({
      next: (respuesta: any) => {
        console.log('Respuesta completa: ', respuesta);
        // Accediendo a la lista de areas de atención dentro de la respuesta
        if (respuesta.estatus === 'OK') {
          this.totalCreditos = respuesta.sumaTotal
          // console.log('Respuesta completa: ', this.totalCreditos);
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
  consultaAbiertas(): void {

    let request =
    {
      "bloqueCompra": "string",
      "compra": "string",
      "estatusCompra": "string",
      "fechaCierre": "2024-08-14T19:18:54.451Z",
      "fechaCreacion": "2024-08-14T19:18:54.451Z",
      "gananciaPerdida": 0,
      "idApuestaCliente": 0,
      "idUsuario": this.idUser,
      "montoApuesta": 0,
      "tipoCompra": "string",
      "unidades": 0,
      "valorUnidad": 0,
      "variacion": 0
    }
    this.retiroBool = false;
    this.clienteService.consultaAbiertas(request).subscribe({
      next: (respuesta: any) => {
        console.log('Respuesta completa: ', respuesta);
        // Accediendo a la lista de areas de atención dentro de la respuesta
        if (respuesta.estatus === 'OK') {
          if (respuesta.lista.length > 0) {
            Swal.fire({
              title: 'Retiro',
              text: 'Tines apuestas abiertas, no puedes realizar un retiro.',
              icon: 'warning',
              confirmButtonText: 'Aceptar'
            });
            return;
          }

          const dialogRef = this.dialog.open(CuentaModalComponent, {
            width: '500px',
            data: { idUser: this.idUser, totalCreditos: this.totalCreditos }
          });

          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
          });
        }


      },
      error: (error: Error) => {
        console.error(error);
      },
    });

  }

  cargaRetiros():void{

    let request = {
      "accion": "string",
      "dinero": 0,
      "estatusRetiro": 0,
      "fechaCreacion": "2024-08-12T05:15:57.772Z",
      "idDinero": 0,
      "idUsuario": this.idUser,
      "tipo": "string"
    }
    this.clienteService.getRetirosSolicitados(request).subscribe({
      next: (respuesta: any) => {
    
        // Accediendo a la lista de areas de atención dentro de la respuesta
        if (respuesta.estatus === 'OK') {
          this.totalRetirosSolicitados = respuesta.sumaTotal
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

    this.clienteService.getRetirosEfectuados(request).subscribe({
      next: (respuesta: any) => {
        // Accediendo a la lista de areas de atención dentro de la respuesta
        if (respuesta.estatus === 'OK') {
          this.totalRetirosEfectuados = respuesta.sumaTotal
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
}

