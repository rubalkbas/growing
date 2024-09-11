import { Component, CSP_NONCE, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AlertService } from 'app/modules/services/alerts.service';
import { User } from 'app/core/user/user.types';
import { BehaviorSubject, Subject, Subscription, takeUntil } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { Rol } from 'app/mock-api/common/interfaces/rol.interface';
import { RolesService } from 'app/modules/services/roles.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PerfilamientoService } from 'app/modules/services/perfilamientos.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgApexchartsModule } from 'ng-apexcharts';
import Swal from 'sweetalert2';
import { ClienteService } from '../../clientes/clientes.service';
import { DetalleAbiertasModalComponent } from '../detalle-abiertas-modal/detalle-abiertas-modal.component';
import { WebSocketService } from '@ittiva/services/webSockete';
import { WebSocketService2 } from '@ittiva/services/webSockete2';

interface ViewValue {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-operaciones-abiertas',
  templateUrl: './operaciones-abiertas.component.html',
  styleUrls: ['./operaciones-abiertas.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatIcon,
    MatRadioModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    FormsModule,
    MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule, NgApexchartsModule, NgClass, MatProgressBarModule, CurrencyPipe, DatePipe, MatCardModule
  ],
})

export class OperacionesAbiertasComponent implements OnInit {
  displayedColumns: string[] = ['tipoCompra', 'compra', 'valorUnidad', 'unidades', 'montoApuesta', 'variacion', 'bloqueCompra', 'fechaCreacion', 'ganper', 'accion'];
  rolForm: FormGroup;
  permisos = [];
  newRol: any;
  usuarioLoggeado: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  estados: ViewValue[] = [
    { value: 1, viewValue: 'Activo' },
    { value: 0, viewValue: 'Inactivo' },
  ];
  formCliente: FormGroup;

  showAlert = false;
  total = 0;
  datasource = new MatTableDataSource<any>();
  idUser: string;
  monto: any = 0;

  margenesUsuario: any;
  listaDatos: any;
  posicion = 0;
  private currenciesSubject2 = new BehaviorSubject<{ [key: string]: any }>({});
  private currencies2: { [key: string]: any } = {};
  private subscription2: Subscription;
  totalGanPer: any;

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private clienteService: ClienteService,
    public dialog: MatDialog,
    private webSocketService:WebSocketService2

  ) {

    this.formCliente = this.fb.group({
      tipom: ['venta', Validators.required],
      porcentaje: [0, Validators.required],
      valorA: ['', Validators.required],
      cierreGanancia: [false],
      porceganancia: [''],
      cierrePerdida: [false],
      porceperdida: ['']
    });
    this.idUser = localStorage.getItem('idUserWrog');

  }

  ngOnInit(): void {

    this.margenesUsuario = [];

    this.listaDatos = {
      position: 0,
      idUsuario: 0,
      montoGanPer: ''
  
    };

    this.subscription2 = this.webSocketService.messages$.subscribe(
      message => {
        this.updateCurrencyData(message);
      }
    );

    // console.log(this.data)
    this.rolForm = this.fb.group({
      nombre: ['', Validators.required],
      estatus: ['', Validators.required],
    });

    this.cargaIngreso();

  }

  cargaIngreso(): void {

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

    this.clienteService.consultaAbiertas(request).subscribe({
      next: (respuesta: any) => {
        this.datasource.data = [];
        console.log('Respuesta completa: ', respuesta);
        // Accediendo a la lista de areas de atención dentro de la respuesta
        if (respuesta.estatus === 'OK') {

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

  get descripcion() {
    return this.rolForm.get('descripcion');
  }


  abrirDetalle(idApuestaCliente: any): void {

    const dialogRef = this.dialog.open(DetalleAbiertasModalComponent, {
      width: '70%',
      data: { idApuestaCliente: idApuestaCliente }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });


  }

   
  async cerrar(request): Promise<void> {

 
Swal.fire({
  title: "Esta seguro que desea cerrar esta posición?",
 
  showCancelButton: true,
  confirmButtonText: "Cerrar",
  icon: "warning", 
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
}).then((result) => {
  /* Read more about isConfirmed, isDenied below */
  if (result.isConfirmed) {
    request.gananciaPerdida = this.currencies2[request.idApuestaCliente].montoGanPer;
      this.clienteService.cerrarApuestaWs(request.idApuestaCliente).subscribe({
      next: (respuesta: any) => {
      }
    });

    this.clienteService.cerrarApuesta(request).subscribe({
      next: (respuesta: any) => {

        // Accediendo a la lista de areas de atención dentro de la respuesta
        if (respuesta.estatus === 'OK') {
          this.alertService.success('Posición CERRADA', 'La Posición se cerro satisfactoriamente')

          this.cargaIngreso();

        } else {
          this.alertService.error('Posición CERRADA', 'Hubo un problema para cerrar la Posición, inetentelo de nuevo.')
          console.log(
            'La respuesta no contiene una lista válida de areas de atención.'
          );
        }
      },
      error: (error: Error) => {
        console.error(error);
      },
    });
    
    Swal.fire("Saved!", "", "success");
  } else if (result.isDenied) {
    Swal.fire("Changes are not saved", "", "info");
  }
});



  

  }

  updateCurrencyData(margenes: any): void {
    this.datasource.data.forEach(item2 => {
      // Encuentra el índice del idUsuario en margenes
      const index = margenes.findIndex(item => {
        console.log('Revisando item en margenes:', item);
        if (item.idUsuario) {
          return item.idUsuario.toString() === item2.idApuestaCliente.toString();
        }
        return false;
      });
  
      // Si se encuentra un item con el mismo idUsuario
      if (index >= 0) {
        const datos = {
          position: this.posicion + 1,  // Incrementar posición
          idUsuario: margenes[index].idUsuario,
          montoGanPer: margenes[index].montoGanPer
        };
  
        this.posicion += 1;  // Actualizar posición
  
        // Actualizar currencies2 para el idUsuario correspondiente
        this.currencies2[datos.idUsuario] = {
          position: datos.position,
          idUsuario: datos.idUsuario,
          montoGanPer: datos.montoGanPer
        };


        this.totalGanPer = this.sumarMontoGanPer();

        
        // Emitir la actualización a los suscriptores
        this.currenciesSubject2.next(this.currencies2);
      }
    });
  }
  sumarMontoGanPer() {
    // Verifica que currencies2 no sea nulo o indefinido
    if (!this.currencies2 || Object.keys(this.currencies2).length === 0) {
        return 0;
    }

    // Usamos Object.values para obtener un array de los valores en currencies2 y luego sumamos el campo montoGanPer
    const total = Object.values(this.currencies2).reduce((sum, item) => {
        return sum + (item.montoGanPer || 0); // Aseguramos que montoGanPer sea un número
    }, 0);

    return total;
}

  /*
updateCurrencyData(  margenes :any): void {
 
 
  let datos: any = {
    position: 0,
    idUsuario: 0,
    montoGanPer: ''

  }

  datos.position = this.posicion + 1;
  this.posicion = this.posicion +1;



 
  const dataArray = this.listaDatos;

  this.datasource.data.forEach(item2 => {
      console.log(item2);
        const index = margenes.findIndex(item => {

          console.log('Revisando item en margenes:', item);
          if (item.idUsuario) {
            return item.idUsuario.toString() === item2.idApuestaCliente.toString();
          }
          return false;
        
          
         
      });

        if (index >= 0) {
          dataArray[index] = datos;
        } else {
          dataArray.push(datos);
        } 
    

    

        datos.idUsuario = margenes[index].idUsuario;
        datos.montoGanPer =  margenes[index].montoGanPer ;

      this.margenesUsuario = datos;
      this.currencies2[datos.idUsuario] = {
    
        position: datos.position,
        idUsuario: datos.idUsuario,
        montoGanPer: datos.montoGanPer

      };

      // Emitir la actualización a los suscriptores
      this.currenciesSubject2.next(this.currencies2);
    
  });

    
}*/

}
