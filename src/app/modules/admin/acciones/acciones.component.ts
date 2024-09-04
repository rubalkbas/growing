
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
import { TradingViewWidgetService } from '../tradingViewWidget/trading-view-widget.service';
import { WebSocketFondoService } from '@ittiva/services/websoctektFondos.service';
import { ClienteService } from '../clientes/clientes.service';
import { VenderModalComponent } from '../criptomonedas/vender-modal/vender.component'; 

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
  selector: 'acciones',
  templateUrl: './acciones.component.html',
  styleUrls: ['./acciones.component.scss'],
  encapsulation: ViewEncapsulation.None, 
  standalone: true,
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ],
  imports: [CommonModule, MatButtonModule, MatPaginatorModule, MatIconModule, MatMenuModule, MatDividerModule, NgApexchartsModule, MatTableModule, MatSortModule, NgClass, MatProgressBarModule, CurrencyPipe, DatePipe, MatCardModule,NgFor],
})
export class AccionesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [  'instrumento', 'vender', 'comprar' ];
  selectedSymbol: string = 'AAPL'; 

  
  public messages: any;
  private subscription: Subscription;
  posicion = 0;
  balance = 1300;
  margenLibre = 300;
  margen = 1000;
  datasource = new MatTableDataSource<any>();
  listaDatos: any[];
  dinero: any;
  /**
   * Constructor
   */
  constructor(private websocketService: WebSocketFondoService,
    public dialog: MatDialog,private tradingViewWidgetService: TradingViewWidgetService,
    private clienteService: ClienteService
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  private currencies: { [key: string]: any } = {};
  private currenciesSubject = new BehaviorSubject<{ [key: string]: any }>({});
  private messageSubscription!: Subscription;
  public messages2: string[] = [];

  ngOnInit(): void { 
    this.messages = [];
    this.listaDatos = [];
    this.websocketService.connect('wss://ws.eodhistoricaldata.com/ws/us-quote?api_token=667d8404377b62.46044727');
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
    const newValue = parseFloat(message.ap);  // e.g., 165.8723
    const newValueVender = parseFloat(message.bp);  // e.g., 165.8723
    this.updateCurrencyData(currencyCode, newValue,message,newValueVender);
  }

  sendMessage( ): void {
    this.websocketService.sendMessage( {"action": "subscribe", "symbols": "AMZN,TSLA,MSFT,NVDA,AAPL,GOOG,META,LLY,JNJ,ORCL,ADBE,UBER,SBUX,MCD,KO,WMT,PFE,AZN,BABA,PEP,BBVA,MA,INTC,ERII,BE,CARR,CMI"} );
  }

  updateCurrencyData(currencyCode: string, newValue: number, lodemas :any, newValueVender :any): void {
    //const previousValue = this.currencies[currencyCode]?.value || newValue;
    let changeV = 'sin cambios';
    let changeC = 'sin cambios';
    let changeVa = 'sin cambios';
    

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

    const index = this.listaDatos.findIndex(item => item.instrumento === lodemas.s);

    if(index > 0 ){


  
    const venderValueFloat = parseFloat(this.listaDatos[index].vender);
    const comprarValueFloat = parseFloat(this.listaDatos[index].comprar);
    const variacionValueFloat = parseFloat(this.listaDatos[index].variacion);
    
    datos.position = this.posicion + 1;
  

    if (newValue > comprarValueFloat) {
      changeC = 'up';
    } else if (newValue < comprarValueFloat) {
      changeC = 'down';
    }

    if (newValueVender > venderValueFloat) {
      changeV = 'up';
    } else if (newValueVender < venderValueFloat) {
      changeV = 'down';
    }
 

    datos.instrumento = currencyCode;
    datos.variacion =  lodemas.dc ;
    datos.comprar =  lodemas.a ;
    datos.vender =   lodemas.b ;
    datos.changeV = changeV;
    datos.changeC = changeC;
    datos.changeVa = changeVa;
 
    this.listaDatos[index].vender = newValueVender;
    this.listaDatos[index].comprar = newValue; 
    this.listaDatos[index].changeV = changeV;
    this.listaDatos[index].changeC = changeC;
    this.listaDatos[index].changeVa = changeVa;


  // Emitir la actualización a los suscriptores
  this.currenciesSubject.next(this.currencies);
  }else{

    datos.instrumento = currencyCode;
    datos.comprar =  lodemas.ap ;
    datos.vender =   lodemas.bp ;
    datos.changeV = changeV;
    datos.changeC = changeC;
    datos.changeVa = changeVa;
    this.listaDatos.push(datos);
 
    this.currenciesSubject.next(datos);
  }

  this.datasource.data = this.listaDatos;
 
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
    width: '80%',
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
  this.websocketService.close();
  }
}

