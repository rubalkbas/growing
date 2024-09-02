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
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ClienteService } from '../../clientes/clientes.service';
import { CreditosModalComponent } from '../../clientes/creditos-modal/creditos.component';
import Swal from 'sweetalert2';
interface ViewValue {
    value: number;
    viewValue: string;
}

@Component({
    selector: 'app-cuenta-modal',
    templateUrl: './cuenta.component.html',
    styleUrls: ['./cuenta.component.scss'],
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
export class CuentaModalComponent implements OnInit {

    idUser: string;
    retirarForm: FormGroup;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CreditosModalComponent>,
        private fb: FormBuilder,
        private clienteService: ClienteService,

    ) {

        this.idUser = localStorage.getItem('idUserWrog');
        this.retirarForm = this.fb.group({
            monto: ['', [Validators.required, Validators.min(1)]],
        });

    }

    ngOnInit(): void {
        console.log(this.data)

    }

    onClose(): void {
        this.dialogRef.close();
    }

    onSubmit() {
        if (this.retirarForm.valid) {
            const monto = Number(this.retirarForm.value.monto);
            if (this.data.balance < monto) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El monto a retirar es mayor al balance.'
                });
                return;
            }
            
            const request = {
                idUsuario: this.data.idUser,
                dinero: monto
            };
            this.cargarRetiro(request);
        }
    }

    cargarRetiro(request) {

        this.clienteService.cargarRetiro(request).subscribe({
            next: (respuesta: any) => {
                console.log('Respuesta completa: ', respuesta);
                // Accediendo a la lista de areas de atención dentro de la respuesta
                if (respuesta.estatus === 'OK') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Retiro Solicitado',
                        text: 'Se ha realizado la solicitud del retiro de forma exitosa.',
                    });
                    this.dialogRef.close();
                } else  if (respuesta.estatus === 'PASA'){
                    Swal.fire({
                        icon: 'error',
                        title: 'Retiro Solicitado',
                        text: respuesta.mensaje
                    });
                }
            },
            error: (error: Error) => {
                console.error(error);
            },
        });
    }





}
