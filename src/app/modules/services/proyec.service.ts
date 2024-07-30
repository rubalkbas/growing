import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Ticket } from 'app/mock-api/common/interfaces/ticket.interface';
import { ResponseDTO } from 'app/mock-api/common/interfaces/response.interface';
import { environment } from 'environments/environment.desa';
import { Proyecto } from 'app/mock-api/common/interfaces/proyects.interface';

@Injectable({
    providedIn: 'root',
})
export class ProyectsService {

    baseUrl = environment.basePathUrl;

    constructor(private http: HttpClient) {}

    /**
     * Get all proyects
     * @returns ResponseDTO<any> with all proyects
     */
    getProyects(): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/proyectos/consultaTodos`);
    }

    createProyecto(proyecto: Proyecto): Observable<ResponseDTO<any>> {
        return this.http.post<ResponseDTO<any>>(`${this.baseUrl}/proyectos/agregarProyecto`, proyecto);
    }

    updateProyecto(proyecto: Proyecto): Observable<ResponseDTO<any>> {
        return this.http.put<ResponseDTO<any>>(`${this.baseUrl}/proyectos/actualizaProyecto`, proyecto);
    }

    consultaUnProyectoPorId(id: number): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/proyectos/consultaId/${id}`);
    }

    consultaPersonasProyecto(id: number): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/personal-ticket/proyecto/${id}`);
    }

    asignarPersonaProyecto(personal): Observable<ResponseDTO<any>> {
        return this.http.post<ResponseDTO<any>>(`${this.baseUrl}/personal-ticket`,personal);
    }

    borrarPersonaProyecto(id: number): Observable<ResponseDTO<any>> {
        return this.http.delete<ResponseDTO<any>>(`${this.baseUrl}/personal-ticket/${id}`);
    }

    putProyectsProgreso(proyecto): Observable<ResponseDTO<any>> {
        return this.http.put<ResponseDTO<any>>(`${this.baseUrl}/proyectos/actualizaProgresoProyecto`,proyecto);
    }

}