import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ittivaAnimations } from '@ittiva/animations';

@Component({
    selector     : 'auth-confirmation-required',
    templateUrl  : './confirmation-required.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : ittivaAnimations,
    standalone   : true,
    imports      : [RouterLink],
})
export class AuthConfirmationRequiredComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
