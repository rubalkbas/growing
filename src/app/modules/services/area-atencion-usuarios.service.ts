import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseDTO } from 'app/mock-api/common/interfaces/response.interface';
import { environment } from 'environments/environment.desa';

@Injectable({
    providedIn: 'root',
})
export class AreaAtencionUsuariosService {

    baseUrl = environment.basePathUrl;

    constructor(private http: HttpClient) {}

    /**
     * Consultar todas las areas de atención de usuarios
     */
    getAreasAtencionUsuarios(): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/area-atencion-usuarios/getAll`);
    }

    /**
     * Consultar area de atención de usuarios por su id
     */
    getAreaAtencionUsuarioById(id: number): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(`${this.baseUrl}/area-atencion-usuarios/area-atencion/${id}`);
    }

    /**
     * Crear area de atención de usuarios
     */
    createAreaAtencionUsuario(areaAtencionUsuario: any): Observable<ResponseDTO<any>> {
        return this.http.post<ResponseDTO<any>>(`${this.baseUrl}/area-atencion-usuarios/save`, areaAtencionUsuario);
    }

    /**
     * Eliminar area de atención de usuarios por su id
     */
    deleteAreaAtencionUsuario(id: number): Observable<ResponseDTO<any>> {
        return this.http.delete<ResponseDTO<any>>(`${this.baseUrl}/area-atencion-usuarios/delete/${id}`);
    }

}