import { CommonModule, CurrencyPipe, DatePipe, NgClass, NgFor, getCurrencySymbol } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { ComprarModalComponent } from './comprar-modal/comprar.component';
import { TradingViewWidgetComponent } from '../tradingViewWidget/trading-view-widget.component';
import { TradingViewWidgetService } from '../tradingViewWidget/trading-view-widget.service';
import { WebSocketCriptoService } from '@ittiva/services/websoctektCryptos.service';
import { ClienteService } from '../clientes/clientes.service';
import { VenderModalComponent } from './vender-modal/vender.component';

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
  variacion: number;
  vender: number;
  comprar: number;
  changeV: string;
  changeC: string;
  changeVa:string;
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
  selector: 'criptomonedas',
  templateUrl: './criptomonedas.component.html',
  styleUrls: ['./criptomonedas.component.scss'],
 
  standalone: true, 
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ],
  imports: [TradingViewWidgetComponent, CommonModule, MatButtonModule, MatPaginatorModule, MatIconModule, MatMenuModule, MatDividerModule, NgApexchartsModule, MatTableModule, MatSortModule, NgClass, MatProgressBarModule, CurrencyPipe, DatePipe, MatCardModule,NgFor],
})
export class CriptomonedasComponent implements OnInit {
  displayedColumns: string[] = [  'instrumento', 'variacion', 'vender', 'comprar' ];
  selectedSymbol: string = 'AAPL';
  
  public messages: any;
  private subscription: Subscription;
  posicion = 0;
  balance = 1300;
  margenLibre = 300;
  margen = 1000;
  datasource = new MatTableDataSource<any>();
  listaDatos: CurrencyMoneda[];
  miArreglo: string[];

  stockData: any[] = [];
  sockets: WebSocket[] = [];
  socketSubjects: { [symbol: string]: Subject<any> } = {};
  subscriptions: Subscription[] = [];
  miLista: any[];
  dinero: any;
  /**
   * Constructor
   */
  constructor(
    private websocketService: WebSocketCriptoService,
    public dialog: MatDialog,
    private tradingViewWidgetService: TradingViewWidgetService,
    private clienteService: ClienteService
  ) {

    this.miLista = []
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
    this.miArreglo = ["btc", "eth", "ltc", "alpha", "ada", "bnb", "doge", "avax", "shib", "bch", "dot", "trx", "link", "matic", "icp", "near", "uni", "dai", "apt", "stx", "fil", "atom", "arb", "wif", "mkr", "inj", "grt", "op", "jup", "flow", "pepe"];
   
    this.miArreglo.forEach(symbol => {
      // Crear un Subject para cada símbolo
      this.socketSubjects[symbol] = new Subject<any>();

      const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@ticker`);

      // Manejar los mensajes entrantes del WebSocket
      socket.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        this.socketSubjects[symbol].next(data);  // Emitir los datos a través del Subject
      };

      // Guardar el socket para cerrarlo luego si es necesario
      this.sockets.push(socket);

      // Suscribirse al Subject para escuchar los cambios
      const subscription = this.socketSubjects[symbol].subscribe(data => {
        this.handleSocketData(symbol, data, parseFloat(data.l) ,parseFloat(data.c));  // Manejar los datos recibidos
      });

      // Guardar la suscripción para poder cancelarla en ngOnDestroy
      this.subscriptions.push(subscription);
    });
    let request =
    {

      "idUsuario": localStorage.getItem('idUserWrog'),
      "nombre": "string",
      "pass": "string",
      "rol": "string",
      "tipo": "string",
      "totalDinero": 0
    } 
    this.clienteService.consultaCliente(request).subscribe({
      next: (data: any) => {
     
    
        // Accediendo a la lista de areas de atención dentro de la respuesta
        if (data.estatus === 'OK') {
          this.dinero = data.dto;

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
  ngOnDestroy(): void {
    // Cerrar todos los sockets y cancelar todas las suscripciones cuando se destruya el componente
    this.sockets.forEach(socket => socket.close());
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private handleSocketData(symbol: string,data:any,newValueC:any, newValueV: any): void {
   // console.log(`Data for ${symbol}:`, data);
    let datos  = {
      position: 0,
      instrumento: '',
      variacion: 0,
      vender: 0,
      comprar: 0,
      changeV: '',
      changeC: '',
      changeVa: ''
    };

    let changeV = 'sin cambios';
    let changeC = 'sin cambios';
    let changeVa = 'sin cambios';

    const index = this.miLista.findIndex(item => item.instrumento === symbol);
    if (index >= 0) {
        const newValueVFloat = parseFloat(newValueV);
        const venderValueFloat = parseFloat(this.miLista[index].vender);

        if (newValueVFloat > venderValueFloat) {
          changeV = 'up';
        } else if (newValueVFloat < venderValueFloat) {
          changeV = 'down';
        }

        const newValueCFloat = parseFloat(newValueC);
        const comprarValueFloat = parseFloat(this.miLista[index].comprar);

        if (newValueCFloat > comprarValueFloat) {
          changeC = 'up';
        } else if (newValueCFloat < comprarValueFloat) {
          changeC = 'down';
        }

        const dataPFloat = parseFloat(data.P);
        const variacionValueFloat = parseFloat(this.miLista[index].variacion);

        if (dataPFloat > variacionValueFloat) {
          changeVa = 'up';
        } else if (dataPFloat < variacionValueFloat) {
          changeVa = 'down';
        }

        // Actualizar los datos en la lista
        this.miLista[index].vender = newValueVFloat;
        this.miLista[index].comprar = newValueCFloat;
        this.miLista[index].variacion = dataPFloat;
        this.miLista[index].changeV = changeV;
        this.miLista[index].changeC = changeC;
        this.miLista[index].changeVa = changeVa;
    } else {
        datos.instrumento = symbol;
        datos.vender = parseFloat(newValueV);
        datos.variacion = parseFloat(data.P);
        datos.comprar = parseFloat(data.c);
        datos.changeV = changeV;
        datos.changeC = changeC;
        datos.changeVa = changeVa;
        this.miLista.push(datos);
    }

    // Solo actualizar los datos en lugar de reasignar el datasource
    this.datasource.data = this.miLista;
   
  }

 

  sendMessage( ): void {
    this.websocketService.sendMessage( this.miArreglo);
  }

   
  openDialog(data:any): void {
    const dialogRef = this.dialog.open(ComprarModalComponent, {
      width: '80%',
      height: '80%',
        data: { data: data, usuario: this.dinero.nombre, dinero:this.dinero.totalDinero},
    });

    dialogRef.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
  
    });
}

openDialogVender(data:any): void {
  const dialogRef = this.dialog.open(VenderModalComponent, {
    width: '22%',
    height: '80%',
      data: { data: data, usuario: this.dinero.nombre, dinero:this.dinero.totalDinero},
  });

  dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');

  });
}



onRowClicked(row: any) {
  console.log('Fila seleccionada:', row);
  this.tradingViewWidgetService.updateSymbol(row.instrumento);
 // this.selectedSymbol = row.instrumento;
  // Puedes realizar más acciones con los datos de la fila aquí
}

}

