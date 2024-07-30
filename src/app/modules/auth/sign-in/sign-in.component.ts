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

@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : ittivaAnimations,
    standalone   : true,
    imports      : [RouterLink, IttivaAlertComponent, NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
})
export class AuthSignInComponent implements OnInit
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: ittivaAlertType; message: string } = {
        type   : 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
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
        this.signInForm = this._formBuilder.group({
            correo     : ['', [Validators.required, Validators.email]],
            pass  : ['', Validators.required]
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    signIn(): void
{
    // Return if the form is invalid
    if ( this.signInForm.invalid )
    {
        return;
    }

    // Disable the form
    this.signInForm.disable();

    // Hide the alert
    this.showAlert = false;

    // Sign in
    this.signInForm.value.correo = this.signInForm.value.correo.toLowerCase();

    this._authService.signIn(this.signInForm.value).subscribe({
        next: (respuesta: any) => {
            // Check if verificacion is false
            if (respuesta.dto.usuario.verificacion === false) {

                this._router.navigate(['/first-pass']);

            } else {
                // Set the redirect url.
                // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                // to the correct page after a successful sign in. This way, that url can be set via
                // routing file and we don't have to touch here.
                const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

                // Navigate to the redirect url
                this._router.navigateByUrl(redirectURL).then(success => {
                    if (success) {
                        console.log('Navigation to', redirectURL, 'successful');
                    } else {
                        console.error('Navigation to', redirectURL, 'failed');
                    }
                }).catch(error => {
                    console.error('Navigation to', redirectURL, 'error:', error);
                });
                console.log('respuesta:', respuesta);
            }
        },
        error: (response) => {
            // Re-enable the form
            this.signInForm.enable();
    
            // Reset the form
            this.signInNgForm.resetForm();
            console.log('Error', response);
            // Set the alert
            this.alert = {
                type   : 'error',
                message: response.error.mensaje || 'Error al iniciar sesión',
            };
    
            // Show the alert
            this.showAlert = true;
        }
    });
}

}
