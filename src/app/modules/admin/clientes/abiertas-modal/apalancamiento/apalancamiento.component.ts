import { Component, CSP_NONCE, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
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
import { ClienteService } from '../../clientes.service';
import Swal from 'sweetalert2';
interface ViewValue {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-apalancamiento-modal',
  templateUrl: './apalancamiento.component.html',
  styleUrls: ['./apalancamiento.component.scss'],
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

export class ApalancamientoModalComponent implements OnInit {
  displayedColumns: string[] = ['tipoCompra', 'compra','valorUnidad', 'unidades','montoApuesta', 'variacion','gananciaPerdida', 'bloqueCompra' , 'fechaCreacion','accion' ];
  userForm: FormGroup;
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
    public dialogRef: MatDialogRef<ApalancamientoModalComponent>,
    private fb: FormBuilder,
    private alertService: AlertService,
    private clienteService: ClienteService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.userForm = this.fb.group({
      apalancamiento1gana: ['', Validators.required],
      apalancamiento2gana: ['', Validators.required],
      apalancamiento1pierde: ['', Validators.required],
      apalancamiento2pierde: ['', Validators.required],
    
    });

    this.userForm.get('apalancamiento1gana').patchValue(this.data.data.unidades);
    this.userForm.get('apalancamiento2gana').patchValue(this.data.data.valorUnidad);
    this.userForm.get('apalancamiento1pierde').patchValue(this.data.data.unidades);
    this.userForm.get('apalancamiento2pierde').patchValue(this.data.data.valorUnidad);

    this.idUser = localStorage.getItem('idUserWrog');

  }

  ngOnInit(): void {
  

  } 

  onClose(): void {
    this.dialogRef.close(this.newRol);
  }



  onSubmit(): void {

   this.data.data.apalancamiento1gana   = this.userForm.get('apalancamiento1gana').value
   this.data.data.apalancamiento2gana   = this.userForm.get('apalancamiento2gana').value
   this.data.data.apalancamiento1pierde = this.userForm.get('apalancamiento1pierde').value
   this.data.data.apalancamiento2pierde = this.userForm.get('apalancamiento2pierde').value

   this.clienteService.actualizaApuesta(this.data.data).subscribe({
    next: (respuesta: any) => {
 
      console.log('Respuesta completa: ', respuesta);
      // Accediendo a la lista de areas de atención dentro de la respuesta
      if (respuesta.estatus === 'OK') {

        this.dialogRef.close(this.newRol);
        this.alertService.success("Apalancamiento","información alterada completamente")
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



}
