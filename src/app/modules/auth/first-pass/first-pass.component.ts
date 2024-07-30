import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ittivaAnimations } from '@ittiva/animations';
import { IttivaAlertComponent, ittivaAlertType } from '@ittiva/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/modules/services/alerts.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector     : 'auth-first-pass',
    templateUrl  : './first-pass.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : ittivaAnimations,
    standalone   : true,
    imports      : [RouterLink, IttivaAlertComponent, NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
})
export class FirstPassComponent implements OnInit
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: ittivaAlertType; message: string } = {
        type   : 'success',
        message: '',
    };
    firstPassForm: UntypedFormGroup;
    showAlert: boolean = false;
    private _unsubscribeAllUsuario: Subject<any> = new Subject<any>();
    usuarioLoggeado: any;


    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _userService: UserService,
        private alertService: AlertService,


    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form

        this._userService.user$
        .pipe((takeUntil(this._unsubscribeAllUsuario)))
        .subscribe((user: any) => {
        //   console.log("este es el usuraio ",user);
            this.usuarioLoggeado = user.id;
        });


        this.firstPassForm = this._formBuilder.group({
            passAntigua     : ['', Validators.required],
            passNueva  : ['', Validators.required]
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    cambiarPass()
    {
        let cambiarPass = {
            idUsuario: this.usuarioLoggeado,
            passAntigua: this.firstPassForm.get('passAntigua').value,
            passNueva: this.firstPassForm.get('passNueva').value,
        }
        this._authService.cambiarPass(cambiarPass).subscribe({
            next: (response) => {
                if(response.estatus == 'ERROR'){
                    this.alert.type = 'error';
                    this.alert.message = response.mensaje;
                    this.showAlert = true;
                    return;
                }

                this._authService.signOut();
                this.alertService.success(
                    'Contraseña actualizada',
                    'La contraseña se ha actualizado correctamente, por favor inicia sesión nuevamente'
                );
                this._router.navigate(['sign-in']);

                
            },
            error: (error) => {
                // Manejar el error si ocurre
                this.alert.type = 'error';
                this.alert.message = 'Error al actualizar la contraseña';
                this.showAlert = true;
                this.firstPassForm.reset();                

            }
        });
    }
}
