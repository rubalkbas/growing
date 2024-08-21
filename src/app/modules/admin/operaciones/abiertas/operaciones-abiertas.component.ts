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
import { Subject, takeUntil } from 'rxjs';
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
  displayedColumns: string[] = ['tipoCompra', 'compra','valorUnidad', 'unidades','montoApuesta', 'variacion','gananciaPerdida', 'bloqueCompra',  'fechaCreacion','accion' ];
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
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private clienteService: ClienteService,
    public dialog: MatDialog,

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
      data: { idApuestaCliente: idApuestaCliente}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });


}

cerrar(request):void{

  this.clienteService.cerrarApuesta(request).subscribe({
    next: (respuesta: any) => {
       
      // Accediendo a la lista de areas de atención dentro de la respuesta
      if (respuesta.estatus === 'OK') {
        this.alertService.success('APUESTA CERRADA','La apuesta se cerro satisfactoriamente')
        this.datasource.data = respuesta.lista;

      } else {
        this.alertService.error('APUESTA CERRADA','Hubo un problema para cerrar la apuesta, inetentelo de nuevo.')
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
}
