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
export class PlantillaService {

    baseUrl = environment.basePathUrl;

    constructor(private http: HttpClient) {}

    /**
     * Consultar plantillas activas
     * @returns 
     */
    getActiveTemplates(): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/plantilla/activas`);
    }

    /**
     * Editar plantilla
     * @returns 
     */
    editTemplate(template: any): Observable<ResponseDTO<any>> {
        return this.http.put<ResponseDTO<any>>(`${this.baseUrl}/plantilla/update`, template);
    }

    /**
     * Guardar plantilla
     * @returns 
     */
    saveTemplate(template: any): Observable<ResponseDTO<any>> {
        return this.http.post<ResponseDTO<any>>(`${this.baseUrl}/plantilla/save`, template);
    }

    /**
     * Consultar estados de una plantilla
     * @returns 
     */
    getTemplateStates(idPlantilla: number): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/estatusPlantilla/findByPlantillaId/${idPlantilla}`);
    }

    /**
     * Guardar estado de una plantilla
     * @returns 
     */
    saveTemplateState(estado: any): Observable<ResponseDTO<any>> {
        return this.http.post<ResponseDTO<any>>(`${this.baseUrl}/estatusPlantilla/save`, estado);
    }

    /**
     * Editar estado de una plantilla
     * @returns 
     */
    editTemplateState(estado: any): Observable<ResponseDTO<any>> {
        return this.http.put<ResponseDTO<any>>(`${this.baseUrl}/estatusPlantilla/update`, estado);
    }

    /**
     * Eliminar estado de una plantilla
     * @returns 
     */
    deleteTemplateState(idEstado: number): Observable<ResponseDTO<any>> {
        return this.http.delete<ResponseDTO<any>>(`${this.baseUrl}/estatusPlantilla/delete/${idEstado}`);
    }

}