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
import { ComprarModalComponent } from './comprar-modal/comprar.component';
import { TradingViewWidgetComponent } from '../tradingViewWidget/trading-view-widget.component';
import { TradingViewWidgetService } from '../tradingViewWidget/trading-view-widget.service';
import { WebSocketService } from '@ittiva/services/webSockete';
import { VenderModalComponent } from './vender-modal/vender.component';
import { ClienteService } from '../clientes/clientes.service';

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
  selector: 'divisas',
  templateUrl: './divisas.component.html',
  styleUrls: ['./divisas.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ],
  imports: [CommonModule, MatButtonModule, MatPaginatorModule, MatIconModule, MatMenuModule, MatDividerModule, NgApexchartsModule, MatTableModule, MatSortModule, NgClass, MatProgressBarModule, CurrencyPipe, DatePipe, MatCardModule,NgFor,TradingViewWidgetComponent],
})
export class DivisasComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['position', 'instrumento', 'variacion', 'vender', 'comprar' ];
  selectedSymbol: string = 'AAPL'; 

  
  public messages: any;
  private subscription: Subscription;
  posicion = 0;
  balance = 1300;
  margenLibre = 300;
  margen = 1000;
  datasource = new MatTableDataSource<CurrencyMoneda>();
  listaDatos: CurrencyMoneda[];
  dinero: any;
  /**
   * Constructor
   */
  constructor(private websocketService: WebSocketRxjsService,
    public dialog: MatDialog,private tradingViewWidgetService: TradingViewWidgetService,
    private webSocketService:WebSocketService,
    private clienteService: ClienteService
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
  private messageSubscription!: Subscription;
  public messages2: string[] = [];

  ngOnInit(): void { 
    this.messages = [];
    this.listaDatos = [];
    let miArreglo = ["btc", "eth","ltc","alpha","ada","bnb","doge","avax","shib","bch","dot","trx","link","matic","icp","near","uni","dai","apt","stx","fil","atom","arb","wif","mkr","inj","grt","op","jup","flow","pepe"];
 
    this.websocketService.connect('wss://ws.eodhistoricaldata.com/ws/forex?api_token=667d8404377b62.46044727');
    this.subscription = this.websocketService.onMessage().subscribe(
      message => this.handleMessage(message)
      
    );
    this.sendMessage();



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
  
   handleMessage(message: any): void {
    // Suponiendo que el mensaje contiene el valor de la moneda en `a` y el tipo de moneda en `s`
    const currencyCode = message.s;  // e.g., "EURJPY"
    const newValue = parseFloat(message.a);  // e.g., 165.8723

    this.updateCurrencyData(currencyCode, newValue,message);
  }

  sendMessage( ): void {
    this.websocketService.sendMessage( {"action": "subscribe", "symbols": "EURUSD,EURJPY,EURMXN,GBPUSD,EURCAD,EURAUD,CHFAUD,CHFCAD,CHFGBP,EURSGD,GBPPLN,GBPNZD,CHFNOK,CHFMXN,ZAREUR,EURCHF,GBPJPY,GBPCHF,AUDUSD,NZDUSD,USDCAD,XAUUSD,EUREUR,EURNZD,EURPLN,GBPEUR,GBPAUD,GBPNOK,GBPNOK,GBPMXN,CHFGBP,USDMXN"} );
  }

  updateCurrencyData(currencyCode: string, newValue: number, lodemas :any): void {
    const previousValue = this.currencies[currencyCode]?.value || newValue;
    let change = 'sin cambios';
    let datos: CurrencyMoneda = {
      position: 0,
      instrumento: '',
      variacion: '',
      vender: '',
      comprar: '',
      change:''

    }

    datos.position = this.posicion + 1;
    this.posicion = this.posicion +1;


    if (newValue > previousValue) {
      change = 'up';
    } else if (newValue < previousValue) {
      change = 'down';
    }

    datos.instrumento = currencyCode;
    datos.variacion =  lodemas.dc ;
    datos.comprar =  lodemas.a ;
    datos.vender =   lodemas.b ;
    datos.change = change;
    const dataArray = this.listaDatos;

    if(datos.vender !== 'NaN' && datos.position !== 1){

      const index = dataArray.findIndex(item => item.instrumento === datos.instrumento);

      if (index >= 0) {
        dataArray[index] = datos;
      } else {
        dataArray.push(datos);
      } 
    }
  

    this.datasource.data = dataArray;
    this.currencies[currencyCode] = {
      value: newValue,
      change: change,
      position: datos.position,
      instrumento: datos.instrumento,
      variacion: datos.variacion,
      vender: datos.vender,
      comprar: datos.comprar

    };

    // Emitir la actualización a los suscriptores
    this.currenciesSubject.next(this.currencies);
  }
  openDialog(data:any): void {
    const dialogRef = this.dialog.open(ComprarModalComponent, {
      width: '22%',
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

ngOnDestroy(): void {
  if (this.subscription) {
    this.subscription.unsubscribe();
  }
  this.webSocketService.disconnect();
  }
 
}

