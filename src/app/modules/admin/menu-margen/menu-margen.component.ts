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
import { WebSocketService } from '@ittiva/services/webSockete';

 

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
  encapsulation: ViewEncapsulation.Emulated,
  standalone: true,
 
  imports: [CommonModule, MatButtonModule, MatPaginatorModule, MatIconModule, MatMenuModule, MatDividerModule, NgApexchartsModule, MatTableModule, MatSortModule, NgClass, MatProgressBarModule, CurrencyPipe, DatePipe, MatCardModule,TradingviewWidgetModule,NgFor],
})
export class MenuMargenComponent implements OnInit {
  private currenciesSubject2 = new BehaviorSubject<{ [key: string]: any }>({});
  private currencies2: { [key: string]: any } = {};
  private subscription2: Subscription;
  posicion = 0;
  balance = 1300;
  margenLibre = 300;
  margen = 1000;
  public messages: any;
  listaDatos: any;
  margenesUsuario: any;
  /**
   * Constructor
   */
  constructor( 
    public dialog: MatDialog,
    private webSocketService:WebSocketService
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
 
  
  ngOnInit(): void { 
    this.margenesUsuario = [];
    this.listaDatos = {
      position: 0,
      idUsuario: 0,
      totalDinero: '',
      margenLibre: '',
      margen: ''
  
    };
    this.subscription2 = this.webSocketService.messages$.subscribe(
      message => {
        this.updateCurrencyData(message);
      }
    );

  }
 
updateCurrencyData(  margenes :any): void {
 
 
  let datos: any = {
    position: 0,
    idUsuario: 0,
    totalDinero: '',
    margenLibre: '',
    margen: ''

  }

  datos.position = this.posicion + 1;
  this.posicion = this.posicion +1;



 
  const dataArray = this.listaDatos;

 

    const index = margenes.findIndex(item => item.idUsuario.toString() === localStorage.getItem('idUserWrog'));

    if (index >= 0) {
      dataArray[index] = datos;
    } else {
      dataArray.push(datos);
    } 
 

 

    datos.idUsuario = margenes[index].idUsuario;
    datos.totalDinero =  margenes[index].totalDinero ;
    datos.margenLibre =  margenes[index].margenLibre ;
    datos.margen =   margenes[index].margen ;

  this.margenesUsuario = datos;
  this.currencies2[datos.idUsuario] = {
 
    position: datos.position,
    idUsuario: datos.idUsuario,
    totalDinero: datos.totalDinero,
    margenLibre: datos.margenLibre,
    margen: datos.margen

  };

  // Emitir la actualización a los suscriptores
  this.currenciesSubject2.next(this.currencies2);
}


   handleMessage(message: any): void {
    // Suponiendo que el mensaje contiene el valor de la moneda en `a` y el tipo de moneda en `s`
    const currencyCode = message.s;  // e.g., "EURJPY"
    const newValue = parseFloat(message.a);  // e.g., 165.8723
 
  }
 

 
 

}

