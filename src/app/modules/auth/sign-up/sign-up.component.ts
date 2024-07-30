import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { ittivaAnimations } from '@ittiva/animations';
import { IttivaAlertComponent, ittivaAlertType } from '@ittiva/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { AlertService } from 'app/modules/services/alerts.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: ittivaAnimations,
    standalone: true,
    imports: [RouterLink, NgIf, IttivaAlertComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
})
export class AuthSignUpComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: ittivaAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signUpForm: UntypedFormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private alertas: AlertService,
        private _router: Router,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signUpForm = this._formBuilder.group({
            nombre: ['', Validators.required],
            correo: ['', [Validators.required, Validators.email]],
            pass: ['', Validators.required],
            puesto: ['', Validators.required],
        },
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    registroUsuario() {
        let registroUsuario = {
            nombre: this.signUpForm.get('nombre').value,
            correo: this.signUpForm.get('correo').value.toLowerCase(),
            pass: this.signUpForm.get('pass').value,
            puesto: this.signUpForm.get('puesto').value,
            verificacion: true,
            estatus: 0,
        }
        this._authService.registroUsuario(registroUsuario).subscribe({
            next: (response) => {
                // console.log(response);
                this.alertas.success("Registro exitoso", "Usuario registrado correctamente");
            },
            error: (error) => {
                // Manejar el error si ocurre
                this.alertas.error("Error", "Ocurrió un error al registrar el usuario");
            },
        }
        );
    }
}
