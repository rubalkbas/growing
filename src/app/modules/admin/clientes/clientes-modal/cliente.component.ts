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
import { ClienteService } from '../clientes.service';
import Swal from 'sweetalert2';
interface ViewValue {
    value: number;
    viewValue: string;
}

@Component({
    selector: 'app-cliente-modal',
    templateUrl: './cliente.component.html',
    styleUrls: ['./cliente.component.scss'],
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
        FormsModule ,
        MatButtonModule,   MatIconModule, MatMenuModule, MatDividerModule, NgApexchartsModule,   NgClass, MatProgressBarModule, CurrencyPipe, DatePipe, MatCardModule
    ],
})
 
export class  ClienteModalComponent implements OnInit {
  displayedColumns: string[] = ['monto', 'fecha', 'tipo', 'accion' ];
  displayedColumns2: string[] = ['monto',  'tipo','fecha'  ];
    rolForm: FormGroup;
    permisos = [];
    newRol: any;
    usuarioLoggeado: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    estados: ViewValue[] = [
        { value: 1, viewValue: 'Activo' },
        { value: 0, viewValue: 'Inactivo' },
    ];
    userForm: FormGroup;
    divi = 'USD'; // replace with your actual value
    nocliente = '12345'; // replace with your actual value
    montototal = 1000; // replace with your actual value
    textCosto = '0.00'; // replace with your actual value
    textVariacion = '0.00'; // replace with your actual value
    showAlert = false;
    total = 0;
    datasource = new MatTableDataSource<any>();
    idUser: string;
    monto: any = 0;
  datasource2 = new MatTableDataSource<any>();
    constructor(
        public dialogRef: MatDialogRef<ClienteModalComponent>,
        private fb: FormBuilder,
        private alertService:AlertService,
        private clienteService:ClienteService,
        private perfilamientoService: PerfilamientoService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.userForm = this.fb.group({
        nombre: ['', Validators.required], // Campo nombre
        correo: ['', [Validators.required, Validators.email]], // Campo correo
        contrasena: ['', [Validators.required, Validators.minLength(6)]] // Campo contraseña
      });
          this.idUser =  localStorage.getItem('idUserWrog');

    }

    ngOnInit(): void {
   console.log(this.data)
        this.rolForm = this.fb.group({
            nombre: ['', Validators.required],
            estatus: ['', Validators.required],
        });

      this.cargaDatos();
 
    }
// Método para manejar el envío del formulario
onSubmit() {
  if (this.userForm.valid) {
    console.log('Formulario válido', this.userForm.value);
   let req =  {

      "correo": this.userForm.get('correo').value,
      "estatus": 1, 
      "nombre": this.userForm.get('nombre').value,
      "idUsuario": this.data.data.data,
      "pass": this.userForm.get('contrasena').value
    
    }
    this.clienteService.actualizaCliente(req).subscribe({
      next: (data: any) => {
     
   // Accediendo a la lista de areas de atención dentro de la respuesta
        if (data.estatus === 'OK') {
          
          this.alertService.success('Cliente','Modificación realizada correctamente.')
          this.dialogRef.close();
        } else {
                    
          this.alertService.error('Cliente','Modificación no se ejecuto de manera correcta, contacta a sistemas.')
          console.log(
            'La respuesta no contiene una lista válida de areas de atención.'
          );
        }
      },
      error: (error: Error) => {
        console.error(error);
      },
    });
 
    
  } else {
    console.log('Formulario inválido');
  }
}
cargaDatos():void{

      let request =
      {
 
        "idUsuario": this.data.data.data,
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
            
            this.userForm.get('nombre').patchValue(data.dto.nombre);
            this.userForm.get('correo').patchValue(data.dto.correo);
            this.userForm.get('contrasena').patchValue(data.dto.pass);
 
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

      this.clienteService.getRetirosEfectuados(request).subscribe({
        next: (respuesta: any) => {
          this.datasource2.data = [];
      
          // Accediendo a la lista de areas de atención dentro de la respuesta
          if (respuesta.estatus === 'OK') {
            this.datasource2.data = respuesta.lista;
            this.total = respuesta.sumaTotal
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
 
    

    
 

}
