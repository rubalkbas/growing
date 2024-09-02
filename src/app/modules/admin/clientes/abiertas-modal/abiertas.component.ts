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
import { Subject, takeUntil } from 'rxjs'; 
import { MatCheckboxModule } from '@angular/material/checkbox'; 
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
import { ClienteService } from '../clientes.service';
import { AlternaModalComponent } from './alternaInfo/alternaInfo.component';
import { DetalleAbiertasModalComponent } from '../../operaciones/detalle-abiertas-modal/detalle-abiertas-modal.component';
 
interface ViewValue {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-abiertas-modal',
  templateUrl: './abiertas.component.html',
  styleUrls: ['./abiertas.component.scss'],
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

export class AbiertasModalComponent implements OnInit {
  displayedColumns: string[] = ['tipoCompra', 'compra','valorUnidad', 'unidades','montoApuesta', 'variacion','gananciaPerdida', 'bloqueCompra' , 'fechaCreacion','accion' ];
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
    public dialogRef: MatDialogRef<AbiertasModalComponent>,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private alertService: AlertService,
    private clienteService: ClienteService,
    @Inject(MAT_DIALOG_DATA) public data: any
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
    console.log(this.data)
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
      "idUsuario": this.data.data.data,
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

  onClose(): void {
    this.dialogRef.close(this.newRol);
  }


 

  openDialog(data: any): void {
    const dialogRef = this.dialog.open(AlternaModalComponent, {
  
      data: { data: data, usuario: this.data.data.usuario },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');

    });
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

}
