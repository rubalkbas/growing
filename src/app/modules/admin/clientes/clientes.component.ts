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
import { ClienteService } from './clientes.service';
import { BalanceModalComponent } from './balance/balance.component';
import { CreditosModalComponent } from './creditos-modal/creditos.component';
import { RetirosModalComponent } from './retiros-modal/retiros.component';
import { ClienteModalComponent } from './clientes-modal/cliente.component';
import { AbiertasModalComponent } from './abiertas-modal/abiertas.component';
import { CerradasModalComponent } from './cerradas-modal/cerradas.component';
import { ClienteGuardarModalComponent } from './clientes-guardar-modal/cliente-guardar.component';
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
  selector: 'clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ],
  imports: [CommonModule, MatButtonModule, MatPaginatorModule, MatIconModule, MatMenuModule, MatDividerModule, NgApexchartsModule, MatTableModule, MatSortModule, NgClass, MatProgressBarModule, CurrencyPipe, DatePipe, MatCardModule, TradingviewWidgetModule, NgFor],
})
export class ClientesComponent implements OnInit {
  displayedColumns: string[] = ['noCliente', 'nombre', 'correo', 'monto', 'pass', 'edita', 'posiciones', 'accion'];

  widgetConfig: ITradingViewWidget = {
    symbol: 'BITSTAMP:BTCUSD',
    widgetType: 'widget',
    // autosize: true,
    height: 550,
    width: 1200,
    locale: "es"

  }
  public messages: any;
  private subscription: Subscription;
  posicion = 0;
  balance = 1300;
  margenLibre = 300;
  margen = 1000;
  datasource = new MatTableDataSource<CurrencyMoneda>();
  listaDatos: CurrencyMoneda[];
  usuarios: any;
  /**
   * Constructor
   */
  constructor(private websocketService: WebSocketRxjsService,
    public dialog: MatDialog,
    private vlienteService: ClienteService
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  private currencies: { [key: string]: CurrencyData } = {};
  private currenciesSubject = new BehaviorSubject<{ [key: string]: CurrencyData }>({});


  ngOnInit(): void {
    this.messages = [];
    this.listaDatos = [];
    let miArreglo = ["btc", "eth", "ltc", "alpha", "ada", "bnb", "doge", "avax", "shib", "bch", "dot", "trx", "link", "matic", "icp", "near", "uni", "dai", "apt", "stx", "fil", "atom", "arb", "wif", "mkr", "inj", "grt", "op", "jup", "flow", "pepe"];

    this.traeUsuarios();
    
  }

  traeUsuarios(): void {
    this.vlienteService.getUsuarios().subscribe({
      next: (respuesta: any) => {
        console.log('Respuesta completa: ', respuesta);
        // Accediendo a la lista de areas de atención dentro de la respuesta
        if (respuesta.estatus === 'OK') {
          this.usuarios = respuesta.lista;
          this.datasource.data = respuesta.lista;
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



  openDialog(data: any): void {
    const dialogRef = this.dialog.open(BalanceModalComponent, {
      width: '30%',
      height: '80%',
      data: { data: data.idUsuario, usuario: data.nombre },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');

    });
  }
  
  opencDialogCredito(data: any ): void {
    const dialogRef = this.dialog.open(CreditosModalComponent, {
      width: '30%',
      height: '80%',
      // height: '700px'
      data: {
        data: { data: data.idUsuario, usuario: data.nombre },
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('The dialog was closed');
      }
    });
  }

  opencDialogRetiro( data: any): void {
    const dialogRef = this.dialog.open(RetirosModalComponent , {
      width: '60%',
      height: '80%',
      // height: '700px'
      data: {
        data: { data: data.idUsuario, usuario: data.nombre },
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('The dialog was closed');
      }
    });
  }

  
  opencDialogCliente(data: any ): void {
    const dialogRef = this.dialog.open(ClienteModalComponent , {
      width: '550px',
      height: '550px',
      // height: '700px'
      data: {
        data: { data: data.idUsuario, usuario: data.nombre },
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.traeUsuarios();
        console.log('The dialog was closed');
      }
    });
  }

    
  opencDialogAbiertas( data: any): void {
    const dialogRef = this.dialog.open(AbiertasModalComponent , {
      width: '60%',
      height: '80%',
      // height: '700px'
      data: {
        data: { data: data.idUsuario, usuario: data.nombre },
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('The dialog was closed');
      }
    });
  }

  opencDialogCerradas( data: any): void {
    const dialogRef = this.dialog.open(CerradasModalComponent , {
      width: '60%',
      height: '80%',
      // height: '700px'
      data: {
        data: { data: data.idUsuario, usuario: data.nombre },
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('The dialog was closed');
      }
    });
  }

  opencDialogNuevoCliente( ): void {
    const dialogRef = this.dialog.open(ClienteGuardarModalComponent , {
      width: '550px',
      height: '550px',
      // height: '700px'
 
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.traeUsuarios();
        console.log('The dialog was closed');
      }
    });
  }

  

}

