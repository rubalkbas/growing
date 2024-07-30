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
export class PerfilamientoService {

    baseUrl = environment.basePathUrl;

    constructor(private http: HttpClient) {}

    /**
     * Consultar permisos
     */
    getPermisos(): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/permiso/getAll`);
    }

    /**
     * Crear permiso
     */
    createPermiso(permiso: any): Observable<ResponseDTO<any>> {
        return this.http.post<ResponseDTO<any>>(`${this.baseUrl}/permiso/save`, permiso);
    }

    /**
     * Generar rol-permiso
     */
    createPerfilamiento(perfilamiento: any): Observable<ResponseDTO<any>> {
        return this.http.post<ResponseDTO<any>>(`${this.baseUrl}/permisos-roles/save`, perfilamiento);
    }

    /**
     * Eliminar rol-permiso por su id
     */

    deletePerfilamiento(id: number): Observable<ResponseDTO<any>> {
        return this.http.delete<ResponseDTO<any>>(`${this.baseUrl}/permisos-roles/delete/${id}`);
    }

    /**
     * Elimitar rol-permiso
     */
    deletePerfilamientoByRolId(id: number): Observable<ResponseDTO<any>> {
        return this.http.delete<ResponseDTO<any>>(`${this.baseUrl}/permisos-roles/delete/rol/${id}`);
    }

    /**
     * Consultar permisos por rol
     */
    getPermisosByRol(idRol: number): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/permisos-roles/rol/${idRol}`);
    }

}