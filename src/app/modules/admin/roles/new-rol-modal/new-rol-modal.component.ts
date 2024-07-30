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

interface ViewValue {
    value: number;
    viewValue: string;
}

@Component({
    selector: 'app-modal-rol',
    templateUrl: './new-rol-modal.component.html',
    styleUrls: ['./new-rol-modal.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatCheckboxModule,
    ],
})
export class ModalNewRol implements OnInit {

    rolForm: FormGroup;
    permisos = [];
    newRol: any;
    usuarioLoggeado: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    estados: ViewValue[] = [
        { value: 1, viewValue: 'Activo' },
        { value: 0, viewValue: 'Inactivo' },
    ];

    constructor(
        public dialogRef: MatDialogRef<ModalNewRol>,
        private fb: FormBuilder,
        private rolService: RolesService,
        private alertService: AlertService,
        private _userService: UserService,
        private perfilamientoService: PerfilamientoService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.usuarioLoggeado = user.id;
            });
        this.rolForm = this.fb.group({
            nombre: ['', Validators.required],
            estatus: ['', Validators.required],
        });
        this.getPermisos();
    }

    get descripcion() {
        return this.rolForm.get('descripcion');
    }

    onClose(): void {
        this.dialogRef.close(this.newRol);
    }

    getPermisos() {
        this.permisos = this.data.permisos;
        this.permisos.forEach((permiso) => {
            this.rolForm.addControl(
                'permiso' + permiso.idPermiso,
                new FormControl(false)
            );
        });
    }

    

    onSubmit(): void {

        if (this.rolForm.valid) {
            const rol: Rol = {
                nombreRol: this.rolForm.value.nombre,
                estatus: this.rolForm.value.estatus,
                fechaCreacion: new Date().toISOString(),
                fechaAct:
                    this.rolForm.value.estatus === 1
                        ? new Date().toISOString()
                        : null,
            };

            this.rolService.createRole(rol).subscribe({
                next: (response) => {
                    if (response.estatus === 'OK') {

                        this.crearPermisoRol(response.dto);
                    
                    } else {
                        this.alertService.error(
                            'Error',
                            'Error al guardar el rol'
                        );
                    }
                },
                error: (error) => {
                    this.alertService.error('Error', 'Error al guardar el rol');
                    console.error(error);
                },
            });
        } else {
            this.rolForm.markAllAsTouched();
        }
    }

    crearPermisoRol(rol:any) {

        this.newRol = rol;
        const selectedPermissions = this.permisos
            .filter(
                (permiso) =>
                    this.rolForm.get('permiso' + permiso.idPermiso).value
            )
            .map((permiso) => permiso);

        selectedPermissions.forEach((permiso) => {

            const perfilamiento = {
                idRol: this.newRol.idRol,
                idPermiso: permiso.idPermiso,
            };

            // Se crea el registro en la tabla roles_permisos
            this.perfilamientoService
                .createPerfilamiento(perfilamiento)
                .subscribe({
                    next: (response) => {

                        if (response.estatus === 'OK') {
                            
                            this.alertService.success(
                                'Rol creado',
                                'El rol se ha creado correctamente'
                            );

                            this.rolForm.reset();
                            this.dialogRef.close(this.newRol);

                        } else {
                            this.alertService.error(
                                'Error',
                                'Error al guardar los permisos'
                            );
                        }
                    },
                    error: (error) => {
                        this.alertService.error(
                            'Error',
                            'Error al guardar los permisos'
                        );
                        console.error(error);
                    },
                });
        });
    }
}
