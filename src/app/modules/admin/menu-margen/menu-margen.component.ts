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
import { ModalNewTicket } from 'app/modules/modal-nvo-ticket/nvo-ticket-modal/nvo-ticket.modal.component';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { BehaviorSubject, Subject, Subscription, takeUntil } from 'rxjs';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
 
import { MatCardModule } from '@angular/material/card';
import { ITradingViewWidget, TradingviewWidgetModule } from 'angular-tradingview-widget';
import { WebSocketRxjsService } from '@ittiva/services/websoctekt.service'; 

 

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
  selector: 'menu-margen',
  templateUrl: './menu-margen.component.html',
  styleUrls: ['./menu-margen.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
 
  imports: [CommonModule, MatButtonModule, MatPaginatorModule, MatIconModule, MatMenuModule, MatDividerModule, NgApexchartsModule, MatTableModule, MatSortModule, NgClass, MatProgressBarModule, CurrencyPipe, DatePipe, MatCardModule,TradingviewWidgetModule,NgFor],
})
export class MenuMargenComponent implements OnInit {
 
   
  posicion = 0;
  balance = 1300;
  margenLibre = 300;
  margen = 1000;
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
    
  }

   handleMessage(message: any): void {
    // Suponiendo que el mensaje contiene el valor de la moneda en `a` y el tipo de moneda en `s`
    const currencyCode = message.s;  // e.g., "EURJPY"
    const newValue = parseFloat(message.a);  // e.g., 165.8723
 
  }

  sendMessage( ): void {
    this.websocketService.sendMessage( {"action": "subscribe", "symbols": "EURUSD,EURJPY,EURMXN,GBPUSD,EURCAD,EURAUD,CHFAUD,CHFCAD,CHFGBP,EURSGD,GBPPLN,GBPNZD,CHFNOK,CHFMXN,ZAREUR,EURCHF,GBPJPY,GBPCHF,AUDUSD,NZDUSD,USDCAD,XAUUSD,EUREUR,EURNZD,EURPLN,GBPEUR,GBPAUD,GBPNOK,GBPNOK,GBPMXN,CHFGBP,USDMXN"} );
  }

 
 

}

