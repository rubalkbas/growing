import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalNewTicket } from './nvo-ticket-modal/nvo-ticket.modal.component';

@Component({
    selector     : 'nvo-ticket',
    standalone   : true,
    templateUrl  : './modal-nvo-ticket.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class NvoTicketComponent
{
    constructor(public dialog: MatDialog) {}

    openDialog(): void {
      const dialogRef = this.dialog.open(ModalNewTicket, {
        width: '750px',
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          //console.log('Datos del nuevo ticket:', result);
        }
      });
    }
}
