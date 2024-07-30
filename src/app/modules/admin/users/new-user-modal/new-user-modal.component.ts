import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
    FormBuilder,
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
import { AuthService } from 'app/core/auth/auth.service';

interface ViewValue {
    value: number;
    viewValue: string;
}

@Component({
    selector: 'app-modal-user',
    templateUrl: './new-user-modal.component.html',
    styleUrls: ['./new-user-modal.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
    ],
})
export class ModalNewUser {
    userForm: FormGroup;


    estados: ViewValue[] = [
        { value: 1, viewValue: 'Activo' },
        { value: 0, viewValue: 'Inactivo' },
    ];
    usuarioLoggeado: any;
    archivos: File[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    newUser: any;

    constructor(
        public dialogRef: MatDialogRef<ModalNewUser>,
        private fb: FormBuilder,
        private alertService: AlertService,
        private _userService: UserService,
        private _authService: AuthService
    ) {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.usuarioLoggeado = user.id;
                //console.log('Usuario loggeado:', this.usuarioLoggeado);
            });

        this.userForm = this.fb.group({
            nombre: ['', Validators.required],
            correo: ['', Validators.required],
            // pass: ['', Validators.required],
            puesto: ['', Validators.required],
        });

    }

    onClose(): void {
        this.dialogRef.close(this.newUser);
    }

    onSubmit(): void {
        if (this.userForm.valid) {

            const usuario = {
                nombre: this.userForm.get('nombre').value,
                correo: this.userForm.get('correo').value.toLowerCase(),
                pass: this.generateRandomPassword(6),
                puesto: this.userForm.get('puesto').value,
                estatus: 1,
                verificacion: false
            }

            this._authService.registroUsuario(usuario).subscribe({
                next: (response) => {
                    if (response.estatus === 'OK') {
                        this.alertService.success(
                            'Usuario creado',
                            'El usuario se ha creado correctamente'
                        );
                        this.userForm.reset();
                        this.archivos = [];
                        this.newUser = response.dto;
    
                        // Cerrar el modal y pasar el nuevo rol como resultado
                        this.dialogRef.close(this.newUser);
                    } else {
                        this.alertService.error(
                            'Error',
                            response.mensaje
                        );
                    }
                },
                error: (error) => {
                    this.alertService.error(
                        'Error',
                        'Error al guardar el usuario'
                    );
                    console.error(error);
                },
            });
        } else {
            this.userForm.markAllAsTouched();
        }
    }

    generateRandomPassword(length: number): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            password += chars[randomIndex];
        }
        return password;
    }
}
