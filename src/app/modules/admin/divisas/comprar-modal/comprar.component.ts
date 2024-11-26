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
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
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
import { MatIcon } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ApuestaRequest } from '../../models/apuesta';
import { ClienteService } from '../../clientes/clientes.service';
interface ViewValue {
    value: number;
    viewValue: string;
}

@Component({
    selector: 'app-comprar-modal',
    templateUrl: './comprar.component.html',
    styleUrls: ['./comprar.component.scss'],
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
        MatDividerModule,
        MatSlideToggle
    ],
})
export class ComprarModalComponent implements OnInit {

    rolForm: FormGroup;
    apuesta: ApuestaRequest = new ApuestaRequest();
    permisos = [];
    newRol: any;
    usuarioLoggeado: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    estados: ViewValue[] = [
        { value: 1, viewValue: 'Activo' },
        { value: 0, viewValue: 'Inactivo' },
    ];
    formCliente: FormGroup;

    textVariacion = '0.00'; // replace with your actual value
    showAlert = false;

    boton = false;

    
    constructor(
        public dialogRef: MatDialogRef<ComprarModalComponent>,
        private fb: FormBuilder,
        private alertService: AlertService,
        private clienteService:ClienteService, 
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        console.log(this.data)
        this.data.data.comprar = parseFloat(this.data.data.comprar); 
        this.formCliente = this.fb.group({
            tipom: [true, Validators.required],
            porcentaje: [0, [Validators.required, Validators.min(0)]],
            valorA: [{ value: 0, disabled: true }, Validators.required],
            cierreGanancia: [false],
            porceganancia: [{ value: 0, disabled: true }],
            cierrePerdida: [true],
            porceperdida: [{ value: 0, disabled: true }],
            // Otros controles que puedas tener
        });


    }
    calculate(): void {
        const monto = this.getMonto(); // Obtiene el monto de tu data
        const unidades = this.formCliente.get('porcentaje')?.value || 0;

       // const margenRequerido = monto * unidades;

        const margenRequerido =  (monto / 20) * unidades;

        // Establece el valor del margen requerido en el formulario
        this.formCliente.get('valorA')?.setValue(margenRequerido);
    }

    // Simulación de obtención del monto (esto debe adaptarse según tu lógica de obtención)
    getMonto(): number {
        return this.data.data.comprar || 0; // Aquí asume que data.data.comprar tiene el valor de monto
    }

    onSubmit(): void {
        if (this.formCliente.valid) {
            // Lógica de envío del formulario
            console.log(this.data);
            this.generaApuesta();


        }
    }



    generaApuesta():void{

        this.boton = true;
                
        this.apuesta.bloqueCompra = 'DIVISA';
        this.apuesta.compra = this.data.data.instrumento;
        this.apuesta.idUsuario = localStorage.getItem('idUserWrog');
        this.apuesta.montoApuesta = this.formCliente.get('valorA')?.value;
        this.apuesta.tipoCompra = 'COMPRA';
        this.apuesta.unidades =  this.formCliente.get('porcentaje')?.value;
        this.apuesta.valorUnidad = this.data.data.comprar;
        this.apuesta.variacion = this.data.data.variacion;
        this.apuesta.estatusCompra = 'SISTEMA'
        this.apuesta.fechaCierre = "2024-08-18T16:28:03.032Z";
        this.apuesta.fechaCreacion = "2024-08-18T16:28:03.032Z";
        this.apuesta.gananciaPerdida = 0;

        if(this.apuesta.montoApuesta === 0){

            this.alertService.success('Posición Incompleta!','No se ha indicado cuantas unidades.')
            this.boton = false;

        }else{

            this.clienteService.crearApuesta(this.apuesta).subscribe({
                next: (respuesta: any) => {
               
                  console.log('Respuesta completa: ', respuesta);
                  // Accediendo a la lista de areas de atención dentro de la respuesta
                 
                  if (respuesta.estatus === 'OK') {
    
                    this.alertService.success('Posición Generada!','La Posición a sido registrada correctamente.')
                    this.dialogRef.close();
    
                  } else if (respuesta.estatus === 'FALTA'){
    
                    this.alertService.success('Posición No Generada!','No tienes el suficiente margen requerido.')
                    this.dialogRef.close();                
    
                  }
                },
                error: (error: Error) => {
                  console.error(error);
                },
              });
		
		}

       



    }

    // Métodos para aumentar/disminuir unidades
    increaseIncrement(): void {
        let unidades = this.formCliente.get('porcentaje')?.value || 0;
        unidades++;
        this.formCliente.get('porcentaje')?.setValue(unidades);
    }

    decreaseIncrement(): void {
        let unidades = this.formCliente.get('porcentaje')?.value || 0;
        if (unidades > 0) {
            unidades--;
            this.formCliente.get('porcentaje')?.setValue(unidades);
        }
    }


    ngOnInit(): void {
        this.calculate(); // Llama a calcular al iniciar para establecer el valor inicial de margen requerido

        // Suscribir cambios en monto y unidades para recalcular el margen requerido
        this.formCliente.get('porcentaje')?.valueChanges.subscribe(() => {
            this.calculate();
        });
    }

    get descripcion() {
        return this.rolForm.get('descripcion');
    }

    onClose(): void {
        this.dialogRef.close(this.newRol);
    }






}
