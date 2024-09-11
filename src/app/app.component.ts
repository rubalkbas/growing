import { ApplicationRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { filter, interval, switchMap } from 'rxjs';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss'],
    standalone : true,
    imports    : [RouterOutlet],
})
export class AppComponent
{
    /**
     * Constructor
     */
    constructor(appRef: ApplicationRef, private swUpdate: SwUpdate)
    {
         if (this.swUpdate.isEnabled) {
      // Chequear actualizaciones cada 6 horas
      const checkInterval = interval(6 * 60 * 60 * 1000);

      appRef.isStable
        .pipe(
          filter((stable) => stable),
          switchMap(() => checkInterval),
          switchMap(() => this.swUpdate.checkForUpdate())
        )
        .subscribe((updateAvailable) => {
          if (updateAvailable) {
            console.log("Nueva versión disponible, notificando al usuario.");
            if (confirm('Nueva versión disponible. ¿Deseas actualizar?')) {
              this.swUpdate.activateUpdate().then(() => document.location.reload());
            }
          }
        });
    }
    }
}
