import { CommonModule, CurrencyPipe, DatePipe, NgClass, NgFor, getCurrencySymbol } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';  
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts'; 
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
 
import { MatCardModule } from '@angular/material/card';
import { ITradingViewWidget, TradingviewWidgetModule } from 'angular-tradingview-widget';
import { WebSocketRxjsService } from '@ittiva/services/websoctekt.service'; 
import { TradingViewWidgetService } from './trading-view-widget.service';
import { Subscription } from 'rxjs';

 
declare const TradingView: any;
 

@Component({
  selector: 'trading-view-widget',
  templateUrl: './trading-view-widget.component.html',
  styleUrls: ['./trading-view-widget.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
 
  imports: [CommonModule, MatButtonModule, MatPaginatorModule, MatIconModule, MatMenuModule, MatDividerModule, NgApexchartsModule, MatTableModule, MatSortModule, NgClass, MatProgressBarModule, CurrencyPipe, DatePipe, MatCardModule,TradingviewWidgetModule,NgFor],
})
export class TradingViewWidgetComponent implements OnInit, OnChanges, OnDestroy {
 
  @Input() symbol: string = 'AAPL';
 
  @Input() width: string | number = '100%'; // Ancho
  @Input() height: string | number = 550; // Altura
  private widget: any;
  private subscriptions: Subscription = new Subscription();
  /**
   * Constructor
   */
  constructor(private websocketService: WebSocketRxjsService,private tradingViewWidgetService: TradingViewWidgetService,
    public dialog: MatDialog,
  ) {
  }

 

  
  ngOnInit(): void { 
    this.subscriptions.add(
      this.tradingViewWidgetService.symbol$.subscribe((symbol) => {
        this.symbol = symbol;
        this.initializeWidget();
      })
    );

    if(this.widget){
      this.ngOnDestroy();
    }
 
    this.initializeWidget();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.widget && (changes['symbol'] || changes['interval'] || changes['theme'] || changes['locale'])) {
      this.updateWidget();
    }
  }
  
  ngOnDestroy() {
 
  }
  initializeWidget() {
    this.widget = new TradingView.widget({
      symbol: this.symbol,
      interval: 'D',
      theme: 'light',
      locale: 'en',
      container_id: 'tradingview-widget-container',
      width: '550',
      height: '1200',
      autosize: true,
      timezone: "Etc/UTC",
      style: "1",
      toolbar_bg: "#f1f3f6",
      enable_publishing: false,
      withdateranges: true,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      save_image: false,
    });
  }

  updateWidget() {
    if (this.widget) {
      this.widget.remove(); // Método para eliminar el widget de TradingView
    }
    this.initializeWidget();
  }

 
}

