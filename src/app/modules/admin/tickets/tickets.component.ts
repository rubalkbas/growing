import { CurrencyPipe, DatePipe, NgClass, NgFor } from '@angular/common';
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
 
import { MatCardModule } from '@angular/material/card';
import { ITradingViewWidget, TradingviewWidgetModule } from 'angular-tradingview-widget';
import { WebsocketService } from '@ittiva/services/websoctekt.service';

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
  selector: 'tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ],
  imports: [MatButtonModule, MatPaginatorModule, MatIconModule, MatMenuModule, MatDividerModule, NgApexchartsModule, MatTableModule, MatSortModule, NgClass, MatProgressBarModule, CurrencyPipe, DatePipe, MatCardModule,TradingviewWidgetModule,NgFor],
})
export class ExampleComponent implements OnInit {
  displayedColumns: string[] = ['position', 'symbol', 'change', 'sell', 'buy', 'actions'];
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
  public messages: string[] = [];
  

  balance = 1300;
  margenLibre = 300;
  margen = 1000;

  /**
   * Constructor
   */
  constructor(private websocketService: WebsocketService
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {

    let miArreglo = ["btc", "eth","ltc","alpha","ada","bnb","doge","avax","shib","bch","dot","trx","link","matic","icp","near","uni","dai","apt","stx","fil","atom","arb","wif","mkr","inj","grt","op","jup","flow","pepe"];
  this.websocketService.connect('wss://ws.eodhistoricaldata.com/ws/forex?api_token=667d8404377b62.46044727').subscribe(message => {
      this.messages.push(message.data);
      console.log(message.data)
    });

  }


  sendMessage(message: string): void {
    this.websocketService.send({ content: message });
  }
}

