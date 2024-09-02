import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
    selector     : 'landing-home',
    templateUrl  : './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [MatButtonModule, RouterLink, MatIconModule,FormsModule],
})
export class LandingHomeComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }

    newsletterEmail: string = '';

    onSubmitNewsletter(event: Event): void {
      event.preventDefault();
      console.log('Email para newsletter:', this.newsletterEmail);
      // Lógica para enviar el email
    }
}
