import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Ticket } from 'app/mock-api/common/interfaces/ticket.interface';
import { ResponseDTO } from 'app/mock-api/common/interfaces/response.interface';
import { environment } from 'environments/environment.desa';
import { RespuestaTicket } from 'app/mock-api/common/interfaces/comments.interface';

@Injectable({
    providedIn: 'root',
})
export class TicketsService {

    baseUrl = environment.basePathUrl;

    constructor(private http: HttpClient) {}

    /**
     * Create a new ticket
     * @param ticket 
     */
    createTicket(ticket: Ticket): Observable<ResponseDTO<any>> {
        return this.http.post<ResponseDTO<any>>(`${this.baseUrl}/ticket/save`, ticket);
    }

    consultaTicketsId(id:any): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/ticket/asignado/` + id);
    }

    consultaTicketsPropios(id:any): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/ticket/solicitante/` + id);
    }
    consultaTicketsAll(): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/ticket/getAll`);
    }

    

    consultaUnTicketPorId(id:any): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/ticket/get/` + id);
    }

    /**
     * Upload a file
     * @param fileData 
     * @returns 
     */
    uploadFile(fileData: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/ticket-archivos/agregar`, fileData);
    }

    getAllUsers(): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/usuarios`);
    }

    updateUserEstatus(user: any): Observable<ResponseDTO<any>> {
        return this.http.put<ResponseDTO<any>>(`${this.baseUrl}/usuarios/actualiza-usuario`, user);
    }

    /**
     * Update a ticket
     */
    updateTicket(ticket: Ticket): Observable<ResponseDTO<any>> {
        return this.http.put<ResponseDTO<any>>(`${this.baseUrl}/ticket/update`, ticket);
    }

    getStatus(): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/estatus_ticket`);
    }

    createComment(comment: RespuestaTicket): Observable<ResponseDTO<any>> {
        return this.http.post<ResponseDTO<any>>(`${this.baseUrl}/respuesta-ticket`, comment);
    }

    getTicketCommentsByTicketId(idTicket: number): Observable<ResponseDTO<any>>{
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/respuesta-ticket/ticket/` + idTicket);
    }

    /**
     * Get attention time
     */
    getAttentionTime(): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/tiempoAtencion/consultaTodos`);
    }

}