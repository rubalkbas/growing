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
import { ExampleService } from 'app/modules/admin/divisas/tickets.service';
import { ModalNewTicket } from 'app/modules/modal-nvo-ticket/nvo-ticket-modal/nvo-ticket.modal.component';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { BehaviorSubject, Subject, Subscription, takeUntil } from 'rxjs';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
 
import { MatCardModule } from '@angular/material/card';
import { ITradingViewWidget, TradingviewWidgetModule } from 'angular-tradingview-widget';
import { WebSocketRxjsService } from '@ittiva/services/websoctekt.service';
import { ComprarModalComponent } from './comprar-modal/comprar.component';

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
  selector: 'tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ],
  imports: [CommonModule, MatButtonModule, MatPaginatorModule, MatIconModule, MatMenuModule, MatDividerModule, NgApexchartsModule, MatTableModule, MatSortModule, NgClass, MatProgressBarModule, CurrencyPipe, DatePipe, MatCardModule,TradingviewWidgetModule,NgFor],
})
export class MateriasPrimasComponent implements OnInit {
  displayedColumns: string[] = ['position', 'instrumento', 'variacion', 'vender', 'comprar' ];
  cryptos = [
    { position: 1, symbol: 'BTC', change: '2%', sell: '$30,000', buy: '$29,500' },
    { position: 2, symbol: 'ETH', change: '1.5%', sell: '$2,000', buy: '$1,950' },
    { position: 3, symbol: 'LTC', change: '0.5%', sell: '$100', buy: '$95' },
    { position: 4, symbol: 'XRP', change: '3%', sell: '$0.50', buy: '$0.48' },
    { position: 5, symbol: 'BCH', change: '1%', sell: '$600', buy: '$590' },
    { position: 6, symbol: 'EOS', change: '2.5%', sell: '$4', buy: '$3.90' },
    { position: 7, symbol: 'BNB', change: '1.2%', sell: '$300', buy: '$295' },
    { position: 8, symbol: 'USDT', change: '0%', sell: '$1', buy: '$1' },
    { position: 9, symbol: 'ADA', change: '0.8%', sell: '$1.20', buy: '$1.15' },
    { position: 10, symbol: 'DOT', change: '1.3%', sell: '$15', buy: '$14.50' },
  ];
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
  /**
   * Constructor
   */
  constructor(private websocketService: WebSocketRxjsService,
    public dialog: MatDialog,
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
    let miArreglo = ["btc", "eth","ltc","alpha","ada","bnb","doge","avax","shib","bch","dot","trx","link","matic","icp","near","uni","dai","apt","stx","fil","atom","arb","wif","mkr","inj","grt","op","jup","flow","pepe"];
 
    this.websocketService.connect('wss://ws.eodhistoricaldata.com/ws/forex?api_token=667d8404377b62.46044727');
    this.subscription = this.websocketService.onMessage().subscribe(
      message => this.handleMessage(message)
      
    );
    this.sendMessage();
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
      width: '20%',
      height: '80%',
        data: { data: data, usuario: 'Usuario de prueba' },
    });

    dialogRef.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
  
    });
}

}

